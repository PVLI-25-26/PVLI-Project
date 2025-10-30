import Phaser, { Game } from "phaser";
import Gameplay from "../scenes/Gameplay";
import MainMenu from "../scenes/MainMenu.js";
import PauseMenu from "../scenes/PauseMenu.js";
import { Logger } from "./core/logger.js";
import SpriteStackingTest from "../scenes/SpriteStackingTest.js";
// ================== GAME ENTRY POINT ==================

// TODO - Read config from JSON file?
const config = {
    title: 'Project: Queso',
    version: '0.0',
    
    type: Phaser.WEBGL,
    pixelArt: true,

    parent: 'game-container',
    width: 800,
    height: 600,

    physics: {
        default: 'arcade',
        arcade: {
        gravity: { y: 0 },
        debug: false,
        }
    },

    scene: [MainMenu, Gameplay, PauseMenu],

    plugins: {
        global: [
            {key: 'logger', plugin: Logger, start: true}
        ]
    }
}

// Make game instance
const game = new Phaser.Game(config);




