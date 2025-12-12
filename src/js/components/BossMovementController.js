import { BaseControllerComponent } from "./BaseController.js";
import { IdleState } from "../entities/Enemies/States/IdleState.js";
import { StrafeState } from "../entities/Enemies/States/StrafeState.js";
import { DirectChaseState } from "../entities/Enemies/States/DirectChaseState.js";
import { EventBus } from "../core/event-bus.js";
import { DamageableComponent } from "./DamageableComponent.js";

export class BossMovementControllerComponent extends BaseControllerComponent {
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
        this.chasingRange = 600;
        this.phase = 1;
        this.damageableComponent = this.gameObject.getComponent(DamageableComponent);
        this.strafeTimer = 0;

        this.states = {
            idle: new IdleState(this),
            chase: new DirectChaseState(this, 80),
            strafe: new StrafeState(this, 50, 1)
        };

        EventBus.on('entityHit', this.onEntityDamaged, this);
        EventBus.on('entityMoved', this.onEntityMoved, this);


		this.gameObject.play("boss_walk",true);
		EventBus.emit("playMusic","CombatMusic");

        this.changeState(initialState);
    }

    changeState(newState) {
        if (this.currentState?.exit) this.currentState.exit();
        this.currentState = this.states[newState];
        this.currentState?.enter();
    }

    onEntityDamaged(data) {
        if (data.target.type == 'player' && this.phase == 2 && data.attacker == this.gameObject) {
            this.damageableComponent.heal(3);
        }
    }

    update(time, delta) {

		let velocity = this.gameObject.getVelocity();
		if (velocity.x != 0) this.gameObject.flipX = velocity.x> 0;

        if (!this.enabled || !this.movementComponent || !this.currentState) return;

        this.currentState.update(time, delta);

        if (this.damageableComponent.currentHP <= this.damageableComponent.maxHP / 2 && this.phase == 1) {
            console.log("Boss entering phase 2.");
            this.phase = 2;
            this.changeState('strafe');
            this.movementComponent.speed *= 1.5;
        }
        if (this.phase == 2 && this.strafeTimer <= 0) {
            this.currentState.direction *= -1;
            this.strafeTimer = 2000;
        }
        else if (this.phase == 2) {
            this.strafeTimer -= delta;
        }
    }

    checkTargetInChasingRange(target) {
        const enemy = this.gameObject;
        const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, target.x, target.y);
        if (distance <= this.chasingRange) {
            return true;
        }
        return false;
    }

    onEntityMoved(data) {
        if (data.entity.type == 'player' && this.checkTargetInChasingRange(data.entity)
         && this.currentState != this.states.chase && this.phase == 1) {
            this.target = data.entity;
            this.changeState('chase');
        }
    }

    destroy() {
        super.destroy();
        EventBus.off('entityDamaged', this.onEntityDamaged, this);
        EventBus.off('entityMoved', this.onEntityMoved, this);
        EventBus.off('playerStartedAiming', this.onPlayerStartedAiming, this);
        EventBus.off('arrowLanded', this.onArrowLanded, this);
    }
}
