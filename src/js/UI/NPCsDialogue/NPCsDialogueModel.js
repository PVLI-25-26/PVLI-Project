import Phaser from "phaser";
import { EventBus } from "../../core/event-bus.js";


export default class NPCsDialogueModel{
    constructor(config){
        this.dialogue = config.dialogue;
        this.currentPage = 0;
        this.speed = config.speed;
        this.npcName = config.npcName[this.currentPage];
        this.userOptions = config.userOptions[this.currentPage];
    }
}