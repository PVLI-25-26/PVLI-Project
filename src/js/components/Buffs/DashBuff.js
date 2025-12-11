import { EventBus } from "../../core/event-bus";
import {DepthSortedSprite} from "../../entities/DepthSortedSprite.js";
import Colors from "../../../configs/colors-config.js";

/**
 * Data object passed to the dash buff.
 * @typedef {Object} DashBuffValues
 * @property {number} speedIncrease - Multiplier or speed value used by the dash logic.
 * @property {number} [duration] - Duration in ms for visual/effect timing.
 */

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
     * @param {DashBuffValues} dashSpeed - Parameters for the dash
     * @param {Phaser.GameObjects.GameObject} entity - Entity dashing (only the player in theory).
     * @returns {void}
     */
    apply: function (values, entity){
                // Only player dashes (currently)
                EventBus.emit('playerDash', values.speedIncrease);
                EventBus.emit('playSound', 'dash');

                // Set entity blend mode and tint for dash effect
                entity.setBlendMode(Phaser.BlendModes.ADD);
                entity.setTint(Colors.OrangeHex);

                // Create entity copy for ghost effect
                const ghostCopy = new DepthSortedSprite(entity.scene, entity.x, entity.y, entity.texture.key, 0)
                    .setOrigin(entity.originX, entity.originY)
                    .setRotation(entity.rotation)
                    .setScale(entity.scale)
                    .setFlip(entity.flipX)
                    .setTint(Colors.OrangeHex)
                    .setBlendMode(Phaser.BlendModes.ADD);
                entity.scene.add.existing(ghostCopy);

                // Tween ghost to disappear
                entity.scene.add.tween({
                    targets: ghostCopy,
                    alpha: 0,
                    duration: 300,
                    ease: 'Linear',
                    onComplete: ()=>{ghostCopy.destroy(true)}
                })
            },

    /**
     * Remove the movement buff from the given entity.
     * * Notifies the PlayerController about the dash ending through the EventBus.
     * 
     * @param {DashBuffValues} dashSpeed - Parameters that were used for the dash
     * @param {Phaser.GameObjects.GameObject} entity - Entity dashing (only the player in theory).
     * @returns {void}
     */
    remove: function (values, entity){
                // End dash and reset enities visuals
                EventBus.emit('playerDashEnd');
                entity.setTint(0xFFFFFF);
                entity.setBlendMode(Phaser.BlendModes.NORMAL);
            }
}