/**
 * Base class for timed abilities.
 *
 * Provides a simple activation lifecycle:
 * - onAbilityPressed(): activates the ability if not already active,
 *   schedules deactivation after `duration`, and triggers an optional
 *   `onAbilityActivated` callback.
 *
 * Subclasses or consumers can provide the following optional callbacks on the instance:
 * - onAbilityActivated: function() called when ability becomes active.
 * - onAbilityDeactivated: function() called when ability deactivates.
 *
 *
 */
export class BaseAbility {
    /**
     * Whether the ability is currently active.
     * @type {boolean}
     * @private
     */
    #isActive;
    /**
     * Cooldown time in milliseconds after the ability ends before it can be activated again.
     * @type {number}
     */
    coolDown;
    /**
     * Active duration time in milliseconds for the ability.
     * @type {number}
     */
    duration;

    /**
     * Create a BaseAbility.
     * @param {Phaser.Scene} scene - Phaser scene used to schedule timers and access systems.
     * @param {number} coolDown - Cooldown duration in milliseconds applied after deactivation.
     * @param {number} duration - Active duration in milliseconds for the ability.
     */
    constructor(scene, coolDown, duration){
        // set properties
        this.scene = scene;
        this.coolDown = coolDown;
        this.duration = duration;
        this.#isActive = false;
    }

    /**
     * Attempt to activate the ability.
     *
     * @returns {void}
     */
    onAbilityPressed(){
        // If ability isn't currently active, activate
        if(!this.#isActive) {
            // Set active flag to true
            this.#isActive = true;

            // Add timer for ability end
            this.scene.time.addEvent({
                delay: this.duration,
                callback: this.abilityEnded,
                callbackScope: this,
                loop: false
            });

            // If a specific ability method is implemented, call it
            if(this.onAbilityActivated) this.onAbilityActivated();
        }
    }

    /**
     * Called when the ability's active duration ends.
     * @private
     * @returns {void}
     */
    abilityEnded(){
        // Start cool-down timer to know when ability can be activated again
        this.scene.time.addEvent({
            delay: this.coolDown,
            callback: ()=>this.#isActive = false,
            loop: false
        });

        // If a specific ability method is implemented, call it
        if(this.onAbilityDeactivated) this.onAbilityDeactivated();
    }
}