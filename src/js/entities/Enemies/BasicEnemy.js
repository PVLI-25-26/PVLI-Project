import { extendWithComponents } from "../../core/component-extension.js";
import { BasicEnemyControllerComponent } from "../../components/BasicEnemyController.js";
import { MovementComponent } from "../../components/Movement.js";
import { SpriteStacking } from "../SpriteStacking.js";

/**
 * BasicEnemy - a simple enemy entity with a visual sprite.
 * Serves as an example of an enemy GameObject.
 *
 * @class
 * @category Entities
 * @extends SpriteStacking
 * @param {Phaser.Scene} scene - The scene this enemy belongs to
 * @param {Object} config - Enemy configuration object
 * @param {string} config.texture - Sprite texture key
 * @param {number} [config.frame] - Frame index (optional)
 * @param {number} config.x - Initial X position
 * @param {number} config.y - Initial Y position
 * @param {Object} [config.spriteStackConfig] - Sprite stacking configuration (optional)
 * @param {number} [config.width] - Width of the physics body (optional)
 * @param {number} [config.height] - Height of the physics body (optional)
 * @param {number} [config.offsetX] - X offset of the body from center (optional)
 * @param {number} [config.offsetY] - Y offset of the body from center (optional)
 */
export class BasicEnemy extends SpriteStacking {
    /**
     * Enemy configuration object.
     * @type {Object}
     */
    config;

    constructor(scene, x, y, config) {
        super(scene, x, y, config.spriteStackConfig, scene.cameras.main);
        this.config = config;

        extendWithComponents(this);

        // Add to scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Configure physics body size and offset
        if (config.width && config.height) {
            this.body.setSize(config.width, config.height);
        }
        if (config.offsetX || config.offsetY) {
            this.body.setOffset(config.offsetX || 0, config.offsetY || 0);
        }

        this.addComponents();
    }

     /**
     * Adds MovementComponent and EnemyController to the player.
     * @returns {void}
     */
    addComponents() {
        // Add MovementComponent
        const movement = new MovementComponent(this, this.config.speed);

        // Add PlayerControllerComponent
        const controller = new BasicEnemyControllerComponent(this, this.config.state, this.config.patrolRoute);
    }

    /**
     * Pre-update called every frame by Phaser.
     * Currently does nothing but can be extended later.
     * @param {number} time - Current time in milliseconds
     * @param {number} delta - Time elapsed since last frame in milliseconds
     * @returns {void}
     */
    preUpdate(time, delta) {
        super.preUpdate(time, delta);
    }
}
