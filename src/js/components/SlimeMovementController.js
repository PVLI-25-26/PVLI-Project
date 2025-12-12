import { BaseControllerComponent } from "./BaseController.js";
import { IdleState } from "../entities/Enemies/States/IdleState.js";
import { PatrolState } from "../entities/Enemies/States/PatrolState.js";
import { DirectChaseState } from "../entities/Enemies/States/DirectChaseState.js";
import { StrafeState } from "../entities/Enemies/States/StrafeState.js";
import { RetreatState } from "../entities/Enemies/States/RetreatState.js";
import { EventBus } from "../core/event-bus.js";

export class SlimeMovementControllerComponent extends BaseControllerComponent {
    /**
     * @param {Phaser.GameObjects.GameObject} gameObject
     * @param {string} initialState
     * @param {Array<{x: number, y: number, wait: number}>} patrolRoute
     */
    constructor(gameObject, initialState, patrolRoute) {
        super(gameObject);

        this.currentState = null;
        this.target = null;
        this.initialState = initialState;
        this.aggroRange = 300;
        this.retreatTimer = 150;

        this.states = {
            idle: new IdleState(this),
            patrol: new PatrolState(this, patrolRoute),
            strafe: new StrafeState(this, 50),
            retreat: new RetreatState(this),
        };

        EventBus.on('entityMoved', this.onEntityMoved, this);
        EventBus.on('playerStartedAiming', this.onPlayerStartedAiming, this);
        EventBus.on('arrowLanded', this.onArrowLanded, this);
        EventBus.on('entityDamaged', this.onReceiveDamage, this);
        EventBus.on('entityDied', this.onEntityDied, this);

		this.gameObject.play("slime_idle",true);

        this.changeState(initialState);
    }

    changeState(newState) {
        if (this.currentState?.exit) this.currentState.exit();
        this.currentState = this.states[newState];
        this.currentState?.enter();
    }

    // data = { entity, x, y }
    onEntityMoved(data) {
        if (data.entity.type == 'player' && this.checkTargetInAggroRange(data.entity) && this.target != data.entity)
        {
            if (this.retreatTimer <= 0) {
                this.changeState('strafe');
                this.target = data.entity;
            }
			this.gameObject.play("slime_walk",true);
			EventBus.emit("playMusic","CombatMusic");
        }
    }

    onPlayerStartedAiming() {
        if (this.target && this.checkTargetInAggroRange(this.target) && this.currentState == this.states.strafe) {
            this.currentState.direction *= -1;
        }
    }

    onArrowLanded() {
        if (this.target) {
            this.changeState('strafe');
        }
        else {
            this.changeState(this.initialState);
        }
    }

    onEntityDied(entity) {
        if (entity === this.target) {
            this.target = null;
            this.changeState(this.initialState);
        }
    }

    onReceiveDamage(data) {
        if (data.entity === this.gameObject) {
            this.changeState('retreat');
            this.retreatTimer = 2000;   
        }

        if (data.entity.type == 'enemy' && this.checkTargetInAggroRange(data.entity)) {
            this.aggroRange = 600;
            if (this.target && this.retreatTimer <= 0) {
                this.changeState('strafe');
            }
        }
    }

    update(time, delta) {
        if (!this.enabled || !this.movementComponent || !this.currentState) return;

        if (this.retreatTimer <= 0 && this.currentState == this.states.retreat) {
            this.changeState('strafe');
        }
        if (this.retreatTimer > 0) {
            this.retreatTimer -= delta;
        }
        this.currentState.update(time, delta);
    }

    checkTargetInAggroRange(target) {
        const enemy = this.gameObject;
        const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, target.x, target.y);
        if (distance <= this.aggroRange) {
            return true;
        }
        return false;
    }

    destroy() {
        super.destroy();
        EventBus.off('entityMoved', this.onEntityMoved, this);
        EventBus.off('playerStartedAiming', this.onPlayerStartedAiming, this);
        EventBus.off('arrowLanded', this.onArrowLanded, this);
        EventBus.off('entityDamaged', this.onReceiveDamage, this);
    }
}
