import { BaseState } from "./BaseState.js";

/**
 * RetreatState for enemy AI behavior.
 * Enemy directly retreats from the player.
 */
export class RetreatState extends BaseState {
    constructor(controller) {
        super(controller);
    }

    enter() {}

    update(time, delta) {
        const movement = this.controller.movementComponent;
        const enemy = this.controller.gameObject;
        const scene = enemy.scene;

        if (!this.controller.target || !movement) return;

        const dx = this.controller.target.x - enemy.x;
        const dy = this.controller.target.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;

        const dirX = dx / distance;
        const dirY = dy / distance;
        movement.setDirection(-dirX, -dirY);
    }

    exit() {
        this.controller.movementComponent.setDirection(0, 0);
    }
}
