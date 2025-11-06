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

    /**
     * @type {number} Saves the camera rotation to adjust movement direction.
     */
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
        
        // Adjust for camera rotation
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
        if (this.knockbackState) {
            this._handleKnockback(delta);
        } else {
            this.updateVelocity();
            this.moveGameObject();
        }
    }

     /**
     * Handles knockback effect (when entity is knockback state, overrides normal movement).
     * @param {number} delta 
     */
    _handleKnockback(delta) {
        const state = this.knockbackState;
        if (!state) return;

        state.elapsed += delta;
        const remaining = Math.max(state.duration - state.elapsed, 0);

        // Damping factor (from 1 → 0)
        const t = remaining / state.duration;

        // Linear damping of velocity
        const vx = state.x * t;
        const vy = state.y * t;

        if (this.gameObject.body) {
            this.gameObject.body.setVelocity(vx, vy);
        }

        // End knockback when duration is over
        if (remaining <= 0) {
            this.knockbackState = null;
            if (this.gameObject.body) {
                this.gameObject.body.setVelocity(0, 0);
            }
        }
    }

    /**
     * Public method to apply knockback to the entity.
     * While knockback is active, movement and direction input are blocked
     * @param {Object} direction - Direction vector for the knockback
     * @param {number} force - Initial force of the knockback
     * @param {number} duration - Duration of the knockback effect in milliseconds
     */
    knockback(direction, force = 300, duration = 200) {
        const magnitude = Math.hypot(direction.x, direction.y);
        if (magnitude === 0) return;

        const nx = direction.x / magnitude;
        const ny = direction.y / magnitude;

        this.knockbackState = {
            x: nx * force,
            y: ny * force,
            elapsed: 0,
            duration,
            force
        };

        if (this.gameObject.body) {
            this.gameObject.body.setVelocity(nx * force, ny * force);
        } 
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
