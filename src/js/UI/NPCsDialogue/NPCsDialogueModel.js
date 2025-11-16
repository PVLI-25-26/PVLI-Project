import Phaser from "phaser";
import { EventBus } from "../../core/event-bus.js";


export default class NPCsDialogueModel{
    constructor(config){
        this.dialogues = config;
        this.currentDialogue = {
            npcName : "",
            dialogue : "",
            currentPage : 0,
            userOptions : {},
            speed : 1
        }

    }
}