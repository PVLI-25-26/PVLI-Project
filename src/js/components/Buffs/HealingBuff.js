import { EventBus } from "../../core/event-bus";
import { BuffParticleEmitter } from "../../entities/BuffParticleEmitter";
import { DamageableComponent } from "../DamageableComponent";

/**
 * Data object used by the healing buff.
 * @typedef {Object} HealingBuffData
 * @property {number} healthIncrease - Amount of health to restore instantly.
 * @property {number} [duration] - Optional duration in ms used for particle lifetime/visuals.
 */

/**
 * Healing buff implementation.
 *
 * This buff increases the entitys health instantly
 *
 * @module HealingBuff
 */
export const healingBuff = {
    /**
     * Apply the healing buff to the given entity.
     *
     * @param {HealingBuffData} data - Healing parameters.
     * @param {Phaser.GameObjects.GameObject} entity - Target entity which should have DamageableComponent.
     * @returns {void}
     */
    apply: function (data, entity){
        // Try get damageable component
        const damageableComponent = entity.getComponent(DamageableComponent);
        if(damageableComponent){
            // Heal entity if component found
            damageableComponent.heal(data.healthIncrease);
        }

        // Create healing particles
        new BuffParticleEmitter(entity.scene, entity, "plusParticle", data.duration, 100, 25)
    },

    /**
     * Remove the movement buff from the given entity.
     * Divides the MovementComponent.speed by the provided multiplier to restore prior speed.
     * If no MovementComponent is found nothing will happen.
     * 
     * @param {HealingBuffData} data - Healing parameters.
     * @param {Phaser.GameObjects.GameObject} entity - Entity
     * @returns {void}
     */
    remove: function (data, entity){
        // effect doesn't have to be removed
    }
}