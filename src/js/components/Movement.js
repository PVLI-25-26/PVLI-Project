import { BaseComponent } from "../core/base-component.js";
import { EventBus } from "../core/event-bus.js";

/**
 * Component that handles top-down movement for a GameObject.
 * Can be used by player or NPC controllers.
 *
 * @class
 * @category Components
 * @extends BaseComponent
 * @param {Phaser.GameObjects.GameObject} gameObject - The GameObject this component is attached to.
 * @param {number} [speed=200] - Movement speed in pixels per second.
 */
export class MovementComponent extends BaseComponent {
    /**
     * Movement speed in pixels per second.
     * @type {number}
     */
    speed;

    /**
     * Current velocity vector.
     * @type {{x: number, y: number}}
     */
    velocity;

    /**
     * Desired movement direction, normalized between -1 and 1.
     * @type {{x: number, y: number}}
     */
    direction;

    cameraRotation;

    constructor(gameObject, speed = 200) {
        super(gameObject);

        this.speed = speed;
        this.velocity = { x: 0, y: 0 };
        this.direction = { x: 0, y: 0 };
        this.cameraRotation = 0;
        EventBus.on('cameraRotated', (rot)=>{this.cameraRotation=rot;});
    }

    /**
     * Sets the movement direction.
     * Values should be between -1 and 1.
     * @param {number} x - Horizontal direction (-1 left, 1 right)
     * @param {number} y - Vertical direction (-1 up, 1 down)
     * @returns {void}
     */
    setDirection(x, y) {
        this.direction.x = x;
        this.direction.y = y;
    }

    /**
     * Updates the velocity based on the current direction,
     * normalizing for diagonal movement to prevent faster diagonal speed.
     * @returns {void}
     */
    updateVelocity() {
        let { x, y } = this.direction;
        const magnitude = Math.hypot(x, y);
        
        const camRot = this.cameraRotation;
        const rotx = x*Math.cos(-camRot) - y*Math.sin(-camRot);
        const roty = x*Math.sin(-camRot) + y*Math.cos(-camRot);

        if (magnitude > 0) {
            this.velocity.x = (rotx / magnitude) * this.speed;
            this.velocity.y = (roty / magnitude) * this.speed;
        } else {
            this.velocity.x = 0;
            this.velocity.y = 0;
        }
    }

    /**
     * Applies the current velocity to the GameObject.
     * Assumes the GameObject has an Arcade Physics body.
     * @returns {void}
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
     * @returns {void}
     */
    update(time, delta) {
        this.updateVelocity();
        this.moveGameObject();
    }

    /**
     * Sets the movement speed.
     * @param {number} speed - New speed in pixels per second.
     * @returns {void}
     */
    setSpeed(speed) {
        this.speed = speed;
    }
}
