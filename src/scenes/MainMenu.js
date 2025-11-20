import MainMenuModel from "../js/UI/main-menu/MainMenuModel.js";
import MainMenuView from "../js/UI/main-menu/MainMenuView.js";
import MainMenuPresenter from "../js/UI/main-menu/MainMenuPresenter.js";
import { SoundSceneFacade } from "../js/core/sound-facade.js";
import showLoaderUI from "../js/UI/LoaderUI.js";
import audioConfig from "../configs/audio-config.json";

import NPCsDialogueModel from "../js/UI/NPCsDialogue/NPCsDialogueModel.js";
import NPCsDialoguePresenter from "../js/UI/NPCsDialogue/NPCsDialoguePresenter.js";
import NPCsDialogueView from "../js/UI/NPCsDialogue/NPCsDialogueView.js";

import dialogueTest from "../configs/Dialogues/NPCsDialogue-config.json"
import dialogueEvents from "../configs/Dialogues/NPCsDialogue-buttonEvents.js"

import { EventBus } from "../js/core/event-bus.js";

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super("MainMenu");
    }

    preload() {
        showLoaderUI(this);
    }

    create() {
        this.sound_facade = new SoundSceneFacade(this, audioConfig);
        
        const model = new MainMenuModel();
        const view = new MainMenuView(this);
        const presenter = new MainMenuPresenter(view, model);

        //const model = new NPCsDialogueModel(dialogueTest,dialogueEvents);
        //const view = new NPCsDialogueView(this);
        //const presenter = new NPCsDialoguePresenter(view,model);
        
        //EventBus.emit("StartDialogue","npcName1")
    }
}