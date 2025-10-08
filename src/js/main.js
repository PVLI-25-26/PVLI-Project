import Phaser, { Game } from "phaser";
import serviceLocator, { SERVICE_KEYS } from "./service-locator";
import Gameplay from "../scenes/Gameplay";
import { LOG_LEVELS, Logger } from "./logger";

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
        gravity: { y: 500 },
        debug: false
        }
    },

    scene: [Gameplay],
}

// Make game instance
const game = new Phaser.Game(config);

// Make random placeholders

let logger = new Logger({
    modules: ['LOADER'], 
    level: LOG_LEVELS.DEBUG
});

let progresionManager = {
    init: function(){logger.log('module1', LOG_LEVELS.INFO, '[Progresion Manager]: Initialized')}
}

let saveLoadSystem = {
    init: function(){logger.log('module1', LOG_LEVELS.INFO, '[Save/Load System]: Initialized')}
}


// Cache the services in the service locator

serviceLocator.setService(SERVICE_KEYS.PROGRESION_MANAGER, progresionManager);
serviceLocator.setService(SERVICE_KEYS.SAVELOADSYSTEM, saveLoadSystem);
serviceLocator.setService(SERVICE_KEYS.SETTINGS, config);
serviceLocator.setService(SERVICE_KEYS.LOGGER, logger);

// ========================================================




