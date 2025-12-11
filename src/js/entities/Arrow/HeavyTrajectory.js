import { EventBus } from "../../core/event-bus";

/**
 * Более «тяжёлая» параболическая траектория для стрелы.
 * Усиленная гравитация + лёгкое сопротивление воздуха.
 */
export class HeavyTrajectory {

    #gravityStr;
    #scene;
    #arrow;

    // Время полёта короче, т.к. тяжёлая стрела долго не летит
    #maxAirTime = 320;

    #airTime = 0;
    #timeSinceLaunch = 0;
    #isFlying = false;

    // Сильнее сопротивление воздуха
    #airDrag = 0.12;

    #cosR = 1;
    #sinR = 0;

    constructor(gravityStrength, scene){
        this.#gravityStr = gravityStrength * 2.4;  // гравитация сильнее
        this.#scene = scene;
    }

    shoot(arrow){
        this.#arrow = arrow;

        const len = Math.hypot(arrow.target.x, arrow.target.y);
        const a = arrow.power / len;

        // немного меньше горизонтальной скорости
        const vX = arrow.target.x * a * 0.85;
        const vY = arrow.target.y * a * 0.9;

        arrow.setVelocity(vX, vY);

        const camRot = this.#scene.cameras.main.rotation;
        this.#cosR = Math.cos(-camRot);
        this.#sinR = Math.sin(-camRot);

        // Уменьшили время полета
        this.#airTime = Math.min(
            1000 * (0.0015 * arrow.power) / (1.8 * this.#gravityStr),
            this.#maxAirTime
        );

        arrow.setFrictionAir(this.#airDrag);

        this.#timeSinceLaunch = 0;
        this.#isFlying = true;

        this.#scene.time.delayedCall(this.#airTime, ()=>{
            if(this.#isFlying){
                this.stopFlying();
                arrow.onLanded();
            }
        });

        EventBus.on('cameraRotated', (R, cosR, sinR)=>{
            this.#cosR = cosR;
            this.#sinR = sinR;
        }, this);
    }

    update(time, delta){
        if(!this.#isFlying) return;

        const vel = this.#arrow.getVelocity();
        this.#timeSinceLaunch += delta;
        this.#timeSinceLaunch = Math.min(this.#timeSinceLaunch, this.#airTime);

        // визуальный наклон стрелы
        this.#arrow.updateArrowVisuals(this.#timeSinceLaunch / this.#airTime);

        // более сильное падение
        this.#arrow.setVelocity(
            vel.x * 0.995 - this.#sinR * this.#gravityStr * delta,
            vel.y * 0.995 + this.#cosR * this.#gravityStr * delta
        );
    }

    onCollision(){
        this.stopFlying();
    }

    stopFlying(){
        this.#isFlying = false;
        this.#arrow.setVelocity(0, 0);
    }
}
