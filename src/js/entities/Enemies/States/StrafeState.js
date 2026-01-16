import { BaseState } from "./BaseState.js";

/**
 * Strafe State for enemy AI behavior.
 * Enemy goes around the player in a circular motion, dodging arrows
 */
export class StrafeState extends BaseState {
    constructor(controller, angle = 70, direction = 0) {
        super(controller);
        this.direction = direction;
        this.angle = angle;
    }

    enter() { 
        if (this.direction === 0) this.direction = Math.random() < 0.5 ? 1 : -1;
    }

    update(time, delta) {
        const movement = this.controller.movementComponent;
        if (!movement || !this.controller.target) return;

        const dx = this.controller.target.x - this.controller.gameObject.x;
        const dy = this.controller.target.y - this.controller.gameObject.y;

       const angle = Phaser.Math.DegToRad(this.angle); 

        // Vector to target
        const tx = dx;
        const ty = dy;

        // Perpendicular vector
        const px =  dy * this.direction;
        const py = -dx * this.direction;

        // Coefficients
        const wForward = Math.cos(angle);
        const wSide    = Math.sin(angle);

        // Combined vector
        let vx = tx * wForward + px * wSide;
        let vy = ty * wForward + py * wSide;

        // Normalize
        const len = Math.sqrt(vx * vx + vy * vy) || 1;
        vx /= len;
        vy /= len;

        movement.setDirection(vx, vy);
    }

    exit() {
        this.controller.movementComponent?.setDirection(0, 0);
    }
}
