import { BaseControllerComponent } from "./BaseController.js";
import { IdleState } from "../entities/Enemies/States/IdleState.js";
import { PatrolState } from "../entities/Enemies/States/PatrolState.js";
import { DirectChaseState } from "../entities/Enemies/States/DirectChaseState.js";
import { StrafeState } from "../entities/Enemies/States/StrafeState.js";
import { RetreatState } from "../entities/Enemies/States/RetreatState.js";
import { EventBus } from "../core/event-bus.js";

export class ElementalMovementControllerComponent extends BaseControllerComponent {
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
		this.onCombat = false;

        this.states = {
            idle: new IdleState(this),
            patrol: new PatrolState(this, patrolRoute),
            chase: new DirectChaseState(this),
            strafe: new StrafeState(this),
            retreat: new RetreatState(this),
        };

		this.animationPatrol = true;

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
        if (data.entity.type == 'player' && this.checkTargetInAggroRange(data.entity))
        {
            if (this.currentState == this.states.patrol || this.currentState == this.states.idle) {
                this.changeState('chase');
                this.target = data.entity;
            }
			this.animationPatrol = false;
			if (!this.onCombat)
				EventBus.emit("PlayCombatMusic");
        }
    }

    onPlayerStartedAiming() {
        if (this.target && this.checkTargetInAggroRange(this.target)) {
            this.changeState('strafe');
        }
    }

    onArrowLanded() {
        if (this.target && this.checkTargetInAggroRange(this.target)) {
            this.changeState('chase');
        }
        else {
            this.changeState(this.initialState);
        }
    }

    onReceiveDamage(data) {
        this.aggroRange = 600;
        if (this.target) {
            this.changeState('chase');
        }
    }

    update(time, delta) {
        if (!this.enabled || !this.movementComponent || !this.currentState) return;

		this.updateAnimations();

        this.currentState.update(time, delta);
    }


	updateAnimations(){
		let velocity = this.gameObject.getVelocity();
		if (this.animationPatrol){
			this.gameObject.play("elemental_idle",true);
		}
		else{
			this.gameObject.play("elemental_walk",true);
		}
		if (velocity.x != 0) this.gameObject.flipX = velocity.x> 0;

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
