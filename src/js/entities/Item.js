import { BillBoard } from "./BillBoard";

export class Item extends BillBoard{
    constructor(scene, x, y, config){
        super(scene, x, y, config.billboardConfig, config.physicsConfig);
        this.scene.add.existing(this);
    }

    pickUpItem(){
        this.setActive(false);
        this.setVisible(false);
        this.setCollidesWith(0);
        return {}; // will return item for inventory
    }
}