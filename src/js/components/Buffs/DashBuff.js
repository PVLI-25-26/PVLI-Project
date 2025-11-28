import { EventBus } from "../../core/event-bus";

/**
 * Dash buff implementation.
 *
 * This buffs increases the player's speed by short period of time, seeming like he dashes
 *
 * @module MovementBuff
 */
export const dashBuff = {
    /**
     * Apply the dash buff to the given entity.
     * Notifies the PlayerController about the dash through the EventBus.
     *
     * @param {Number} dashSpeed - player's dash speed
     * @param {Phaser.GameObjects.GameObject} entity - Entity dashing (only the player in theory).
     * @returns {void}
     */
    apply: function (dashSpeed, entity){
                // Only player dashes (currently)
                EventBus.emit('playerDash', dashSpeed);
            },

    /**
     * Remove the movement buff from the given entity.
     * * Notifies the PlayerController about the dash ending through the EventBus.
     * 
     * @param {Number} dashSpeed - player's dash speed
     * @param {Phaser.GameObjects.GameObject} entity - Entity dashing (only the player in theory).
     * @returns {void}
     */
    remove: function (dashSpeed, entity){
                EventBus.emit('playerDashEnd');
            }
}