/**
 * IdleState - enemy does nothing.
 */
export class IdleState {
    /**
     * @param {BasicEnemyController} controller
     */
    constructor(controller) {
        this.controller = controller;
        this.timer = Phaser.Math.Between(2000, 4000);
    }

    enter() {
        this.controller.movementComponent.setDirection(0, 0);
    }

    update(time, delta) {
        
    }

    exit() {}
}
