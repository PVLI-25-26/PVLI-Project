import { BaseControllerComponent } from "./BaseController.js";
import { IdleState } from "../entities/Enemies/States/IdleState.js";
import { PatrolState } from "../entities/Enemies/States/PatrolState.js";
import { ChaseState } from "../entities/Enemies/States/ChaseState.js";

export class BasicEnemyControllerComponent extends BaseControllerComponent {
    /**
     * @param {Phaser.GameObjects.GameObject} gameObject
     * @param {string} initialState
     * @param {Array<{x: number, y: number, wait: number}>} patrolRoute
     */
    constructor(gameObject, initialState, patrolRoute) {
        super(gameObject);

        this.currentState = null;

        this.states = {
            idle: new IdleState(this),
            patrol: new PatrolState(this, patrolRoute),
            chase: new ChaseState(this, { chaseDuration: 2000, evadeDuration: 2000 })
        };

        this.changeState(initialState);
    }

    changeState(newState) {
        if (this.currentState?.exit) this.currentState.exit();
        this.currentState = this.states[newState];
        this.currentState?.enter();
    }

    // Example of simple player detection (can be expanded with vision cones, etc.)
    checkTargetInRange(target) {
        if (!target) return;
        if (this.currentState instanceof ChaseState) return;
        const distance = Phaser.Math.Distance.Between(
            this.gameObject.x,
            this.gameObject.y,
            target.x,
            target.y
        );
        if (distance < 200) this.changeState('chase');
    }

    update(time, delta) {
        if (!this.enabled || !this.movementComponent || !this.currentState) return;

        this.checkTargetInRange(this.gameObject.scene.player);
        this.currentState.update(time, delta);
    }
}
