import { EventBus } from "../../core/event-bus";
import { BuffParticleEmitter } from "../../entities/BuffParticleEmitter";

/**
 * Data object used by the burning debuff.
 * @typedef {Object} BurningDebuffData
 * @property {number} damage - Damage applied on each tick.
 * @property {number} duration - Total duration of the effect in milliseconds.
 * @property {Phaser.Time.TimerEvent} [timer] - Timer event instance used to schedule damage ticks (set when applied).
 * @property {function():void} [removeParticles] - Function that removes particle effects (set when applied).
 */

/**
 * Burning debuff implementation.
 *
 * This debuff reduces the entity's health every second by an amount
 *
 * @module burningDebuff
 */
export const burningDebuff = {
    /**
     * Apply the burning debuff to the given entity.
     *
     * @param {BurningDebuffData} fireData - data related to fire effect
     * @param {Phaser.GameObjects.GameObject} entity - Entity burning
     * @returns {void}
     */
    apply: function (fireData, entity){
        // Creating fire damage timer (deals damage every half second for the duration of the buff)
        const timer = entity.scene.time.addEvent({
            delay: 500,
            callback: ()=>{EventBus.emit('entityHit', {target: entity, attacker: entity, damage: fireData.damage, force: 10, duration: 10})},
            repeat: fireData.duration/500,
        });

        // Save timer to destory it when the effect has to be removed (might be removed before timer ends)
        fireData.timer = timer;

        // Create fire particles
        const particles = new BuffParticleEmitter(entity.scene, entity, 'fireParticle', fireData.duration, 100, 25, 0, 4);

        // Save function to remove particles (don't save the object because of circular definitions in JSON)
        // We save the particles because the effect might be removed before the emitter duration (entity dies for example)
        fireData.removeParticles = ()=>{particles.remove()};
    },

    /**
     * Remove the buff from the given entity.
     * 
     * @param {BurningDebuffData} fireData - Data object previously populated by apply().
     * @param {Phaser.GameObjects.GameObject} entity - Entity burning
     * @returns {void}
     */
    remove: function (fireData, entity){
        // Remove timer and particles
        fireData.timer.remove();
        fireData.removeParticles();
    }
}