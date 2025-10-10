import { BaseComponent } from "../core/base-component.js";

/**
 * Component that handles topdown movement for a GameObject.
 * Can be used by player or NPC controllers.
 * @extends BaseComponent
 */
export class MovementComponent extends BaseComponent {
    /**
     * Creates a MovementComponent.
     * @param {Phaser.GameObjects.GameObject} gameObject - The GameObject this component is attached to.
     * @param {number} [speed=200] - Movement speed in pixels per second.
     */
    constructor(gameObject, speed = 200) {
        super(gameObject);

        /**
         * Movement speed in pixels per second.
         * @type {number}
         */
        this.speed = speed;

        /**
         * Current velocity vector.
         * @type {{x: number, y: number}}
         */
        this.velocity = { x: 0, y: 0 };

        /**
         * Desired movement direction, normalized between -1 and 1.
         * @type {{x: number, y: number}}
         */
        this.direction = { x: 0, y: 0 };
    }

    /**
     * Sets the movement direction.
     * Values should be between -1 and 1.
     * @param {number} x - Horizontal direction (-1 left, 1 right)
     * @param {number} y - Vertical direction (-1 up, 1 down)
     */
    setDirection(x, y) {
        this.direction.x = x;
        this.direction.y = y;
    }

    /**
     * Updates the velocity based on the current direction,
     * normalizing for diagonal movement to prevent faster diagonal speed.
     */
    updateVelocity() {
        const { x, y } = this.direction;
        const magnitude = Math.hypot(x, y);

        if (magnitude > 0) {
            this.velocity.x = (x / magnitude) * this.speed;
            this.velocity.y = (y / magnitude) * this.speed;
        } else {
            this.velocity.x = 0;
            this.velocity.y = 0;
        }
    }

    /**
     * Applies the current velocity to the GameObject.
     * Assumes the GameObject has an Arcade Physics body.
     */
    moveGameObject() {
        if (this.gameObject.body) {
            this.gameObject.body.setVelocity(this.velocity.x, this.velocity.y);
        }
    }

    /**
     * Called every frame to update the component.
     * @param {number} time - The current time in milliseconds.
     * @param {number} delta - Time elapsed since the last frame in milliseconds.
     */
    update(time, delta) {
        this.updateVelocity();
        this.moveGameObject();
    }

    /**
     * Sets the movement speed.
     * @param {number} speed - New speed in pixels per second.
     */
    setSpeed(speed) {
        this.speed = speed;
    }
}
