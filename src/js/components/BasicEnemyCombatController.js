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

        this.controller = this.getComponent(BasicEnemyControllerComponent);;
        this.damageableComponent = this.getComponent(DamageableComponent);
    }

    healEntity() {
        const target = this.gameObject;
        this.damageableComponent.heal(1);
    }
    
    update(time, delta) {
        return; 
    }
}
