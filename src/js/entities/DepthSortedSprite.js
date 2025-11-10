import { EventBus } from "../core/event-bus";

export class DepthSortedSprite extends Phaser.Physics.Matter.Sprite {
    #camCosR = 1;
    #camSinR = 0;
    constructor(world, x, y, key, frame, physicsConfig){
        super(world, x, y, key, frame, physicsConfig);

        EventBus.on('cameraRotated', this.updateDepth, this);
    }

    preUpdate(time, delta){
        super.preUpdate(time, delta);
        this.updateDepth(0, this.#camCosR, this.#camSinR);
    }

    updateDepth(R,cosR,sinR){
        if(!this.body) console.log(this.body);
        this.setDepth(this.y*cosR-this.x*sinR);
        this.#camCosR = cosR;
        this.#camSinR = sinR;
    }
}