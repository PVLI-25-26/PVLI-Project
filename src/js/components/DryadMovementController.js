import { BaseControllerComponent } from "./BaseController.js";
import { IdleState } from "../entities/Enemies/States/IdleState.js";
import { PatrolState } from "../entities/Enemies/States/PatrolState.js";
import { DirectChaseState } from "../entities/Enemies/States/DirectChaseState.js";
import { EventBus } from "../core/event-bus.js";

export class DryadMovementControllerComponent extends BaseControllerComponent {
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
        this.chasingRange = 200;
        this.onCombat = false;

        this.states = {
            idle: new IdleState(this),
            patrol: new PatrolState(this, patrolRoute),
            chase: new DirectChaseState(this)
        };

        this.animationPatrol = true;
		this.healing = false;

        EventBus.on('entityDamaged', this.onReceiveDamage, this);
        EventBus.on('entityDied', this.onEntityDied, this);
		EventBus.on("DryadHealing",(dryad)=>{if (this.gameObject == dryad) this.healing = true});
		EventBus.on("DryadNotHealing",(dryad)=>{if (this.gameObject == dryad) this.healing = false});

        this.changeState(initialState);
		this.gameObject.play("dryad_idle",true);
    }

    changeState(newState) {
        if (this.currentState?.exit) this.currentState.exit();
        this.currentState = this.states[newState];
        this.currentState?.enter();
    }


    onReceiveDamage(data) {
        if ((data.entity.type === 'enemy' || data.entity.type === 'boss') && data.entity !== this.gameObject) {
            this.target = data.entity;
            this.changeState('chase');
			this.gameObject.play("dryad_walk", true);
        }
    }

    update(time, delta) {
        if (!this.enabled || !this.movementComponent || !this.currentState) return;

        if (this.currentState == this.states.chase && this.target.active == true &&
            this.checkTargetInChasingRange(this.target) == true) {
                this.changeState('idle');
            }
        this.currentState.update(time, delta);
    }

    checkTargetInChasingRange(target) {
        const enemy = this.gameObject;
        const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, target.x, target.y);
        if (distance <= this.chasingRange) {
            return true;
        }
        return false;
    }

    onEntityDied(data) {
        if (data.entity === this.target) {
            this.changeState(this.initialState);
            this.target = null;
        }
    }

    destroy() {
        super.destroy();
        EventBus.off('entityDamaged', this.onReceiveDamage, this);
    }
}
