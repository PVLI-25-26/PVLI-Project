import { EventBus } from "../../core/event-bus";
import { BaseAbility } from "./BaseAbility";

export class Invisibility extends BaseAbility{
    constructor(scene, coolDown, duration, gameObject){
        super(scene, coolDown, duration, gameObject);
        this.player = gameObject;
        this.scene = scene;
        this.logger = this.scene.plugins.get('logger');
    }

    onAbilityActivated(){
        this.logger.log('ABILITES', 1, 'Invisibility activated');
        EventBus.emit('invisibilityActivated', {target: this.player, duration: this.duration});

        this.player.body.collisionFilter.mask = this.scene.enemiesCategory ^ this.player.body.collisionFilter.mask;
    }

    onAbilityDeactivated(){
        this.logger.log('ABILITES', 1, 'Invisibility ended');
        this.player.body.collisionFilter.mask = this.scene.enemiesCategory ^ this.player.body.collisionFilter.mask;
    }
}