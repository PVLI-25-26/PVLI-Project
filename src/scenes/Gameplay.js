import Player from "../js/entities/Player.js"

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    preload() {
        this.load.image("player", "/PVLI-Project/assets/player-dummy.png");
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys();

        this.player = new Player(this, 400, 300, "player", this.cursors, 200);
    }

    update(time, delta) {
        this.player.update(delta);
    }
}
