import imagesConfig from "../configs/images-config.json";
import audioConfig from "../configs/audio-config.json";
import showLoaderUI from "../js/UI/LoaderUI";

export default class Boot extends Phaser.Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        this.logger = this.plugins.get('logger');
        
        showLoaderUI(this);
        
        this.logger.log('BOOT', 1, 'Loading images ...');
        // Load Images
        imagesConfig.forEach((asset)=>{
            this.load[asset.type](asset.key, asset.file, asset.settings);
        });

        this.logger.log('BOOT', 1, 'Loading audio ...');
        // Load Audio
        audioConfig.sounds.forEach(sound => this.load.audio(sound.key, sound.file));
        audioConfig.music.forEach(track => this.load.audio(track.key, track.file));
    }

    create() {
        this.logger.log('BOOT', 1, 'Loading complete, starting game!');
        this.scene.start('MainMenu');
    }
}