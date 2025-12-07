import { extendWithComponents } from "../../core/component-extension.js";
import { ElementalMovementControllerComponent } from "../../components/ElementalMovementController.js";
import { EventBus } from "../../core/event-bus.js";
import { MovementComponent } from "../../components/Movement.js";
import { DamageableComponent } from "../../components/DamageableComponent.js";
import { BillBoard } from "../../entities/BillBoard.js";
import { getCustomTiledProperty } from "../../core/tiled-parser.js";
import { BuffManagerComponent } from "../../components/BuffManagerComponent.js";

/**
 * Elemental 
 * Serves as an example of an enemy GameObject.
 *
 * @class
 * @category Entities
 * @extends BillBoard
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
export class Elemental extends BillBoard {
    /**
     * Enemy configuration object.
     * @type {Object}
     */
    config;

    constructor(scene, x, y, id, config) {
        super(scene, x, y, config.billboardConfig, config.physicsConfig, scene.cameras.main);
        this.config = config;
        this.id = id;
        this.type = 'enemy';

        extendWithComponents(this);
        console.log("Created Elemental Enemy:", this.id);

        // Add to scene and physics
        this.scene.add.existing(this);

        this.setFixedRotation();

        if (config.offsetX || config.offsetY) {
            this.body.position.x += config.offsetX;
            this.body.position.y += config.offsetY;
            this.body.positionPrev.x += config.offsetX;
            this.body.positionPrev.y += config.offsetY;
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
        // The patrol route isn't a TiledProperty, it is set in the factory
        const controller = new ElementalMovementControllerComponent(this, getCustomTiledProperty(this.config, "state"), this.config.patrolRoute);

        // Add DamageableComponent
        const damageable = new DamageableComponent(this, 
            this.config.maxHP, 
            ['entityHit', 'pushEnemy'], 
            false, 
            { damage: this.config.damageSound, 
            death: this.config.deathSound });
            
        EventBus.emit('enemyHealthInitialized', 
            { enemy: this, maxHP: this.config.maxHP });

        const buffManager = new BuffManagerComponent(this);
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
