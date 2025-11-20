import { EventBus } from "../../core/event-bus";
import { BaseAbility } from "./BaseAbility";

/**
 * Invisibility ability — temporarily makes the player invulnerable and disables collisions with enemies
 * 
 * @extends {BaseAbility}
 */
export class Invisibility extends BaseAbility{
    /**
     * Create an Invisibility ability.
     * @param {Phaser.Scene} scene - Phaser scene used for timers and physics.
     * @param {number} coolDown - Cooldown in ms after invisibility ends.
     * @param {number} duration - Active duration in ms for invisibility.
     * @param {Phaser.GameObjects.GameObject} gameObject - The game object (player) to apply invisibility to.
     */
    constructor(scene, coolDown, duration, gameObject){
        super(scene, coolDown, duration, gameObject);
        this.player = gameObject;
        this.scene = scene;
        this.logger = this.scene.plugins.get('logger');
    }

    /**
     * Called when the ability becomes active.
     * @protected
     * @returns {void}
     */
    onAbilityActivated(){
        this.logger.log('ABILITES', 1, 'Invisibility activated');
        // Make player invulnerable
        EventBus.emit('invisibilityActivated', {target: this.player, duration: this.duration});
        // Remove player from colliding with enemies
        this.player.body.collisionFilter.mask = this.scene.enemiesCategory ^ this.player.body.collisionFilter.mask;
    }

    /**
     * Called when the ability deactivates.
     * @protected
     * @returns {void}
     */
    onAbilityDeactivated(){
        this.logger.log('ABILITES', 1, 'Invisibility ended');
        // Enable player to colliding with enemies
        this.player.body.collisionFilter.mask = this.scene.enemiesCategory ^ this.player.body.collisionFilter.mask;
    }
}