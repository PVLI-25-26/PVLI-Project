import { EventBus } from "../../core/event-bus";
import { BaseAbility } from "./BaseAbility";

/**
 * ForceField ability — creates a circular sensor zone around the player while active, which pushes enemies in it.
 *
 * @extends {BaseAbility}
 */
export class ForceField extends BaseAbility{
    /**
     * Push strength value used when notifying collisions.
     * @type {number}
     * @private
     */
    #pushStrength;
    /**
     * Radius of the circular effect zone in pixels.
     * @type {number}
     * @private
     */
    #effectRadius;

    /**
     * Create a ForceField ability instance.
     *
     * @param {Phaser.Scene} scene - Phaser scene used for timers and physics.
     * @param {number} coolDown - Cooldown in ms after the ability ends.
     * @param {number} duration - Active duration in ms for the ability.
     * @param {Phaser.GameObjects.GameObject} player - Player game object the zone will follow.
     * @param {number} pushStrength - Numerical strength used when pushing enemies (semantic).
     * @param {number} effectRadius - Radius in pixels for the circular effect zone.
     */
    constructor(scene, coolDown, duration, player, pushStrength, effectRadius){
        super(scene, coolDown, duration);
        this.scene = scene;
        this.logger = this.scene.plugins.get('logger');

        // Set properties
        this.#pushStrength = pushStrength;
        this.#effectRadius = effectRadius;
        this.player = player;
        
        // Create ability effect zone
        this.effectZone = this.scene.add.zone(this.player.x, this.player.y);
        this.scene.matter.add.gameObject(this.effectZone, {
            shape: {
                type: "circle",
                radius: this.#effectRadius,
            },
            isSensor: true
        });
        this.effectZone.setOnCollide(this.pushEnemies);
        this.effectZone.setCollidesWith(0);
    }

    /**
     * Collision handler invoked by Matter when the sensor zone collides with another body.
     *
     * @param {Object} pair - Collision pair data provided by Matter (contains bodyA, bodyB).
     * @returns {void}
     * @private
     */
    pushEnemies(pair){
        const player = pair.bodyA.gameObject;
        const enemy = pair.bodyB.gameObject;
        // Push enemies back when ability active and effect zone detected an enemy
        EventBus.emit('pushEnemy', { attacker: player, target: enemy});
    }

    /**
     * Called when the ability becomes active.
     * Positions the effect zone at the player's location and enables collisions with enemies.
     * @protected
     * @returns {void}
     */
    onAbilityActivated(){
        this.logger.log('ABILITES', 1, 'ForceField activated');
        // Position zone in player coords and activate collider
        this.effectZone.setPosition(this.player.x, this.player.y);
        this.effectZone.setCollidesWith(this.scene.enemiesCategory);
    }

    /**
     * Called when the ability deactivates.
     * Disables collisions for the effect zone so no further push events are emitted.
     * @protected
     * @returns {void}
     */
    onAbilityDeactivated(){
        this.logger.log('ABILITES', 1, 'ForceField ended');
         // Deactivate collider
        this.effectZone.setCollidesWith(0);
    }
}