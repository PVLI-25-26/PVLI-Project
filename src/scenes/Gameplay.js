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
        this.load.image('barrel', 'assets/sprites/barrel.png');
        this.load.image('cube', 'assets/sprites/cube.png');
        this.load.image('column', 'assets/sprites/column.png');
        this.load.image('pointer', 'assets/sprites/pointer.png');
        this.load.image('arrow', 'assets/sprites/arrow.png');
    }

    create() {
        this.sound_facade = new SoundSceneFacade(this, audioConfig);

        this.player = new Player(this, playerConfig);
        
        this.obstaclesGroup = this.physics.add.staticGroup({name: 'obstacles'});
        obstaclesConfig.forEach(cfg => {
            const obstacle = new Obstacle(this, cfg);
            this.obstaclesGroup.add(obstacle);
        });
        
        this.physics.add.collider(this.player, this.obstaclesGroup);
    }

    update(time, delta) {}
}

