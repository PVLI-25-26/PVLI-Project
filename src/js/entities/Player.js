import { extendWithComponents } from "../core/component-extension.js";
import { MovementComponent } from "../components/Movement.js";
import { PlayerControllerComponent } from "../components/PlayerController.js";

export class Player extends Phaser.GameObjects.Sprite {
    /**
     * @param {Phaser.Scene} scene
     * @param {Object} config - Player configuration object
     * @param {string} config.texture - Sprite texture key
     * @param {number} [config.frame] - Frame index (optional)
     * @param {number} config.x - Initial X position
     * @param {number} config.y - Initial Y position
     * @param {number} config.speed - Movement speed
     * @param {number} [config.width] - Width of the physics body (optional)
     * @param {number} [config.height] - Height of the physics body (optional)
     * @param {number} [config.offsetX] - X offset of the body from center (optional)
     * @param {number} [config.offsetY] - Y offset of the body from center (optional)
     */
    constructor(scene, config) {
        super(scene, config.x, config.y, config.texture, config.frame);
        this.config = config;

        extendWithComponents(this); // add component system to this GameObject

        scene.add.existing(this);

        scene.physics.add.existing(this);

        if (config.width && config.height) {
            this.body.setSize(config.width, config.height);
        }

        if (config.offsetX || config.offsetY) {
            this.body.setOffset(config.offsetX || 0, config.offsetY || 0);
        }

        this.addComponents();
    }

    addComponents() {
        // Add MovementComponent
        const movement = new MovementComponent(this, this.config.speed || 200);
        this.addComponent(movement);

        // Add PlayerControllerComponent
        const controller = new PlayerControllerComponent(this);
        this.addComponent(controller);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        this.setDepth(this.y);
    }
}
