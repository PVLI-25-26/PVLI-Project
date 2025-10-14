import playerConfig from "../configs/player-config.json";
import obstaclesConfig from "../configs/obstacles-config.json";
import { Player } from '../js/entities/Player.js';
import { Obstacle } from '../js/entities/Obstacle.js';
import showLoaderUI from "../js/UI/LoaderUI.js";


export default class GameplayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameplayScene' });
    }

    preload() {
        showLoaderUI(this);

        // Testing Loading UI
        for(let i = 0; i < 1000; i++){
            this.load.image('testImg'+i, 'assets/player-dummy.png');
        }

        this.load.image('player', 'assets/player-dummy.png');
        this.load.image('barrel', 'assets/barrel.png');
        this.load.image('cube', 'assets/cube.png');
        this.load.image('column', 'assets/column.png');
        this.load.image('pointer', 'assets/pointer.png');
    }

    create() {
        this.player = new Player(this, playerConfig);

        this.obstaclesGroup = this.physics.add.staticGroup();
        obstaclesConfig.forEach(cfg => {
            const obstacle = new Obstacle(this, cfg);
            this.obstaclesGroup.add(obstacle);
        });

        this.physics.add.collider(this.player, this.obstaclesGroup);
    }

    update(time, delta) {}
}

