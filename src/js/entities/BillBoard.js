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
    constructor(scene, x, y, config, physicsConfig){
        super(scene, x, y, config.texture, null, physicsConfig);
        this.setOrigin(config.offsetX, config.offsetY);
        this.scale = config.scale;
        this.setFrame(config.frame);
        EventBus.on('cameraRotated', this.onCameraRotated,this);
		if (config.animation != undefined){
			this.play(config.texture,true);
		}
        this.on('destroy', ()=>{
            EventBus.off('cameraRotated', this.onCameraRotated,this);
        });
    }

    onCameraRotated(R){
        this.setRotation(-R);
    }
}
