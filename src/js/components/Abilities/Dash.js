import { EventBus } from "../../core/event-bus";
import { BaseAbility } from "./BaseAbility";

export class Dash extends BaseAbility {
    #dashSpeed;

    constructor(scene, coolDown, duration, dashSpeed){
        super(scene, coolDown, duration);
        
        this.scene = scene;
        this.#dashSpeed = dashSpeed;
        this.logger = this.scene.plugins.get('logger');
    }

    onAbilityActivated(){
        this.logger.log('ABILITES', 1, 'Dash activated');
        EventBus.emit('playerDash', this.#dashSpeed);
    }

    onAbilityDeactivated(){
        this.logger.log('ABILITES', 1, 'Dash ended');
        EventBus.emit('playerDashEnd');
    }
}