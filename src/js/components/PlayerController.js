import { BaseControllerComponent } from "./BaseController.js";
import createPlayerKeys from "../../configs/controls-config.js";
import { EventBus } from "../core/event-bus.js";

/**
 * Player input controller component.
 * Converts keyboard input into a movement vector for MovementComponent.
 *
 * @class
 * @category Components
 * @extends BaseControllerComponent
 * @param {Phaser.GameObjects.GameObject} gameObject - The GameObject this controller is attached to.
 */
export class PlayerControllerComponent extends BaseControllerComponent {
    /**
     * Keyboard input keys for movement.
     * @type {Phaser.Types.Input.Keyboard.CursorKeys}
     */
    keys;

    /**
     * @type {Phaser.Cameras.Scene2D.Camera} Main camera reference.
     */
    camera;

    constructor(gameObject) {
        super(gameObject);
        this.keys = createPlayerKeys(gameObject.scene);
        this.camera = gameObject.scene.cameras.main;
    }

    /**
     * Called every frame.
     * Updates the movement direction based on keyboard input.
     *
     * @param {number} time - Current time in milliseconds
     * @param {number} delta - Time elapsed since last frame in milliseconds
     * @returns {void}
     */
    update(time, delta) {
        if (!this.enabled || !this.movementComponent) return;

        const x = (this.keys.right.isDown ? 1 : 0) - (this.keys.left.isDown ? 1 : 0);
        const y = (this.keys.down.isDown ? 1 : 0) - (this.keys.up.isDown ? 1 : 0);
            
        if(x != 0 || y != 0){
            this.gameObject.play('player_walk', true);
        }
        else{
            this.gameObject.anims.stop();
            this.frame = 0;
        }

        if (x != 0) this.gameObject.flipX = x < 0;

        this.movementComponent.setDirection(x, y);

        // Camera rotation controls
        // Don't allow both rotation keys at the same time because 
        //      it is stupid and it will call many events unnecessarily (improves performance)
        if(this.keys.rotCamRight.isDown && !this.keys.rotCamLeft.isDown) {
            this.camera.rotation -= 0.002*delta; // Add rotation speed to config
            // Emit event with new rotation and precalculated cos/sin for performance
            EventBus.emit('cameraRotated', this.camera.rotation, Math.cos(-this.camera.rotation), Math.sin(-this.camera.rotation));
        }
        if(this.keys.rotCamLeft.isDown && !this.keys.rotCamRight.isDown) {
            this.camera.rotation += 0.002*delta; // Add rotation speed to config
            // Emit event with new rotation and precalculated cos/sin for performance
            EventBus.emit('cameraRotated', this.camera.rotation, Math.cos(-this.camera.rotation), Math.sin(-this.camera.rotation));
        }
    }

    /**
     * Cleans up the component, disabling it.
     * @returns {void}
     */
    destroy() {
        super.destroy();
    }
}
