import PauseMenuModel from "../js/UI/pause-menu/PauseMenuModel.js";
import PauseMenuView from "../js/UI/pause-menu/PauseMenuView.js";
import PauseMenuPresenter from "../js/UI/pause-menu/PauseMenuPresenter.js";
import { SoundSceneFacade } from "../js/core/sound-facade.js";
import showLoaderUI from "../js/UI/LoaderUI.js";
import audioConfig from "../configs/audio-config.json";

export default class PauseMenu extends Phaser.Scene {
    constructor() {
        super("PauseMenu");
    }

    preload() {
        showLoaderUI(this);
        this.load.image('musicIcon', 'assets/sprites/music-icon.webp');
        this.load.image('sfxIcon', 'assets/sprites/sfx-icon.png');

        audioConfig.sounds.forEach(sound => this.load.audio(sound.key, sound.file));
        audioConfig.music.forEach(track => this.load.audio(track.key, track.file));

        this.keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    }

    create() {
        this.sound_facade = new SoundSceneFacade(this, audioConfig);

        const model = new PauseMenuModel();
        const view = new PauseMenuView(this);
        const presenter = new PauseMenuPresenter(view, model);

        const overlay = this.add.rectangle(
            this.scale.width / 2,
            this.scale.height / 2,
            this.scale.width,
            this.scale.height,
            0x000000,
            0.5
        ).setDepth(-1);

        this.tweens.add({
            targets: [overlay, ...view.elements],
            alpha: { from: 0, to: 1 },
            duration: 300,
            ease: "Sine.easeInOut"
        });
    }
    
    update(){
        super.update()
        if(Phaser.Input.Keyboard.JustDown(this.keyP)){
            this.sound_facade.destroy();
            this.scene.resume("GameplayScene");
            this.scene.stop("PauseMenu");
        }
    }
}
