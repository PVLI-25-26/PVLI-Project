import { EventBus } from "../../core/event-bus";

/**
 * Data object used by the invisibility buff.
 * @typedef {Object} InvisibilityBuffData
 * @property {number} duration - Duration in milliseconds the invisibility lasts.
 */

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
     * @param {number|InvisibilityBuffData} duration - Duration in ms (or object carrying duration).
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
     * @param {number|InvisibilityBuffData} duration - Duration in ms (or object carrying duration).
     * @param {Phaser.GameObjects.GameObject} entity - Entity invisible.
     * @returns {void}
     */
    remove: function (dashSpeed, entity){
        // Enable player to colliding with enemies
        entity.body.collisionFilter.mask = entity.scene.enemiesCategory ^ entity.body.collisionFilter.mask;
    }
}