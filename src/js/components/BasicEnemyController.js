import { BaseControllerComponent } from "./BaseController.js";
import { IdleState } from "../entities/Enemies/States/IdleState.js";
import { PatrolState } from "../entities/Enemies/States/PatrolState.js";
import { DirectChaseState } from "../entities/Enemies/States/DirectChaseState.js";
import { StrafeState } from "../entities/Enemies/States/StrafeState.js";
import { RetreatState } from "../entities/Enemies/States/RetreatState.js";
import { EventBus } from "../core/event-bus.js";

export class BasicEnemyControllerComponent extends BaseControllerComponent {
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

        this.states = {
            idle: new IdleState(this),
            patrol: new PatrolState(this, patrolRoute),
            chase: new DirectChaseState(this),
            strafe: new StrafeState(this),
            retreat: new RetreatState(this),
        };

        EventBus.on('entityMoved', this.onEntityMoved, this);
        EventBus.on('playerStartedAiming', this.onPlayerStartedAiming, this);
        EventBus.on('arrowLanded', this.onArrowLanded, this);
        EventBus.on('entityDamaged', this.onReceiveDamage, this);
        this.changeState(initialState);
    }

    changeState(newState) {
        if (this.currentState?.exit) this.currentState.exit();
        this.currentState = this.states[newState];
        this.currentState?.enter();
    }

    // data = { entity, x, y }
    onEntityMoved(data) {
        if (data.entity.type == 'player' && this.checkTargetInRange(data.entity))
        {
            if (this.currentState == this.states.patrol || this.currentState == this.states.idle) {
                this.changeState('chase');
                this.target = data.entity;
            }
        }
    }

    onPlayerStartedAiming() {
        if (this.target && this.checkTargetInRange(this.target)) {
            this.changeState('strafe');
        }
    }

    onArrowLanded() {
        if (this.target && this.checkTargetInRange(this.target)) {
            this.changeState('chase');
        }
        else {
            this.changeState(this.initialState);
        }
    }

    onReceiveDamage(data) {
        if (data.entity != this.gameObject) return
        if (this.target && this.checkTargetInRange(this.target)) {
            this.changeState('chase');
        }
    }

    update(time, delta) {
        if (!this.enabled || !this.movementComponent || !this.currentState) return;

        this.currentState.update(time, delta);
    }

    checkTargetInRange(target) {
        const enemy = this.gameObject;
        const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, target.x, target.y);
        if (distance <= 300) {
            return true;
        }
        return false;
    }
}
