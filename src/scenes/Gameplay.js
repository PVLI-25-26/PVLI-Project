import playerConfig from "../configs/player-config.json";
import audioConfig from "../configs/audio-config.json";
import obstaclesConfig from "../configs/obstacles-config.json";
import { Player } from '../js/entities/Player.js';
import { Obstacle } from '../js/entities/Obstacle.js';
import showLoaderUI from "../js/UI/LoaderUI.js";
import { SoundSceneFacade } from "../js/core/sound-facade.js";


export default class GameplayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameplayScene' });
    }

    preload() {
        showLoaderUI(this);

        this.load.image('player', 'assets/sprites/player-dummy.png');
        this.load.spritesheet('arrow', 'assets/sprites/arrow.png', {frameWidth:32});
        this.load.spritesheet('barrel-spritestack', 'assets/sprites/SpriteStackingPlaceholders/MiscProps/Barrel_strip8.png', {frameWidth: 14});
        this.load.spritesheet('wall-spritestack', 'assets/sprites/SpriteStackingPlaceholders/Walls/WallCornerBrick_strip16.png', {frameWidth: 16});
        this.load.spritesheet('chest-spritestack', 'assets/sprites/SpriteStackingPlaceholders/MiscProps/Chestf0_strip18.png', {frameWidth: 16, spacing: 6});
        this.load.spritesheet('crate-spritestack', 'assets/sprites/SpriteStackingPlaceholders/MiscProps/Crate_strip8.png', {frameWidth: 16});
    }

    create() {
        this.sound_facade = new SoundSceneFacade(this, audioConfig);

        
        
        this.obstaclesGroup = this.physics.add.staticGroup({name: 'obstacles'});
        obstaclesConfig.forEach(cfg => {
            const obstacle = new Obstacle(this, cfg);
            this.obstaclesGroup.add(obstacle);
        });
        
        this.player = new Player(this, playerConfig);
        
        this.physics.add.collider(this.player, this.obstaclesGroup);

        this.cameras.main.startFollow(this.player, false, 0.1, 0.1, 10, 10);
    }

    update(time, delta) {}
}

