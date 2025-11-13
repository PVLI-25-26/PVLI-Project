import { EventBus } from "../../core/event-bus";
import { BaseAbility } from "./BaseAbility";

export class ForceField extends BaseAbility{
    #pushStrength;
    #effectRadius;

    constructor(scene, coolDown, duration, player, pushStrength, effectRadius){
        super(scene, coolDown, duration);

        this.#pushStrength = pushStrength;
        this.#effectRadius = effectRadius;
        this.player = player;
        
        this.scene = scene;
        this.logger = this.scene.plugins.get('logger');

        this.effectZone = this.scene.add.zone(this.player.x, this.player.y);
        this.scene.matter.add.gameObject(this.effectZone, {
            shape: {
                type: "circle",
                radius: this.#effectRadius,
            },
            isSensor: true
        });
        this.effectZone.setOnCollide(this.pushEnemies);
        this.effectZone.setCollidesWith(0);
    }

    pushEnemies(pair){
        const player = pair.bodyA.gameObject;
        const enemy = pair.bodyB.gameObject;
        EventBus.emit('pushEnemy', { attacker: player, target: enemy});
    }

    onAbilityActivated(){
        this.logger.log('ABILITES', 1, 'ForceField activated');
        this.effectZone.setPosition(this.player.x, this.player.y);
        this.effectZone.setCollidesWith(this.scene.enemiesCategory);
    }

    onAbilityDeactivated(){
        this.logger.log('ABILITES', 1, 'ForceField ended');
        this.effectZone.setCollidesWith(0);
    }
}