import { EventBus } from "../../core/event-bus";

/**
 * Object that contains parameters used to create and destroy the force field
 * @typedef {Object} ForceFieldValues
 * @property {Number} effectRadius The radius of effect of the force field
 */

/**
 * Force field buff implementation.
 *
 * This buffs creates a force field that pushes the enemies around the entity
 *
 * @module ForceFieldBuff
 */
export const forceFieldBuff = {
    /**
     * Apply the force field buff to the given entity.
     * Creates a force field that pushes enemies
     *
     * @param {ForceFieldValues} forceFieldvalues - force field params
     * @param {Phaser.GameObjects.GameObject} entity - Entity
     * @returns {void}
     */
    apply: function (forceFieldValues, entity){
        // Set properties

        // Create ability effect zone
        const effectZone = entity.scene.add.zone(entity.x, entity.y);
        entity.scene.matter.add.gameObject(effectZone, {
            shape: {
                type: "circle",
                radius: forceFieldValues.effectRadius,
            },
            isSensor: true
        });
        effectZone.setOnCollide(this.pushEnemies);
        effectZone.setCollidesWith(entity.scene.enemiesCategory);

        // This ability handles the destruction of the object because the game crashed when trying to save an entity on shutdown
        entity.scene.time.addEvent({
            delay: forceFieldValues.duration,
            callback: () => {
                effectZone.destroy(true);
            },
            loop: false,
            repeat: 0
        })
    },
    /**
     * Collision handler invoked by Matter when the sensor zone collides with another body.
     *
     * @param {Object} pair - Collision pair data provided by Matter (contains bodyA, bodyB).
     * @returns {void}
     * @private
     */
    pushEnemies(pair){
        const activator = pair.bodyB.gameObject;
        const enemy = pair.bodyA.gameObject;
        // Push enemies back when ability active and effect zone detected an enemy
        EventBus.emit('pushEnemy', { attacker: activator, target: enemy});
    },

    /**
     * Remove the movement buff from the given entity.
     * Destroys effect zone from the scene
     * 
     * @param {ForceFieldValues} forceFieldvalues - force field params
     * @param {Phaser.GameObjects.GameObject} entity - Entity
     * @returns {void}
     */
    remove: function (forceFieldValues, entity){
        // Handle automatically by the apply function
    }
}