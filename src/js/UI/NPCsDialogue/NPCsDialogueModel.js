import Phaser from "phaser";
import { EventBus } from "../../core/event-bus.js";


export default class NPCsDialogueModel{
    constructor(config, events){
        this.dialogues = config;
        this.currentDialogue = {
            npcName : "",
            dialogue : [],
            currentPage : 0,
            speed : 1,
            userOptions : []
        }
        // carga los eventos de los botones de userOptions
        this.events = events;
    }
}