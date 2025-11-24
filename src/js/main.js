import Phaser, { Game } from "phaser";
import Gameplay from "../scenes/Gameplay";
import MainMenu from "../scenes/MainMenu.js";
import PauseMenu from "../scenes/PauseMenu.js";
import { Logger } from "./core/logger.js";
import InventoryMenu from "../scenes/InventoryMenu.js";
import Boot from "../scenes/Boot.js";
import Colors from "../configs/color-config.json"
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
    backgroundColor: Colors.DarkBrown,

    physics: {
        default: 'matter',
        matter: {
        enabled: true,
        gravity: { y: 0 },
        debug: false,
        }
    },

    scene: [Boot, MainMenu, Gameplay, PauseMenu, InventoryMenu],

    plugins: {
        global: [
            {key: 'logger', plugin: Logger, start: true}
        ]
    }
}

// Make game instance
new Phaser.Game(config);




