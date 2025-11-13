import createPlayerKeys from "../../configs/controls-config";
import { BaseComponent } from "../core/base-component";
import { Dash } from "./Abilities/Dash";
import { ForceField } from "./Abilities/ForceField";
import { Invisibility } from "./Abilities/Invisibility";

export class PlayerAbilityControllerComponent extends BaseComponent{
    #ability;

    constructor(gameObject){
        super(gameObject);
        this.keys = createPlayerKeys(gameObject.scene);
        //this.#ability = new Dash(gameObject.scene, 2000, 100, 20);
        this.#ability = new ForceField(gameObject.scene, 1000, 100, this.gameObject, 20, 100);
        this.logger = gameObject.scene.plugins.get('logger');
    }

    update(t, dt){
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