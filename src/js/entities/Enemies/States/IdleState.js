import { BaseState } from "./BaseState.js";

/**
 * IdleState - enemy does nothing.
 */
export class IdleState extends BaseState {
    /**
     * @param {BasicEnemyController} controller
     */
    constructor(controller) {
        super(controller);
        this.timer = Phaser.Math.Between(2000, 4000);
    }

    enter() {
        this.controller.movementComponent.setDirection(0, 0);
    }

    update(time, delta) {
        
    }

    exit() {}
}
