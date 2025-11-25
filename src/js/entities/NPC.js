import { BillBoard } from "./BillBoard.js";

export class NPC extends BillBoard{
    constructor(scene,x,y,config){
        super(scene,x,y,config.BillBoardConfig,scene.cameras.main);
        this.config = config;
        this.scene.add.existing(this);
    }
}