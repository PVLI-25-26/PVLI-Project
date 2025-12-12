import { EventBus } from "../../core/event-bus";
import { MovementComponent } from "../../components/Movement.js";
import { BillBoard } from "../../entities/BillBoard.js";

/**
 * Value used by the inmobilized debuff (currently unused).
 * @typedef {number} InmobilizeValue
 */

/**
 * Inmobilized debuff implementation.
 *
 * This debuff reduces the entity's speed to almost 0
 *
 * @module InmobilizedDebuff
 */
export const inmobilizedDebuff = {
    /**
     * Apply the Inmobilized debuff to the given entity.
     *
     * @param {InmobilizeValue} value - Optional configuration value (unused).
     * @param {Phaser.GameObjects.GameObject} entity - Entity Inmobilized
     * @returns {void}
     */
    apply: function (value, entity){
        // Try get movement component
        const movementComponent = entity.getComponent(MovementComponent);
        if(movementComponent){
            // Get movement component current speed
            let speed = movementComponent.speed;
            // Add debuff
            speed *= 0.0001;
            movementComponent.setSpeed(speed);

            const vines = new BillBoard(entity.scene, entity.x, entity.y, {
                texture: "vines",
                scale: 3,
                frame: 0,
                offsetX: entity.originX,
                offsetY: entity.originY
            }).setScale(3);
            entity.scene.add.existing(vines);

            entity.scene.tweens.add({
                targets: vines,
                alpha: 0,
                duration: value.duration,
                onUpdate: ()=>{
                    vines.x = entity.x;
                    vines.y = entity.y+0.1;
                },
                onComplete: ()=>{
                    vines.destroy(true);
                }
            })
        }
    },

    /**
     * Remove the buff from the given entity.
     * 
     * @param {InmobilizeValue} value - Optional configuration value (unused).
     * @param {Phaser.GameObjects.GameObject} entity - Entity Inmobilized
     * @returns {void}
     */
    remove: function (value, entity){
        // Try get movement component
        const movementComponent = entity.getComponent(MovementComponent);
        if(movementComponent){
            // Get movement component current speed
            let speed = movementComponent.speed;
            // Remove buff
            speed /= 0.0001;
            movementComponent.setSpeed(speed);
        }
    }
}