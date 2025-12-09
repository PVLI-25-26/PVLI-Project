import { BaseControllerComponent } from "./BaseController.js";
import { IdleState } from "../entities/Enemies/States/IdleState.js";
import { PatrolState } from "../entities/Enemies/States/PatrolState.js";
import { DirectChaseState } from "../entities/Enemies/States/DirectChaseState.js";
import { StrafeState } from "../entities/Enemies/States/StrafeState.js";
import { RetreatState } from "../entities/Enemies/States/RetreatState.js";
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

        EventBus.on('entityDamaged', this.onReceiveDamage, this);
        EventBus.on('entityDied', this.onEntityDied, this);

        this.changeState(initialState);

        this.gameObject.scale = 4;
    }

    changeState(newState) {
        if (this.currentState?.exit) this.currentState.exit();
        this.currentState = this.states[newState];
        this.currentState?.enter();
    }


    onReceiveDamage(data) {
        if (data.entity.type === 'enemy' && data.entity !== this.gameObject) {
            this.target = data.entity;
            this.changeState('chase');
        }
    }

    update(time, delta) {
        if (!this.enabled || !this.movementComponent || !this.currentState) return;

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
