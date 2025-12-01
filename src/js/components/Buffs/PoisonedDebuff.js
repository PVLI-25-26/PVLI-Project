import { EventBus } from "../../core/event-bus";

/**
 * poisoned debuff implementation.
 *
 * This debuff reduces the entity's health exponentially by an amount
 *
 * @module poisonedDebuff
 */
export const poisonedDebuff = {
    /**
     * Apply the poisoned debuff to the given entity.
     *
     * @param {Number} poisonData - poison effect data
     * @param {Phaser.GameObjects.GameObject} entity - Entity poisoned
     * @returns {void}
     */
    apply: function (poisonData, entity){
        const timeEvent = entity.scene.time.addEvent({
            delay: 1000,
            callback: ()=>{
                // calculate damage dealt depending on how much time entity is poisoned
                const damage = poisonData.damage*(poisonData.duration/1000-timeEvent.repeatCount+1);
                EventBus.emit('entityHit', {target: entity, attacker: entity, damage: damage, force: 10, duration: 10})
            },
            repeat: poisonData.duration/1000,
        });
        // Save the timer in the poison data to remove later
        poisonData.poisonTimeEvent = timeEvent;
    },

    /**
     * Remove the buff from the given entity.
     * 
     * @param {Number} poisonData - poison effect data
     * @param {Phaser.GameObjects.GameObject} entity - Entity poisoned
     * @returns {void}
     */
    remove: function (poisonData, entity){
        // Remove poison damage
        poisonData.poisonTimeEvent.remove();
    }
}