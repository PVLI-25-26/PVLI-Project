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

    pickUpItem(item){
        if(item === this)
        {
            EventBus.emit('playSound', this.collectSound);
            this.setActive(false);
            this.setVisible(false);
            this.setCollidesWith(0);
            dungeon.addItemToInventory(this.key);
        }
    }
}