import { EventBus } from "../core/event-bus";
import { BillBoard } from "./BillBoard";

export class Item extends BillBoard{
    constructor(scene, x, y, config){
        super(scene, x, y, config.billboardConfig, config.physicsConfig);
        this.key = config.key;
        this.scene.add.existing(this);
        this.collectSound = config.collectSound;
    }

    pickUpItem(){
        EventBus.emit('playSound', this.collectSound);
        this.setActive(false);
        this.setVisible(false);
        this.setCollidesWith(0);
        return {}; // will return item for inventory
    }
}