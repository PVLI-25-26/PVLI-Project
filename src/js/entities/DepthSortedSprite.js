import { EventBus } from "../core/event-bus";

export class DepthSortedSprite extends Phaser.GameObjects.Sprite {
    #camCosR = 1;
    #camSinR = 0;
    constructor(scene, x, y, key, frame){
        super(scene, x, y, key, frame);

        EventBus.on('cameraRotated', this.updateDepth, this);
    }

    preUpdate(time, delta){
        super.preUpdate(time, delta);
        this.updateDepth(0, this.#camCosR, this.#camSinR);
    }

    updateDepth(R,cosR,sinR){
        this.setDepth((this.y*cosR-this.x*sinR));
        this.#camCosR = cosR;
        this.#camSinR = sinR;
    }
}