import playerConfig from "../configs/player-config.json";
import { Player } from '../js/entities/Player.js';
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
    }

    create() {
        this.player = this.add.player(playerConfig);
    }

    update(time, delta) {
    }
}

