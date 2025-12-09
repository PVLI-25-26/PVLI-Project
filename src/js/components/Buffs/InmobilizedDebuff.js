import { EventBus } from "../../core/event-bus";
import { MovementComponent } from "../Movement";

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