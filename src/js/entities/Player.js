import Movement from "../components/Movement.js";
import PlayerController from "../components/PlayerController.js";

/**
 * Player entity that aggregates movement and controller components.
 */
export default class Player {
    /**
     * @param {Phaser.Scene} scene - The scene to add the player to
     * @param {number} x - Initial X position
     * @param {number} y - Initial Y position
     * @param {string} texture - Key of the sprite texture
     * @param {Phaser.Types.Input.Keyboard.CursorKeys} keys - Input keys for the player
     * @param {number} [speed=200] - Movement speed in pixels per second
     */
    // TODO - We should split params like speed into a config object!
    constructor(scene, x, y, texture, keys, speed = 200) {
        /**
         * The Phaser physics-enabled sprite representing the player
         * @type {Phaser.Physics.Arcade.Sprite}
         */
        this.sprite = scene.physics.add.sprite(x, y, texture);

        /**
         * Movement component
         * @type {Movement}
         */
        this.movement = new Movement(this.sprite, speed);

        /**
         * Controller component
         * @type {PlayerController}
         */
        this.controller = new PlayerController(this.sprite, this.movement, keys);
    }

    /**
     * Update method called every frame.
     * Delegates to the controller and movement components.
     * @param {number} delta - Time elapsed since last frame in milliseconds
     * @memberof Player
     */
    update(delta) {
        this.controller.update(delta);
        this.movement.update(delta);
    }
}
