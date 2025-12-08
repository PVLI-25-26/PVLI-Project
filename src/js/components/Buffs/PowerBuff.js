import { EventBus } from "../../core/event-bus";
import { BuffParticleEmitter } from "../../entities/BuffParticleEmitter";
import { PlayerShootingComponent } from "../PlayerShooting";

/**
 * Power Buff implementation.
 *
 * This buff multiplies the damage dealt by the player by a given factor,
 * and restores the previous damage when removed by dividing by the same factor.
 *
 * @module PowerBuff
 */
export const powerBuff = {
    /**
     * Apply the power buff to the given entity.
     *
     * @param {Number} data.damageMult - Damage multiplier.
     * @param {Phaser.GameObjects.GameObject} entity - Target entity.
     * @returns {void}
     */
    apply: function (data, entity){
                // Try get shooting component
                const playerShootingComponent = entity.getComponent(PlayerShootingComponent);
                if(playerShootingComponent){
                    // Get shooting component current damage
                    let damage = playerShootingComponent.getDamageMultiplier();
                    // Save previous damage
                    data.prevDamage = damage;
                    // Add buff
                    damage = data.damageMult;
                    playerShootingComponent.setDamageMultiplier(damage);

                }

                // Emit particles
                new BuffParticleEmitter(entity.scene, entity, "crossParticle", data.duration, 100, 25)
            },

    /**
     * Remove the power buff from the given entity.
     * 
     * @param {Number} data.prevDamage - Multiplier that was previously applied.
     * @param {Phaser.GameObjects.GameObject} entity - Target entity.
     * @returns {void}
     */
    remove: function (data, entity){
                // Try get shooting component
                const playerShootingComponent = entity.getComponent(PlayerShootingComponent);
                if(playerShootingComponent){
                    // Restore damage mult
                    playerShootingComponent.setDamageMultiplier(data.prevDamage);
                }
            }
}