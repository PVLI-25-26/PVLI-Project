import { BillBoard } from "./BillBoard.js";
import { EventBus } from "../core/event-bus.js";
import Colors from "../../configs/colors-config.js";
import missionManager from "../core/mission-manager.js";

export class NPC extends BillBoard{
    constructor(scene,x,y,config){
        super(scene,x,y,config.billboardConfig,config.physicsConfig);
        this.config = config;
        this.dialogueName = config.dialogueName; 
        this.hasInteracted = false;

        // Dialogue position offset
        this.diagOffsetY = -150;
        this.diagOffsetX = -80;
        this.x = x;
        this.y = y
        
        this.scene.add.existing(this);

        if(config.physicsConfig) this.setCollisionCategory(scene.interactablesCategory);
        
        EventBus.on('interact', this.onPlayerInteraction, this);

        // #region Key Press tip MOVE TO HUD
        // Key press tip shown when player is close (This logic should be moved to HUD but Daniil is sick so ill move it later when he pushes)
        this.keyTip = this.scene.add.nineslice(this.x, this.y, 'UIbackground',0,15,15,3,3,3,3).setVisible(false).setScale(2);
        this.keyTipKey = this.scene.add.text(this.x, this.y, 'F', {
            color: Colors.White,
            fontFamily: 'MicroChat',
            fontSize: 10
        }).setOrigin(0.5).setVisible(false);
        this.rotateKeyTip(0, 1, 0);

        // Key press tip offset when shown
        this.keyTipOffsetX = 20;
        this.keyTipOffsetY = -50;

        // Create interact zone to detect if player is close
        this.interactZone = this.scene.add.zone(this.x, this.y);
        this.scene.matter.add.gameObject(this.interactZone, {
            shape: {
                type: "circle",
                radius: 50,
            },
            isSensor: true
        });
        this.interactZone.setOnCollide(()=>{
            this.showKeyTip();
        });
        this.interactZone.setOnCollideEnd(()=>{
            this.hideKeyTip();
        })
        this.interactZone.setCollidesWith(this.scene.playerCategory);

        EventBus.on('cameraRotated', (R, cR, sR)=>{
            this.rotateKeyTip(cR, sR, R);
        })
        // #endregion
    }

    rotateKeyTip(cR, sR, R) {
        this.keyTip.x = this.keyTipOffsetX * cR - this.keyTipOffsetY * sR + this.x;
        this.keyTip.y = this.keyTipOffsetX * sR + this.keyTipOffsetY * cR + this.y;
        this.keyTip.rotation = -R;
        this.keyTipKey.x = this.keyTip.x;
        this.keyTipKey.y = this.keyTip.y;
        this.keyTipKey.rotation = this.keyTip.rotation;
    }

    showKeyTip() {
        this.scene.tweens.add({
            targets: [this.keyTip, this.keyTipKey],
            alpha: 1,
            duration: 150,
        });
        this.keyTip.setAlpha(0);
        this.keyTip.setVisible(true);
        this.keyTipKey.setAlpha(0);
        this.keyTipKey.setVisible(true);
    }

    hideKeyTip() {
        this.scene.tweens.add({
            targets: [this.keyTip, this.keyTipKey],
            alpha: 0,
            duration: 150,
            onComplete: () => { this.keyTip.setVisible(false); this, this.keyTipKey.setVisible(false); }
        });
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

        this.hideKeyTip();

        // If NPC doesn't give missions, we just send their associated dialogue
        if(!this.config.givesMissions){
            this.hasInteracted = true;
            EventBus.emit("StartDialogue",this.dialogueName, diagPosX, diagPosY);
        }
        // If NPC gives missions and hasn´t given a mission yet
        else if(!this.hasInteracted){
            // Request mission manager next mission dialogue and start it
            const mission = missionManager.getMissionDialogue();
            // If the player recieves a new, mission, we set the flag as interacted. If it isn't a new mission (player is claiming missions), we set the flag as false.
            this.hasInteracted = mission.isNewMission;
            EventBus.emit("StartDialogue", mission.dialogue, diagPosX, diagPosY);
        }
        else{
            EventBus.emit("StartDialogue", "noMoreMissions", diagPosX, diagPosY);
        }
            
    }

}