import { EventBus } from "../core/event-bus";

export class DepthSortedSprite extends Phaser.GameObjects.Sprite {
    #camCosR = 1;
    #camSinR = 0;
    constructor(scene, x, y, key, frame, physicsConfig){
        super(scene, x, y, key, frame);
        // If a physics configuration is provided, set it
        if(physicsConfig){
            scene.matter.add.gameObject(this, physicsConfig);
        }

        EventBus.on('cameraRotated', this.updateDepth, this);
        this.on('destroy',()=>EventBus.off('cameraRotated', this.updateDepth));
    }

    preUpdate(time, delta){
        super.preUpdate(time, delta);
        this.updateDepth(0, this.#camCosR, this.#camSinR);
    }

    updateDepth(R,cosR,sinR){
        this.setDepth(this.y*cosR-this.x*sinR);
        this.#camCosR = cosR;
        this.#camSinR = sinR;
    }
}