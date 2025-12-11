import { BillBoard } from "./BillBoard.js";
import { EventBus } from "../core/event-bus.js";
import Colors from "../../configs/colors-config.js";
import missionManager from "../core/mission-manager.js";

/**
 * NPC billboard entity that can show dialogues, provide missions and display an interact key tip.
 *
 * Extends BillBoard and integrates with the global EventBus and missionManager.
 *
 * @extends BillBoard
 */
export class NPC extends BillBoard{
    /**
     * Create an NPC.
     * @param {Phaser.Scene} scene - The scene this NPC belongs to.
     * @param {number} x - X world position.
     * @param {number} y - Y world position.
     * @param {Object} config - NPC configuration object.
     * @param {Object} config.billboardConfig - Configuration forwarded to BillBoard (visual/dialogue settings).
     * @param {Object} [config.physicsConfig] - Optional physics body configuration (MatterJS).
     * @param {string} config.dialogueName - Dialogue key/name to start when interacting (if not mission-based).
     * @param {boolean} [config.givesMissions=false] - Whether this NPC provides missions.
     */
    constructor(scene,x,y,config){
        super(scene,x,y,config.billboardConfig,config.physicsConfig);
        this.config = config;
        /** @type {string} */
        this.dialogueName = config.dialogueName; 
        /** @type {boolean} */
        this.hasInteracted = false;

        // Dialogue position offset
        /** @type {number} */
        this.diagOffsetY = -150;
        /** @type {number} */
        this.diagOffsetX = -80;
        // Exclamation offset
        /** @type {number} */
        this.availableIconOffsetX = 10;
        /** @type {number} */
        this.availableIconOffsetY = -20;
        
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
        this.availableIcon = this.scene.add.text(this.x, this.y, '!', {
            color: Colors.Orange,
            fontFamily: 'MicroChat',
            fontSize: 12
        }).setOrigin(0.5).setVisible(config.givesMissions);
        this.rotateUI(0, 1, 0);

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
            this.rotateUI(cR, sR, R);
        })


        // #endregion
    }

     /**
     * Position and rotate the key tip relative to the NPC based on camera rotation.
     * @param {number} cR - Cosine of the camera rotation (cos(R)).
     * @param {number} sR - Sine of the camera rotation (sin(R)).
     * @param {number} R - Camera rotation in radians.
     * @private
     */
    rotateUI(cR, sR, R) {
        this.keyTip.x = this.keyTipOffsetX * cR - this.keyTipOffsetY * sR + this.x;
        this.keyTip.y = this.keyTipOffsetX * sR + this.keyTipOffsetY * cR + this.y;
        this.availableIcon.x = this.availableIconOffsetX * cR - this.availableIconOffsetY * sR + this.x;
        this.availableIcon.y = this.availableIconOffsetX * sR + this.availableIconOffsetY * cR + this.y;
        this.availableIcon.rotation = -R;
        this.keyTip.rotation = -R;
        this.keyTipKey.x = this.keyTip.x;
        this.keyTipKey.y = this.keyTip.y;
        this.keyTipKey.rotation = this.keyTip.rotation;
    }

    /**
     * Show the interact key tip with a short fade-in tween.
     * Makes both the background nineslice and key text visible and animates alpha.
     * @private
     */
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

    /**
     * Hide the interact key tip with a short fade-out tween.
     * @private
     */
    hideKeyTip() {
        this.scene.tweens.add({
            targets: [this.keyTip, this.keyTipKey],
            alpha: 0,
            duration: 150,
            onComplete: () => { this.keyTip.setVisible(false); this, this.keyTipKey.setVisible(false); }
        });
    }

    /**
     * Event handler invoked when a player triggers an 'interact' event.
     * Checks if the interaction receiver is this NPC and, if so, opens dialogue.
     * @param {any} player - The player that interacted (emitted with the event).
     * @param {NPC|any} reciever - The intended receiver of the interaction (compared by identity).
     * @private
     */
    onPlayerInteraction(player, reciever){
        // check if the reciever is me
        if(reciever === this)
        {
            this.throwDialogue();
        }
    }

    /**
     * Determine dialogue position relative to camera and start the appropriate dialogue flow.
     * 
     * Emits "StartDialogue" on EventBus with (dialogueName, x, y).
     * @private
     */
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
         
        if(this.hasInteracted){
            this.availableIcon.setVisible(false);
        }
    }

}
