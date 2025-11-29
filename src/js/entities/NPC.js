import { BillBoard } from "./BillBoard.js";
import { EventBus } from "../core/event-bus.js";

export class NPC extends BillBoard{
    constructor(scene,x,y,config){
        super(scene,x,y,config.billboardConfig,config.physicsConfig);
        this.config = config;
        this.dialogueName = config.dialogueName; 

        // Dialogue position offset
        this.diagOffsetY = -150;
        this.diagOffsetX = -80;
        this.x = x;
        this.y = y
        
        this.scene.add.existing(this);

        if(config.physicsConfig) this.setCollisionCategory(scene.interactablesCategory);
        
        EventBus.on('interact', this.onPlayerInteraction, this);
    }

    onPlayerInteraction(player, reciever){
        // check if the reciever is me
        if(reciever === this)
        {
            this.throwDialogue();
        }
    }

    throwDialogue(){
        const cam = this.scene.cameras.main;

        // DE TESTEO PQ ME ESTABA VOLVIENDO LOCO
        // for(let i = 0; i < 360; i++){
        //     this.scene.add.rectangle(
        //         this.diagOffsetX * Math.cos(i) - this.diagOffsetY * Math.sin(i) + this.x, 
        //         this.diagOffsetX * Math.sin(i) + this.diagOffsetY * Math.cos(i) + this.y, 
        //         5, 5, i*0xFFFFFFFF/360).setDepth(9999999);
        // }
        const diagPosX = this.diagOffsetX * Math.cos(-cam.rotation) - this.diagOffsetY * Math.sin(-cam.rotation) + this.x;
        const diagPosY = this.diagOffsetX * Math.sin(-cam.rotation) + this.diagOffsetY * Math.cos(-cam.rotation) + this.y;

        EventBus.emit("StartDialogue",this.dialogueName, diagPosX, diagPosY);
    }

}