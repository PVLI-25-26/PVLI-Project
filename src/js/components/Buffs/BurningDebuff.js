import { EventBus } from "../../core/event-bus";

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
     * @param {Number} fireDamage - amount of damaged dealt by fire
     * @param {Phaser.GameObjects.GameObject} entity - Entity burning
     * @returns {void}
     */
    apply: function (fireData, entity){
        entity.scene.time.addEvent({
            delay: 500,
            callback: ()=>{EventBus.emit('entityHit', {target: entity, attacker: entity, damage: fireData.damage, force: 10, duration: 10})},
            repeat: fireData.duration/500,
        });
    },

    /**
     * Remove the buff from the given entity.
     * 
     * @param {Number} fireDamage - amount of damaged dealt by fire
     * @param {Phaser.GameObjects.GameObject} entity - Entity burning
     * @returns {void}
     */
    remove: function (fireDamage, entity){
        
    }
}