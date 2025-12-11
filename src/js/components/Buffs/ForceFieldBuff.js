import { EventBus } from "../../core/event-bus";
import Colors from "../../../configs/colors-config.js";

/**
 * Parameters used to configure the force field buff.
 * @typedef {Object} ForceFieldValues
 * @property {number} effectRadius - Radius of the force field in pixels.
 * @property {number} duration - Duration of the force field in milliseconds.
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
        EventBus.emit("playSound", "forcefield");

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

        // Create VFX
        const VFX = entity.scene.add.circle(entity.x, entity.y, 0, 1)
            .setFillStyle(Colors.OrangeHex,0.1)
            .setStrokeStyle(5, Colors.OrangeHex, 1);
            // .setBlendMode(Phaser.BlendModes.ADD)

        // Force field VFX to grow quickly
        entity.scene.tweens.add({
            targets: VFX,
            radius: forceFieldValues.effectRadius,
            duration: forceFieldValues.duration,
            ease: 'Quad'
        })

        // This ability handles the destruction of the object because you can't save a Phaser game object as a JSON
        entity.scene.time.addEvent({
            delay: forceFieldValues.duration,
            callback: () => {
                effectZone.destroy(true);
                entity.scene.tweens.add({
                    targets: VFX,
                    alpha: 0,
                    duration: 100,
                    ease: 'Linear',
                    onComplete: ()=>{
                        VFX.destroy(true);
                    }
                })
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