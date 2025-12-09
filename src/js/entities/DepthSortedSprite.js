import { EventBus } from "../core/event-bus";

/**
 * Sprite that updates its depth based on camera rotation so objects sort correctly
 * in an isometric / rotated camera projection.
 *
 * The depth is computed as: depth = y * cosR - x * sinR where cosR and sinR are
 * the camera rotation cosine and sine respectively. The sprite listens to the
 * global EventBus "cameraRotated" event and updates its cached rotation values.
 *
 * @extends Phaser.GameObjects.Sprite
 */
export class DepthSortedSprite extends Phaser.GameObjects.Sprite {
    #camCosR = 1;
    #camSinR = 0;

    /**
     * Create a DepthSortedSprite.
     *
     * If physicsConfig is provided the sprite will be added to the Matter physics world.
     *
     * @param {Phaser.Scene} scene - Scene the sprite belongs to.
     * @param {number} x - Initial x position.
     * @param {number} y - Initial y position.
     * @param {string} key - Texture key.
     * @param {(string|number|undefined)} [frame] - Optional frame.
     * @param {Object} [physicsConfig] - Optional MatterJS configuration passed to scene.matter.add.gameObject.
     */
    constructor(scene, x, y, key, frame, physicsConfig){
        super(scene, x, y, key, frame);
        // If a physics configuration is provided, set it
        if(physicsConfig){
            scene.matter.add.gameObject(this, physicsConfig);
        }
        EventBus.on('cameraRotated', this.updateDepth, this);
        this.on('destroy',()=>EventBus.off('cameraRotated', this.updateDepth, this));
    }

    /**
     * Phaser lifecycle preUpdate override. Ensures depth is recalculated every frame
     * using the last known camera rotation values.
     * This is necessary because object's x and y might have been modified. 
     * TODO - Optimize to listen to this object registry and only modify depth when x and y are changed (this would save lots of update loops for static objects)
     *
     * @override
     * @param {number} time - Current time.
     * @param {number} delta - Time since last frame.
     */
    preUpdate(time, delta){
        super.preUpdate(time, delta);
        this.updateDepth(0, this.#camCosR, this.#camSinR);
    }

    /**
     * Update the display depth using camera rotation values.
     *
     * @param {number} R - Camera rotation in radians (unused directly for depth calc but provided by emitter).
     * @param {number} cosR - Cosine of camera rotation.
     * @param {number} sinR - Sine of camera rotation.
     */
    updateDepth(R,cosR,sinR){
        this.setDepth(this.y*cosR-this.x*sinR);
        this.#camCosR = cosR;
        this.#camSinR = sinR;
    }
}