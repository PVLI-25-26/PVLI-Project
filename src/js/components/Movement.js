import BaseComponent from "../core/base-component.js";


/**
 * Movement component responsible for setting the velocity of an entity
 * based on direction provided by a controller component.
 * @class Movement
 * @extends BaseComponent
 * @property {number} speed - Movement speed in pixels per second
 */
export default class Movement extends BaseComponent {
    /**
     * @param {Phaser.Physics.Arcade.Sprite} entity - The physics-enabled Phaser sprite this component is attached to
     * @param {number} [speed=200] - Movement speed in pixels per second
     */
    constructor(entity, speed = 200) {
        super(entity);

        /**
         * Movement speed in pixels per second
         * @type {number}
         */
        this.speed = speed;

        /**
         * Current movement direction set by a controller
         * @type {{x: number, y: number}}
         */
        this.direction = { x: 0, y: 0 };
    }

    /**
     * Sets the desired movement direction.
     * Values should be -1, 0, or 1 depending on input or scripted logic.
     *
     * @param {number} x - Horizontal direction (-1, 0, or 1)
     * @param {number} y - Vertical direction (-1, 0, or 1)
     * @memberof Movement
     */
    setDirection(x, y) {
        this.direction.x = x;
        this.direction.y = y;
    }

    /**
     * Called every frame. Normalizes the direction vector to prevent
     * faster diagonal movement, then sets the entity's velocity accordingly.
     * @param {number} delta - Time elapsed since last frame in milliseconds
     */
    update(delta) {
        const magnitude = Math.hypot(this.direction.x, this.direction.y) || 1;
        const vx = (this.direction.x / magnitude) * this.speed;
        const vy = (this.direction.y / magnitude) * this.speed;

        this.entity.setVelocity(vx, vy);
    }
}
