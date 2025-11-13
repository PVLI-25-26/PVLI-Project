import { EventBus } from "../../core/event-bus";
import { BaseAbility } from "./BaseAbility";

export class Invisibility extends BaseAbility{
    constructor(scene, coolDown, duration){
        super(scene, coolDown, duration);
        
        this.scene = scene;
        this.logger = this.scene.plugins.get('logger');
    }

    onAbilityActivated(){
        this.logger.log('ABILITES', 1, 'Invisibility activated');
    }

    onAbilityDeactivated(){
        this.logger.log('ABILITES', 1, 'Invisibility ended');
    }
}