import dungeon from "../core/dungeon";
import { EventBus } from "../core/event-bus";
import { BillBoard } from "./BillBoard";

export class Item extends BillBoard{
    constructor(scene, x, y, config){
        super(scene, x, y, config.billboardConfig, config.physicsConfig);
        this.key = config.key;
        this.scene.add.existing(this);
        this.collectSound = config.collectSound;
        EventBus.on('itemPicked', this.pickUpItem, this);
    }

    pickUpItem(picker, item){
        if(item === this)
        {
            EventBus.emit('playSound', this.collectSound);
            this.scene.tweens.add({
                targets: this,
                alpha: 0,
                duration: 100,
                repeat: 0,
                onComplete: (tween)=>{
                    this.setActive(false);
                    this.setVisible(false);
                    tween.remove();
                }
            });
            this.setCollidesWith(0);
        }
    }
}