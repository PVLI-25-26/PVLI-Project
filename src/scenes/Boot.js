import imagesConfig from "../configs/images-config.json";
import audioConfig from "../configs/audio-config.json";
import showLoaderUI from "../js/UI/LoaderUI";

export default class Boot extends Phaser.Scene {
    constructor() {
        super("Boot");
        this.fontsLoaded = 0;
        this.fontsToLoad = 2;
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
        this.loadFonts();
		this.setUpAnimations();
    }
    loadFonts(){
        document.fonts.load("32px FableFont").then(()=>{});
        document.fonts.load("32px MicroChat").then(()=>{});

    }
	setUpAnimations(){
		this.anims.create({
			key:"elemental_idle",
			frames: this.anims.generateFrameNumbers("Elemental_animation",{start: 0, end: 9}),
			framerate: 8,
			repeat: -1,
			duration: 1500
		});
		this.anims.create({
			key:"elemental_walk",
			frames: this.anims.generateFrameNumbers("Elemental_animation",{start: 10, end: 21}),
			framerate: 8,
			repeat: -1,
			duration: 1000
		});
		this.anims.create({
            key: "player_idle_bow",
            frames: this.anims.generateFrameNumbers("Player_animation", {start:0, end: 7}),
            frameRate: 8,
            repeat: -1
        });
		this.anims.create({
            key: "player_walk_bow",
            frames: this.anims.generateFrameNumbers("Player_animation", {start:8, end: 18}),
            frameRate: 12,
            repeat: -1
        });
		this.anims.create({
            key: "player_idle",
            frames: this.anims.generateFrameNumbers("Player_animation", {start:19, end: 27}),
            frameRate: 8,
            repeat: -1
        });
		this.anims.create({
            key: "player_walk",
            frames: this.anims.generateFrameNumbers("Player_animation", {start:28, end: 37}),
            frameRate: 12,
            repeat: -1
        });
		this.anims.create({
            key: "melinoe_idle",
            frames: this.anims.generateFrameNumbers("Melinoe_animation", {start:0, end: 3}),
            frameRate: 6,
            repeat: -1
        });
		this.anims.create({
            key: "slime_idle",
            frames: this.anims.generateFrameNumbers("Slime_animation", {start:0, end: 3}),
            frameRate: 12,
            repeat: -1
        });
		this.anims.create({
            key: "slime_walk",
            frames: this.anims.generateFrameNumbers("Slime_animation", {start:0, end: 3}),
            frameRate: 12,
            repeat: -1
        });
		this.anims.create({
            key: "dryad_idle",
            frames: this.anims.generateFrameNumbers("Dryad_animation", {start:0, end: 5}),
            frameRate: 8,
            repeat: -1
        });
		this.anims.create({
            key: "dryad_walk",
            frames: this.anims.generateFrameNumbers("Dryad_animation", {start:0, end: 15}),
            frameRate: 12,
            repeat: -1
        });
		this.anims.create({
            key: "dryad_heal",
            frames: this.anims.generateFrameNumbers("Dryad_animation", {start:16, end: 25}),
            frameRate: 12,
        });
		this.anims.create({
			key: "animated_portal",
			frames: this.anims.generateFrameNumbers("Portal_animation",{start:0,end:3}),
			frameRate:8,
			repeat:-1
		});
		this.anims.create({
			key: "golem_walk",
			frames: this.anims.generateFrameNumbers("Golem_animation",{start:0,end:11}),
			frameRate:8,
			repeat:-1
		});
		this.anims.create({
			key: "golem_idle",
			frames: this.anims.generateFrameNumbers("Golem_animation",{start:12,end:12}),
			frameRate:1,
			repeat:-1
		});
		this.anims.create({
			key: "golem_up",
			frames: this.anims.generateFrameNumbers("Golem_animation",{start:12,end:22}),
			frameRate:12,
		});
		this.anims.create({
			key: "golem_down",
			frames: this.anims.generateFrameNumbers("Golem_animation",{start:23,end:33}),
			frameRate:12,
		});
	
		
		


	}
}
