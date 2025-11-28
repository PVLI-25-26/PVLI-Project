import createPlayerKeys from "../../configs/controls-config";
import { BaseComponent } from "../core/base-component";
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
    constructor(gameObject){
        super(gameObject);
        // Get player keys
        this.keys = createPlayerKeys(gameObject.scene);

        // FOR TESTING - create ability used
        // this.#ability = {
        //     type: 'dash',
        //     value: 20,
        //     duration: 65,
        //     coolDown: 1000
        // };
        // this.#ability = {
        //     type: 'forceField',
        //     value: {
        //         effectRadius: 100,
        //         duration: 1000, // I know its weird but the game crashed, this is the real duration.
        //     },
        //     duration: 1000,
        //     coolDown: 1000,
        // }
        this.#ability = {
            type: 'invisibility',
            value: 1000,
            duration: 1000,
            coolDown: 1000,
        }
        //this.#ability = new Invisibility(gameObject.scene, 1000, 3000, this.gameObject);

        this.hasCoolDownEnded = true;

        this.logger = gameObject.scene.plugins.get('logger');
    }

    update(t, dt){
        // If player tries to use ability and an abilty is equiped execute ability
        if(this.keys.ability.isDown && this.#ability && this.hasCoolDownEnded) {
            // Apply ability
            this.gameObject.emit('buffApplied', this.#ability);

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
    }
}