import { BillBoard } from "./BillBoard.js";
import { EventBus } from "../core/event-bus.js";

export class NPC extends BillBoard{
    constructor(scene,x,y,config){
        super(scene,x,y,config.billboardConfig,{isStatic:true,isSensor:false});
        this.config = config;
        this.dialogueName = config.dialogueName; 

        // Dialogue height
        this.height = 10; 
        this.x = x;
        this.y = y
        
        this.scene.add.existing(this);

        this.interactZoneWidth = 20;
        this.interactZoneHeight = 20;

        //new Phaser.GameObjects.Zone(this.scene,x,y,this.interactZoneWidth,this.interactZoneHeight);
        //this.interactObject = this.scene.add.zone(x,y).setInteractive();

        //this.interactZone = new Zone(this.scene, x,y,this.interactZoneWidth,this.interactZoneHeight);
        //this.scene.matter.world.on("collisionstart",(event,BodyA,bodyB)=>{
        //    if (BodyA === this|| bodyB ===this){
        //        this.throwDialogue()
        //    }
        //})
        this.throwDialogue();
    }

    throwDialogue(){
        console.log(this.dialogueName)
        const R = 0;
        var transformationMatrix = new Phaser.Math.Matrix4();
        transformationMatrix.setValues(
            Math.cos(R),-Math.sin(R),1,1,
            Math.sin(R), Math.cos(R),1,1,
            1,1,1,1,
            1,1,1,1
        );
        var position = new Phaser.Math.Vector3(this.x-200,this.y-this.height,1);
        position = position.transformMat4(transformationMatrix);
        EventBus.emit("StartDialogue",this.dialogueName, position.x,position.y);
    }

}