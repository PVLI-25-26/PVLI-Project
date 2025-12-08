import MainMenuModel from "../js/UI/main-menu/MainMenuModel.js";
import MainMenuView from "../js/UI/main-menu/MainMenuView.js";
import MainMenuPresenter from "../js/UI/main-menu/MainMenuPresenter.js";
import { SoundSceneFacade } from "../js/core/sound-facade.js";
import showLoaderUI from "../js/UI/LoaderUI.js";
import audioConfig from "../configs/audio-config.json";
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
        const presenter = new MainMenuPresenter(view, model)
    }
}