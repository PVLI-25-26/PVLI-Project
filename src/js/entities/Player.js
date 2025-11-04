import { extendWithComponents } from "../core/component-extension.js";
import { MovementComponent } from "../components/Movement.js";
import { PlayerControllerComponent } from "../components/PlayerController.js";
import { PlayerShootingComponent } from "../components/PlayerShooting.js";
import  {BillBoard} from "./BillBoard.js";

/**
 * Player GameObject with movement and player control.
 * Extends Phaser.Sprite and adds component system.
 *
 * @class 
 * @category Entities
 * @extends BillBoard
 * @param {Phaser.Scene} scene - The scene this player belongs to
 * @param {Object} config - Player configuration object
 * @param {string} config.texture - Sprite texture key
 * @param {number} [config.frame] - Frame index (optional)
 * @param {number} config.x - Initial X position
 * @param {number} config.y - Initial Y position
 * @param {number} config.speed - Movement speed
 * @param {number} [config.width] - Width of the physics body (optional)
 * @param {number} [config.height] - Height of the physics body (optional)
 * @param {number} [config.offsetX] - X offset of the body from center (optional)
 * @param {number} [config.offsetY] - Y offset of the body from center (optional)
 */
export class Player extends BillBoard {
    /**
     * Configuration object passed to the player.
     * @type {Object}
     */
    config;

    constructor(scene, x, y, config) {
        //super(scene, x, y, config.billboardConfig, scene.cameras.main);
        super(scene,x,y,config.billboardConfig)
        this.config = config;

        // Add component system to this GameObject
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

        this.scene.anims.create({
            key: "player_walk",
            frames: scene.anims.generateFrameNumbers("player", {start:13, end: 16}),
            frameRate: 7,
            repeat: -1
        });
        this.play('player_walk');
    }

    /**
     * Adds MovementComponent and PlayerControllerComponent to the player.
     * @returns {void}
     */
    addComponents() {
        // Add MovementComponent
        const movement = new MovementComponent(this, this.config.speed || 200);

        // Add PlayerControllerComponent
        const controller = new PlayerControllerComponent(this);
        
        // Add PlayerShootingComponent
        const shootController = new PlayerShootingComponent(this, this.config.minShootPower, this.config.maxShootPower, this.config.powerIncreaseSpeed);
    }

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
