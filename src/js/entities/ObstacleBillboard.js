import { extendWithComponents } from "../core/component-extension.js";
import { BillBoard} from "../entities/BillBoard.js"

/**
 * Static obstacle GameObject.
 * Represents a collidable object (wall, rock, crate, etc.)
 *
 * @class
 * @category Entities
 * @extends SpriteStack
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
export class ObstacleBillboard extends BillBoard {
    /**
     * Configuration object passed to the obstacle.
     * @type {Object}
     */
    config;

    constructor(world, x, y, config) {
        super(world, x, y, config.billboardConfig, config.physicsConfig);
        this.config = config;
        // Extend with component system
        extendWithComponents(this);
        this.addComponents();

        this.scene.add.existing(this);
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
    }
}
