/**
 * Strafe State for enemy AI behavior.
 * Enemy goes around the player in a circular motion, dodging arrows
 */
export class StrafeState {
    constructor(controller) {
        this.controller = controller;
        this.direction = 1;
    }

    enter() { 
        this.direction = Math.random() < 0.5 ? 1 : -1;
    }

    update(time, delta) {
        const movement = this.controller.movementComponent;
        if (!movement || !this.controller.target) return;

        const dx = this.controller.target.x - this.controller.gameObject.x;
        const dy = this.controller.target.y - this.controller.gameObject.y;

        // Perpendicular direction
        const px = dy * this.direction;
        const py = -dx * this.direction;
        const len = Math.sqrt(px * px + py * py) || 1;

        movement.setDirection(px / len, py / len);
    }

    exit() {
        this.controller.movementComponent?.setDirection(0, 0);
    }
}
