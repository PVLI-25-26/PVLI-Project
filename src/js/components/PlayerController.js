import { BaseControllerComponent } from "./BaseController.js";
import createPlayerKeys from "../../configs/controls-config.js";

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

    constructor(gameObject) {
        super(gameObject);
        this.keys = createPlayerKeys(gameObject.scene);
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

        this.movementComponent.setDirection(x, y);
    }

    /**
     * Cleans up the component, disabling it.
     * @returns {void}
     */
    destroy() {
        super.destroy();
    }
}
