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
     * @param {Number} poisonBaseDamage - amount of base damage dealth by poison
     * @param {Phaser.GameObjects.GameObject} entity - Entity poisoned
     * @returns {void}
     */
    apply: function (poisonBaseDamage, entity){
        entity.scene.time.addEvent({
            delay: 500,
            callback: ()=>{
                // Will use repeat count to increment damage dealt through time 
                // Damageable component needs rework so stays like this for now
                EventBus.emit('enemyMeleeHit', {target: entity, attacker: entity})
            },
            repeat: poisonBaseDamage.duration/500,
        });
    },

    /**
     * Remove the buff from the given entity.
     * 
     * @param {Number} poisonBaseDamage - amount of base damage dealth by poison
     * @param {Phaser.GameObjects.GameObject} entity - Entity poisoned
     * @returns {void}
     */
    remove: function (poisonBaseDamage, entity){
        
    }
}