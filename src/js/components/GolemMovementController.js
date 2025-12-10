import { BaseControllerComponent } from "./BaseController.js";
import { IdleState } from "../entities/Enemies/States/IdleState.js";
import { PatrolState } from "../entities/Enemies/States/PatrolState.js";
import { DirectChaseState } from "../entities/Enemies/States/DirectChaseState.js";
import { EventBus } from "../core/event-bus.js";

export class GolemMovementControllerComponent extends BaseControllerComponent {
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
        this.chasingRange = 300;
        this.onCombat = false;

        this.states = {
            idle: new IdleState(this),
            patrol: new PatrolState(this, patrolRoute),
            chase: new DirectChaseState(this, 50)
        };

        EventBus.on('entityDamaged', this.onEntityDamaged, this);
        EventBus.on('entityMoved', this.onEntityMoved, this);

        this.changeState(initialState);
    }

    changeState(newState) {
        if (this.currentState?.exit) this.currentState.exit();
        this.currentState = this.states[newState];
        this.currentState?.enter();
    }

    onEntityDamaged(data) {
        if (data.entity.type == 'enemy') {
            this.onCombat = true;
            console.log("Golem entering combat mode.");
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

    onEntityMoved(data) {
        if (data.entity.type == 'player' && this.checkTargetInChasingRange(data.entity) == false &&
        this.onCombat == false && this.target != null) {
            this.target = null;
            console.log("Golem lost sight of player, returning to initial state.");
            this.changeState(this.initialState);
            this.onCombat = false;
            return;
        }

        if (data.entity.type == 'player' && this.checkTargetInChasingRange(data.entity)
        && this.onCombat == true && this.currentState != this.states.chase) {
            this.target = data.entity;
            console.log("Golem detected player, switching to chase state.");
            this.changeState('chase');
        }
    }

    destroy() {
        super.destroy();
        EventBus.off('entityDamaged', this.onEntityDamaged, this);
        EventBus.off('entityMoved', this.onEntityMoved, this);
    }
}
