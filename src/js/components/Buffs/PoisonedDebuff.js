import { EventBus } from "../../core/event-bus";
import { BuffParticleEmitter } from "../../entities/BuffParticleEmitter";

/**
 * Data object used by the poisoned debuff.
 * @typedef {Object} PoisonedDebuffData
 * @property {number} damage - Base damage applied each tick (will be scaled over time).
 * @property {number} duration - Total duration of the effect in milliseconds.
 * @property {Phaser.Time.TimerEvent} [poisonTimeEvent] - Timer event instance created when applied (set by apply()).
 * @property {function():void} [removeParticles] - Cleanup function created when apply() spawns particles.
 */

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
     * @param {PoisonedDebuffData} poisonData - Parameters for the poison effect.
     * @param {Phaser.GameObjects.GameObject} entity - Entity poisoned
     * @returns {void}
     */
    apply: function (poisonData, entity){
        
        // Start timer that applies poison damage every second (the longer it repeats the more damage it deals)
        const timeEvent = entity.scene.time.addEvent({
            delay: 1000,
            callback: ()=>{
                // calculate damage dealt depending on how much time entity is poisoned
                const damage = poisonData.damage*(poisonData.duration/1000-timeEvent.repeatCount+1) || 1;
                EventBus.emit('entityHit', {target: entity, attacker: entity, damage: damage, force: 10, duration: 10})
            },
            repeat: poisonData.duration/1000,
        });
        // Save the timer in the poison data to remove later
        poisonData.poisonTimeEvent = timeEvent;

        // Emit particles
        const particles = new BuffParticleEmitter(entity.scene, entity, 'poisonParticle', poisonData.duration, 50, 25);
        // Cant save the object because it causes a circular definition error when saving buff in JSON
        // We save the particles because the effect might be removed before the emitter duration (when exiting the poison cloud or entity dies)
        poisonData.removeParticles = ()=>{particles.remove()};
    },

    /**
     * Remove the buff from the given entity.
     * 
     * @param {PoisonedDebuffData} poisonData - Data object previously populated by apply().
     * @param {Phaser.GameObjects.GameObject} entity - Entity poisoned
     * @returns {void}
     */
    remove: function (poisonData, entity){
        // Remove poison damage
        poisonData.poisonTimeEvent.destroy();
        poisonData.removeParticles();
    }
}