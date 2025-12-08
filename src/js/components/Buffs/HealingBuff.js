import { EventBus } from "../../core/event-bus";
import { BuffParticleEmitter } from "../../entities/BuffParticleEmitter";
import { DamageableComponent } from "../DamageableComponent";

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
     * @param {SpeedMultiplier} data.value - Multiplier to apply to the entity's base speed.
     * @param {Phaser.GameObjects.GameObject} entity - Target entity which should have MovementComponent.
     * @returns {void}
     */
    apply: function (data, entity){
        // Try get damageable component
        const damageableComponent = entity.getComponent(DamageableComponent);
        if(damageableComponent){
            damageableComponent.heal(data.healthIncrease);
        }

        new BuffParticleEmitter(entity.scene, entity, "plusParticle", data.duration, 100, 25)
    },

    /**
     * Remove the movement buff from the given entity.
     * Divides the MovementComponent.speed by the provided multiplier to restore prior speed.
     * If no MovementComponent is found nothing will happen.
     * 
     * @param {SpeedMultiplier} data - Multiplier that was previously applied.
     * @param {Phaser.GameObjects.GameObject} entity - Target entity which should expose getComponent().
     * @returns {void}
     */
    remove: function (data, entity){
    }
}