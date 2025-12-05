import { EventBus } from "../core/event-bus";
import { BaseComponent } from "../core/base-component.js";
import { BasicEnemyControllerComponent } from "../components/BasicEnemyController.js";
import { DamageableComponent } from "../components/DamageableComponent.js";


export class BasicEnemyCombatControllerComponent extends BaseComponent {
    /** 
    * @param {Phaser.GameObjects.GameObject} gameObject
    */
    constructor(gameObject) {
        super(gameObject);

        EventBus.on('arrowLanded', this.healEntity, this);
        this.controller = this.getComponent(BasicEnemyControllerComponent);;
        this.damageableComponent = this.getComponent(DamageableComponent);
    }

    healEntity() {
        console.log('Healing entity if targeted');  
        const target = this.gameObject;
        this.damageableComponent.heal(1);
    }
    
    update(time, delta) {
        return; 
    }
}
