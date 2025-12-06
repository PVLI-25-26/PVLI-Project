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

       const angle = Phaser.Math.DegToRad(70); // или любой угол

        // Вектор к цели
        const tx = dx;
        const ty = dy;

        // Перпендикуляр
        const px =  dy * this.direction;
        const py = -dx * this.direction;

        // Веса
        const wForward = Math.cos(angle);
        const wSide    = Math.sin(angle);

        // Смешиваем
        let vx = tx * wForward + px * wSide;
        let vy = ty * wForward + py * wSide;

        // Нормализуем
        const len = Math.sqrt(vx * vx + vy * vy) || 1;
        vx /= len;
        vy /= len;

        movement.setDirection(vx, vy);
    }

    exit() {
        this.controller.movementComponent?.setDirection(0, 0);
    }
}
