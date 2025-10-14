import { extendWithComponents } from "../core/component-extension.js";

/**
 * Static obstacle GameObject.
 * Represents a collidable object (wall, rock, crate, etc.)
 *
 * @class
 * @category Entities
 * @extends Phaser.GameObjects.Sprite
 * @param {Phaser.Scene} scene - The scene this obstacle belongs to
 * @param {Object} config - Configuration object for the obstacle
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
export class Obstacle extends Phaser.GameObjects.Sprite {
    /**
     * Configuration object passed to the obstacle.
     * @type {Object}
     */
    config;

    constructor(scene, config) {
        super(scene, config.x, config.y, config.texture, config.frame);
        this.config = config;

        // Extend with component system
        extendWithComponents(this);
        this.addComponents();

        scene.add.existing(this);

        // Add static physics body
        scene.physics.add.existing(this, true);

        if (config.width && config.height) {
            this.body.setSize(config.width, config.height);
        }

        if (config.offsetX || config.offsetY) {
            this.body.setOffset(config.offsetX || 0, config.offsetY || 0);
        }

        if (this.body && config.collidable === false) {
            this.body.checkCollision.none = true;
        }
    }

    /**
     * Adds components to the obstacle.
     * Override this method to attach specific components.
     * @returns {void}
     */
    addComponents() {}

    /**
     * Pre-update called every frame by Phaser.
     * Updates depth based on Y position.
     * @param {number} time - Current time in milliseconds
     * @param {number} delta - Time elapsed since last frame in milliseconds
     * @returns {void}
     */
    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        this.setDepth(this.y);
    }
}
