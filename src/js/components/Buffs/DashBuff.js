import { EventBus } from "../../core/event-bus";
import {DepthSortedSprite} from "../../entities/DepthSortedSprite.js";
import Colors from "../../../configs/colors-config.js";

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
                entity.setBlendMode(Phaser.BlendModes.ADD);
                entity.setTint(Colors.OrangeHex);
                const ghostCopy = new DepthSortedSprite(entity.scene, entity.x, entity.y, entity.texture.key, 0)
                    .setOrigin(entity.originX, entity.originY)
                    .setScale(entity.scale)
                    .setFlip(entity.flipX)
                    .setTint(Colors.OrangeHex)
                    .setBlendMode(Phaser.BlendModes.ADD);
                entity.scene.add.existing(ghostCopy);
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
     * @param {Number} dashSpeed - player's dash speed
     * @param {Phaser.GameObjects.GameObject} entity - Entity dashing (only the player in theory).
     * @returns {void}
     */
    remove: function (dashSpeed, entity){
                EventBus.emit('playerDashEnd');
                entity.setTint(0xFFFFFF);
                entity.setBlendMode(Phaser.BlendModes.NORMAL);
            }
}