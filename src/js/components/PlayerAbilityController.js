import createPlayerKeys from "../../configs/controls-config";
import { BaseComponent } from "../core/base-component";
import { EventBus } from "../core/event-bus";
import dashAbility from "../../configs/Abilities/dash-config.json";
import forcefieldAbility from "../../configs/Abilities/forcefield-config.json";
import invisibiltyAbility from "../../configs/Abilities/invisibility-config.json";

/**
 * Ability descriptor used by the PlayerAbilityController and buff system.
 *
 * @typedef {Object} Ability
 * @property {string} type - Unique ability identifier.
 * @property {number} duration - How long the ability effect lasts (milliseconds).
 * @property {number} coolDown - Cooldown time before the ability can be used again (milliseconds).
 * @property {Object} [value] - Arbitrary payload passed to buff/effect handlers (e.g. { damageMult: 2 }).
 * @property {number} gold - Arbitrary payload passed to buff/effect handlers (e.g. { damageMult: 2 }).
 */

/**
 * Component that listens for the player's ability input and forwards it to the active ability instance.
 *
 * @extends {BaseComponent}
 */
export class PlayerAbilityControllerComponent extends BaseComponent{
    /**
     * Active ability instance.
     * @type {Ability|undefined}
     */
    #ability;
    /**
     * Cooldown time in milliseconds after the ability ends before it can be activated again.
     * @type {number}
     */
    coolDown;
    /**
     * Flag set when the cooldown time of the ability has ended
     * @type {number}
     */
    hasCoolDownEnded;

    /**
     * Create the PlayerAbilityControllerComponent.
     * @param {Phaser.GameObjects.GameObject} gameObject - Owner game object (player).
     */
    constructor(gameObject, ability){
        super(gameObject);
        // Get player keys
        this.keys = createPlayerKeys(gameObject.scene);

        // FOR TESTING - abilities
        this.#ability = ability || null;
        EventBus.emit('abilityEquipped', this.#ability);
        // this.#ability = dashAbility
        // this.#ability = forcefieldAbility
        // this.#ability = invisibiltyAbility

        this.hasCoolDownEnded = true;

        this.logger = gameObject.scene.plugins.get('logger');

        // When an ability is equipped
        EventBus.on('abilityEquipped', this.onAbilityEquipped, this);
    }

    /**
     * Returns currently equipped ability
     * @returns 
     */
    getCurrentAbility(){
        return this.#ability;
    }

    /**
     * Removes currently equipped ability
     * @returns {void}
     */
    clearAbility() {
        this.#ability = null;
    }

    onAbilityEquipped(ability) {
        this.#ability = ability;
    }

    update(t, dt){
        // If player tries to use ability and an abilty is equiped execute ability
        if(this.keys.ability.isDown && this.#ability && this.hasCoolDownEnded) {
            // Apply ability
            this.gameObject.emit('buffApplied', this.#ability);
            EventBus.emit('playerAbilityTriggered', this.#ability);

            this.hasCoolDownEnded = false;
            // Start cool-down timer to know when ability can be activated again
            this.gameObject.scene.time.addEvent({
                delay: this.#ability.coolDown,
                callback: ()=>this.hasCoolDownEnded = true,
                loop: false
            });
        }
    }

    /**
     * Cleans up the component, disabling it.
     * @returns {void}
     */
    destroy() {
        super.destroy();
        EventBus.off('abilityEquipped', this.onAbilityEquipped, this);
    }
}