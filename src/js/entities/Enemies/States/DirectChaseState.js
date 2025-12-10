/**
 * ChaseState for enemy AI behavior.
 * Enemy directly chases the player.
 */
export class DirectChaseState {
    constructor(controller, predictOffset = 0) {
        this.controller = controller;
        this.predictOffset = predictOffset;
    }

    enter() {
        
    }

    update(time, delta) {
        const movement = this.controller.movementComponent;
        const enemy = this.controller.gameObject;
        const scene = enemy.scene;

        if (!this.controller.target.active || !movement) return;
        const targetVelocity = this.controller.target.getVelocity();

        const dx = this.controller.target.x + (targetVelocity.x * this.predictOffset) - enemy.x;
        const dy = this.controller.target.y + (targetVelocity.y * this.predictOffset) - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;

        const dirX = dx / distance;
        const dirY = dy / distance;
        movement.setDirection(dirX, dirY);
    }

    exit() {
        this.controller.movementComponent.setDirection(0, 0);
    }
}
