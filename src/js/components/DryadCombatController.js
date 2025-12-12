import { EventBus } from "../core/event-bus";
import { BaseComponent } from "../core/base-component.js";
import { DryadMovementControllerComponent } from "../components/DryadMovementController.js";
import { DamageableComponent } from "../components/DamageableComponent.js";


export class DryadCombatControllerComponent extends BaseComponent {
    /** 
    * @param {Phaser.GameObjects.GameObject} gameObject
    */
    constructor(gameObject) {
        super(gameObject);

        this.controller = this.getComponent(DryadMovementControllerComponent);;
        this.damageableComponent = this.getComponent(DamageableComponent);
        this.target = null;
        this.healAmount = 2;
        this.healRange = 150;
        this.healCooldown = 3000;
        this.healTimer = 0;

        EventBus.on('entityMoved', this.onEntityMoved, this);
		this.gameObject.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + "dryad_heal",()=>{
			this.gameObject.play("dryad_walk",true);
		},this);
    }
    
    update(time, delta) {
        if (this.healTimer > 0) {
            this.healTimer -= delta;
        }
        else {
            this.healTimer = 0;
        }
    }

    onEntityMoved(data) {
        if ((data.entity.type == 'enemy' || data.entity.type == 'boss') && this.checkIsEntityInHealRange(data.entity) && data.entity !== this.gameObject) {

            if (this.healTimer <= 0) {
                const entityDamageable = data.entity.getComponent(DamageableComponent);
                if (entityDamageable == null) return;
                if (entityDamageable.currentHP < entityDamageable.maxHP) {
                    entityDamageable.heal(this.healAmount);
                }
                else if (this.damageableComponent.currentHP < this.damageableComponent.maxHP) {
                    this.damageableComponent.heal(this.healAmount);
                }
                else { 
                    return;
                }
                EventBus.emit('playSound', 'dryadHeal');
                this.healTimer = this.healCooldown;
				this.gameObject.play("dryad_heal",true);
            }
        }
    }

    checkIsEntityInHealRange(entity) {
        const distance = Phaser.Math.Distance.Between(
            this.gameObject.x, this.gameObject.y,
            entity.x, entity.y
        );
        return distance <= this.healRange;
    }

    destroy() {
        EventBus.off('entityMoved', this.onEntityMoved, this);
        super.destroy();
    }
    
}
