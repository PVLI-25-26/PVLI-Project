import { extendWithComponents } from "../core/component-extension.js";
import { MovementComponent } from "../components/Movement.js";
import { PlayerControllerComponent } from "../components/PlayerController.js";
import { PlayerShootingComponent } from "../components/PlayerShooting.js";
import { DamageableComponent } from "../components/DamageableComponent.js";
import { EventBus } from "../core/event-bus.js";
import  {BillBoard} from "./BillBoard.js";
import { PlayerAbilityControllerComponent } from "../components/PlayerAbilityController.js";
import { PlayerInteractControllerComponent } from "../components/PlayerInteractController.js";
import { InventoryComponent } from "../components/InventoryComponent.js";
import { BuffManagerComponent } from "../components/BuffManagerComponent.js";
import saveDataManager from "../core/save-data-manager.js";

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
        super(scene, x, y, config.billboardConfig, config.physicsConfig)
        this.config = config;
        this.type = 'player';

        // Add component system to this GameObject
        extendWithComponents(this);

        // Add to scene and physics
        this.scene.add.existing(this);

        this.setFixedRotation();

        this.setOrigin(config.offsetX, config.offsetY);

        this.addComponents();

        // Save in browser storage player data when scene is shutdown
        scene.events.on("shutdown", ()=>{
            saveDataManager.setData("playerInventory", this.inventoryComponent.getInventory());
            saveDataManager.setData("playerGold", this.inventoryComponent.getGold());
            saveDataManager.setData("playerBuffs", this.buffManager.getBuffs());
        });

        this.scene.anims.create({
            key: "player_walk",
            frames: this.scene.anims.generateFrameNumbers("player", {start:13, end: 16}),
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
        const shootController = new PlayerShootingComponent(this, this.config.minShootPower, this.config.maxShootPower, this.config.powerIncreaseSpeed); // TODO: Refactor parameters to use separate config object

        // Add DamageableComponent
        const damageable = new DamageableComponent(this, 
            this.config.maxHP, 
            ['entityHit', 'invisibilityActivated'], 
            true, 
            { damage: this.config.damageSound, 
            death: this.config.deathSound });

        EventBus.emit('playerHealthInitialized', { maxHP: this.config.maxHP });

        // Add PlayerAbilityControllerComponent
        const abilityController = new PlayerAbilityControllerComponent(this);

        // Add PlayerInteractControllerComponent
        const interactController = new PlayerInteractControllerComponent(this, this.config.interactRadius);

        // Add InventoryComponent and load items from browser storage if there are any
        this.inventoryComponent = new InventoryComponent(this, saveDataManager.getData("playerInventory"), saveDataManager.getData("playerGold"));

        // Add BuffManagerComponent
        this.buffManager = new BuffManagerComponent(this);
        // Load buffs from browser storage if there are any
        const buffs = saveDataManager.getData("playerBuffs");
        console.log(buffs);
        buffs?.forEach(buff => {
            this.buffManager.addBuff({type: buff.type, value: buff.value, duration: buff.timer.delay - buff.timer.elapsed});
        });
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
