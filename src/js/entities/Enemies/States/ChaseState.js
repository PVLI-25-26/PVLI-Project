/**
 * ChaseState for enemy AI behavior.
 * Enemy chases the player for a duration, then evades perpendicularly for a duration, repeating this cycle.
 */
export class ChaseState {
    constructor(controller, config = {}) {
        this.controller = controller;
        this.chaseDuration = config.chaseDuration || 2000;
        this.evadeDuration = config.evadeDuration || 1000;

        this.timer = 0;
        this.phase = 'chase';
        this.evadeDirection = 1;
    }

    enter() {
        this.phase = 'chase';
        this.timer = this.chaseDuration;
    }

    update(time, delta) {
        const movement = this.controller.movementComponent;
        const enemy = this.controller.gameObject;
        const scene = enemy.scene;

        if (!scene?.player || !movement) return;

        const player = scene.player;
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;

        if (this.phase === 'chase') {
            const dirX = dx / distance;
            const dirY = dy / distance;
            movement.setDirection(dirX, dirY);

            this.timer -= delta;
            if (this.timer <= 0) {
                this.phase = 'evade';
                this.timer = this.evadeDuration;
                this.evadeDirection = Math.random() < 0.5 ? 1 : -1;
            }
        } else if (this.phase === 'evade') {
            const perpendicularX = dy * this.evadeDirection;
            const perpendicularY = -dx * this.evadeDirection;
            const evadeLength = Math.sqrt(perpendicularX * perpendicularX + perpendicularY * perpendicularY) || 1;

            const dirX = perpendicularX / evadeLength;
            const dirY = perpendicularY / evadeLength;
            movement.setDirection(dirX, dirY);

            this.timer -= delta;
            if (this.timer <= 0) {
                this.phase = 'chase';
                this.timer = this.chaseDuration;
            }
        }
    }

    exit() {
        this.controller.movementComponent.setDirection(0, 0);
    }
}
