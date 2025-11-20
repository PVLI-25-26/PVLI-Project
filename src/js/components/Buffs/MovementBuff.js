import { MovementComponent } from "../Movement";
/**
 * Multiplier value used by the movement buff.
 * Example: 1.2 increases speed by 20%.
 * @typedef {number} SpeedMultiplier
 */

/**
 * Movement buff implementation.
 *
 * This buff multiplies the MovementComponent speed by a given factor,
 * and restores the previous speed when removed by dividing by the same factor.
 *
 * @module MovementBuff
 */
export const movementBuff = {
    /**
     * Apply the movement buff to the given entity.
     * Multiplies the MovementComponent.speed by the provided multiplier and sets the new speed.
     * If no MovementComponent is found nothing will happen.
     *
     * @param {SpeedMultiplier} speedIncrease - Multiplier to apply to the entity's base speed.
     * @param {Phaser.GameObjects.GameObject} entity - Target entity which should have MovementComponent.
     * @returns {void}
     */
    apply: function (speedIncrease, entity){
                // Try get movement component
                const movementComponent = entity.getComponent(MovementComponent);
                if(movementComponent){
                    // Get movement component current speed
                    let speed = movementComponent.speed;
                    // Add buff
                    speed *= speedIncrease;
                    movementComponent.setSpeed(speed);
                }
            },

    /**
     * Remove the movement buff from the given entity.
     * Divides the MovementComponent.speed by the provided multiplier to restore prior speed.
     * If no MovementComponent is found nothing will happen.
     * 
     * @param {SpeedMultiplier} speedIncreased - Multiplier that was previously applied.
     * @param {Phaser.GameObjects.GameObject} entity - Target entity which should expose getComponent().
     * @returns {void}
     */
    remove: function (speedIncreased, entity){
                // Try get movement component
                const movementComponent = entity.getComponent(MovementComponent);
                if(movementComponent){
                    // Get movement component current speed
                    let speed = movementComponent.speed;
                    // Remove buff
                    speed /= speedIncreased;
                    movementComponent.setSpeed(speed);
                }
            }
}