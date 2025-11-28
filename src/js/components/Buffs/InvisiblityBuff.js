import { EventBus } from "../../core/event-bus";

/**
 * Invisibility buff implementation.
 *
 * This buffs makes an entity invisible for some time
 *
 * @module InvisiblityBuff
 */
export const invisibilityBuff = {
    /**
     * Apply the invisibility buff to the given entity.
     *
     * @param {Phaser.GameObjects.GameObject} entity - Entity.
     * @returns {void}
     */
    apply: function (duration, entity){
        // Make player invulnerable
        EventBus.emit('invisibilityActivated', {target: entity, duration: duration});
        // Remove player from colliding with enemies
        entity.body.collisionFilter.mask = entity.scene.enemiesCategory ^ entity.body.collisionFilter.mask;
    },

    /**
     * Remove the invisibility buff from the given entity.
     * 
     * @param {Number} dashSpeed - player's dash speed
     * @param {Phaser.GameObjects.GameObject} entity - Entity invisible.
     * @returns {void}
     */
    remove: function (dashSpeed, entity){
        // Enable player to colliding with enemies
        entity.body.collisionFilter.mask = entity.scene.enemiesCategory ^ entity.body.collisionFilter.mask;
    }
}