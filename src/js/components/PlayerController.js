import { BaseControllerComponent } from "./BaseController.js";
import createPlayerKeys from "../../configs/controls-config.js";
import { EventBus } from "../core/event-bus.js";

/**
 * Player input controller component.
 * Converts keyboard input into a movement vector for MovementComponent.
 *
 * @class
 * @category Components
 * @extends BaseControllerComponent
 * @param {Phaser.GameObjects.GameObject} gameObject - The GameObject this controller is attached to.
 */
export class PlayerControllerComponent extends BaseControllerComponent {
    /**
     * Keyboard input keys for movement.
     * @type {Phaser.Types.Input.Keyboard.CursorKeys}
     */
    keys;

    /**
     * @type {Phaser.Cameras.Scene2D.Camera} Main camera reference.
     */
    camera;

    /**
     * @type {number} Saves the camera rotation to adjust movement direction.
     */
    cameraRotation;

    constructor(gameObject) {
        super(gameObject);
        // Get player keys
        this.keys = gameObject.scene.inputFacade.getPlayerKeys();

        // Get currently used camera
        this.camera = gameObject.scene.cameras.main;

        // Listen to dash buff to increase speed
        EventBus.on('playerDash', (dashSpeed)=>{
            this.movementComponent.setSpeed(dashSpeed);
        });
        EventBus.on('playerDashEnd', ()=>{
            this.movementComponent.setSpeed(5);
        });

        // camera rotation when mouse is moved
        this.gameObject.scene.input.on('pointermove',(pointer)=>{
            if(!pointer.isDown && this.gameObject.scene.input.mouse.locked)
            {
                // Sometimes mouse movement made big movements which where visually annoying, 
                // this makes sure camera cannot be moved too much
                this.camera.rotation -= Phaser.Math.Clamp(pointer.movementX*this.gameObject.config.cameraSensitivity, -0.08, 0.08);
                EventBus.emit('cameraRotated', this.camera.rotation, Math.cos(-this.camera.rotation), Math.sin(-this.camera.rotation));
            }
        }, this);

        // Set initial camera rotation
        this.cameraRotation = 0;
        EventBus.on('cameraRotated', (rot)=>{this.cameraRotation=rot;});
		this.aiming = false;
    }

    /**
     * Called every frame.
     * Updates the movement direction based on keyboard input.
     *
     * @param {number} time - Current time in milliseconds
     * @param {number} delta - Time elapsed since last frame in milliseconds
     * @returns {void}
     */
    update(time, delta) {
        if (!this.enabled || !this.movementComponent) return;

        // set x and y movement values this frame
        const x = (this.keys.right.isDown ? 1 : 0) - (this.keys.left.isDown ? 1 : 0);
        const y = (this.keys.down.isDown ? 1 : 0) - (this.keys.up.isDown ? 1 : 0);

        // Play correct player animations
        if(x != 0 || y != 0){
			if (this.aiming)
				this.gameObject.play("player_walk",true);
			else
            	this.gameObject.play('player_walk_bow', true);
        }
        else{
			if (this.aiming)
				this.gameObject.play("player_idle",true)
			else
				this.gameObject.play("player_idle_bow", true);
        }

        // Flip object
        if (x != 0) this.gameObject.flipX = x > 0;

        // Adjust for camera rotation
        const camRot = this.cameraRotation;
        const rotx = x*Math.cos(-camRot) - y*Math.sin(-camRot);
        const roty = x*Math.sin(-camRot) + y*Math.cos(-camRot);

        // Give final rotated movement to movementComponent
        this.movementComponent.setDirection(rotx, roty);
    }

    /**
     * Cleans up the component, disabling it.
     * @returns {void}
     */
    destroy() {
        super.destroy();
    }
}
