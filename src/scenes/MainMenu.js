import MainMenuModel from "../js/UI/main-menu/MainMenuModel.js";
import MainMenuView from "../js/UI/main-menu/MainMenuView.js";
import MainMenuPresenter from "../js/UI/main-menu/MainMenuPresenter.js";
import { SoundSceneFacade } from "../js/core/sound-facade.js";
import showLoaderUI from "../js/UI/LoaderUI.js";
import audioConfig from "../configs/audio-config.json";

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super("MainMenu");
    }

    preload() {
        showLoaderUI(this);
        this.load.image('musicIcon', 'assets/sprites/music-icon.webp');
        this.load.image('sfxIcon', 'assets/sprites/sfx-icon.png');
        
        audioConfig.sounds.forEach(sound => this.load.audio(sound.key, sound.file));
        audioConfig.music.forEach(track => this.load.audio(track.key, track.file));
    }

    create() {
        this.sound_facade = new SoundSceneFacade(this, audioConfig);
        
        const model = new MainMenuModel();
        const view = new MainMenuView(this);
        const presenter = new MainMenuPresenter(view, model);
    }
}