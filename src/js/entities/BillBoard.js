import { EventBus } from "../core/event-bus";
import { DepthSortedSprite } from "./DepthSortedSprite";
/**
 * Configuration object passed to the BillBoard Object
 * @class
 * @extends DepthSortedSprite
 * @param {Phaser.scene} scene - The scene this BillBoard object belongs to
 * @param {config} config - BillBoard configuration object
 * 
 * @param {number} config.x - X position
 * @param {number} config.y - Y position
 * @param {number} scale - Scale of the sprite
 * @param {string} texture - Texture of the sprite
 */
export class BillBoard extends DepthSortedSprite{
    constructor(world, x, y, config, physicsConfig){
        super(world, x, y, config.texture, null, physicsConfig);
        this.setOrigin(0.5);
        this.scale = config.scale;
        EventBus.on('cameraRotated', this.onCameraRotated,this);
        
    }

    onCameraRotated(R){
        this.setRotation(-R);
    }
}
