import { EventBus } from "../../core/event-bus";
import { Arrow } from "./Arrow";

/**
 * BasicTrajectory implements a simple parabolic trajectory for arrows,
 * taking into account gravity and camera rotation.
 * @class
 * @module entities/Arrow
 */
export class BasicTrajectory {
    /**
     * @type {number} Gravity strength applied to the arrow in the y axe of the camera.
     */
    #gravityStr;

    /**
     * @type {Phaser.Scene} Scene reference for time eventsa and logging.
     */
    #scene;

    /**
     * @type {number} Time in milliseconds the arrow will be considered "flying".
     */
    #airTime = 750;

    /**
     * @type {boolean} Whether the arrow is currently flying.
     */
    #isFlying = true;

    /**
     * @type {Phaser.GameObjects.Sprite|Arrow} The arrow instance this trajectory controls.
     */
    #arrow;

    /**
     *  Create a new BasicTrajectory controller.
     * 
     * @param {number} gravityStrength - Gravity strength to apply to the arrow.
     * @param {Phaser.Scene} scene - Scene reference for time events and logging. 
     */
    constructor(gravityStrength, scene){
        this.#gravityStr = gravityStrength;
        this.#scene = scene;
    }

    /**
     * @param {Phaser.GameObjects.Sprite|Arrow} arrow The arrow instance this trajectory controls.
     */
    shoot(arrow){
        this.#arrow = arrow;
        // Normalize direction
        const targetLength = Math.hypot(arrow.target.x, arrow.target.y);
        
        // To make fake "auto aiming" with the parabolic trajectory
        const offSet = -100;

        // Calculate final velocity
        const a = arrow.power/targetLength; // Saving time by doing this for both axes
        const vX = arrow.target.x*a;
        const vY = arrow.target.y*a + offSet;

        // apply velocities
        const camRotation = this.#scene.cameras.main.rotation;
        arrow.body.setVelocity(vX, vY);
        this.updateAcceleration(camRotation, Math.cos(-camRotation), Math.sin(-camRotation));

        // End arrow flight at after airTime milliseconds
        this.#scene.time.delayedCall(this.#airTime, ()=>{
            this.stopFlying();
            EventBus.emit('arrowLanded', this.#arrow);
        });

        EventBus.on('cameraRotated', this.updateAcceleration, this);
    }

    /**
     * Update arrow path during flight.
     */
    update(time, delta){
        // While flight is on going, update rotation to the trajectory
        if(this.#isFlying) this.#arrow.rotation = this.#arrow.body.angle;
    }

    /**
     * Apply collision logic.
     */
    onCollision(){
        this.stopFlying();
    }

    /**
     * 
     * @param {number} R Camera rotation in radians
     * @param {number} cosR Cosine of -R
     * @param {number} sinR Sine of -R
     */
    updateAcceleration(R, cosR, sinR){
        // Update acceleration when camera is rotated
        this.#arrow.body.setAcceleration(-sinR*this.#gravityStr, cosR*this.#gravityStr);
    }

    /**
     * Stop arrow flight and movement.
     */
    stopFlying(){
        // End arrow flight
        this.#isFlying = false;
        
        // Stop movement
        this.#arrow.body.setAcceleration(0,0);
        this.#arrow.body.setVelocity(0,0); 

        // Stop updating gravity on camera rotation
        EventBus.off('cameraRotated', this.updateAcceleration);
    }
}