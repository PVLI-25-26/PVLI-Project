import createPlayerKeys from "../../configs/controls-config";
import { BaseComponent } from "../core/base-component";
import { Dash } from "./Abilities/Dash";
import { ForceField } from "./Abilities/ForceField";
import { Invisibility } from "./Abilities/Invisibility";

/**
 * Minimal interface for an ability instance used by the controller.
 * @typedef {Object} Ability
 * @property {function():void} [onAbilityPressed] - Called when ability input is pressed.
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
     * Create the PlayerAbilityControllerComponent.
     * @param {Phaser.GameObjects.GameObject} gameObject - Owner game object (player).
     */
    constructor(gameObject){
        super(gameObject);
        // Get player keys
        this.keys = createPlayerKeys(gameObject.scene);

        // FOR TESTING - create ability used
        //this.#ability = new Dash(gameObject.scene, 2000, 100, 20);
        this.#ability = new ForceField(gameObject.scene, 1000, 100, this.gameObject, 20, 100);
        //this.#ability = new Invisibility(gameObject.scene, 1000, 3000, this.gameObject);

        this.logger = gameObject.scene.plugins.get('logger');
    }

    update(t, dt){
        // If player tries to use ability and an abilty is equiped execute ability
        if(this.keys.ability.isDown && this.#ability) {
            if(this.#ability.onAbilityPressed) this.#ability.onAbilityPressed();
        }
    }

    /**
     * Cleans up the component, disabling it.
     * @returns {void}
     */
    destroy() {
        super.destroy();
    }
}