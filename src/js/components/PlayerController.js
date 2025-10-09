import BaseController from "./BaseController.js";


/**
 * Controller for player input, reads keyboard input and updates movement.
 * @class PlayerController
 * @extends BaseController
 * @property {Phaser.Types.Input.Keyboard.CursorKeys} keys - Keyboard input keys
 */
export default class PlayerController extends BaseController {
    /**
     * Creates a new PlayerController.
     * @param {Phaser.GameObjects.GameObject} entity - The entity this controller is attached to
     * @param {import("./Movement.js").default} movement - Reference to the Movement component
     * @param {Phaser.Types.Input.Keyboard.CursorKeys} keys - Keyboard keys for movement input
     */
    constructor(entity, movement, keys) {
        super(entity, movement);
        /**
         * Keyboard input keys
         * @type {Phaser.Types.Input.Keyboard.CursorKeys}
         */
        this.keys = keys;
    }

    /**
     * Called every frame to update movement based on input.
     * @param {number} delta - Time elapsed since last frame in milliseconds
     */
    update(delta) {
        const x = (this.keys.right.isDown ? 1 : 0) - (this.keys.left.isDown ? 1 : 0);
        const y = (this.keys.down.isDown ? 1 : 0) - (this.keys.up.isDown ? 1 : 0);

        this.movement.setDirection(x, y);
    }
}
