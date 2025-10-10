import playerConfig from "../configs/player-config.json";
import { Player } from '../js/entities/Player.js';


export default class GameplayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameplayScene' });
    }

    preload() {
        this.load.image('player', 'assets/player-dummy.png');
    }

    create() {
        this.player = this.add.player(playerConfig);
    }

    update(time, delta) {
    }
}

