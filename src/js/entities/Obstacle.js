import { extendWithComponents } from "../core/component-extension.js";

/**
 * Static obstacle GameObject.
 * Represents a collidable object (wall, rock, crate, etc.)
 * @extends Phaser.GameObjects.Sprite
 */
export class Obstacle extends Phaser.GameObjects.Sprite {
    /**
     * @param {Phaser.Scene} scene
     * @param {Object} config
     * @param {string} config.texture - Texture key
     * @param {number} [config.frame] - Frame index (optional)
     * @param {number} config.x - X position
     * @param {number} config.y - Y position
     * @param {boolean} [config.collidable=true] - Whether physics collisions are enabled
     * @param {number} [config.width] - Width of the physics body (optional)
     * @param {number} [config.height] - Height of the physics body (optional)
     * @param {number} [config.offsetX] - X offset of the body from center (optional)
     * @param {number} [config.offsetY] - Y offset of the body from center (optional)
     */
    constructor(scene, config) {
        super(scene, config.x, config.y, config.texture, config.frame);
        this.config = config;

        extendWithComponents(this);
        this.addComponents();

        scene.add.existing(this);

        scene.physics.add.existing(this, true); // true = static body

        if (config.width && config.height) {
            this.body.setSize(config.width, config.height);
        }

        if (config.offsetX || config.offsetY) {
            this.body.setOffset(config.offsetX || 0, config.offsetY || 0);
        }

        if (this.body && this.config.collidable === false) {
            this.body.checkCollision.none = true;
        }
    }

    addComponents() {}

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        this.setDepth(this.y);
    }
}
