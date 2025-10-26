import Phaser, { Game } from "phaser";
import serviceLocator, { SERVICE_KEYS } from "./core/service-locator.js";
import Gameplay from "../scenes/Gameplay";
import MainMenu from "../scenes/MainMenu.js";
//import loggerConfig from "../configs/logger-config.json"
import { Logger} from "./core/logger.js";
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
        debug: true,
        }
    },

    scene: [MainMenu, Gameplay],
}

// Make game instance
const game = new Phaser.Game(config);

// Create logger
//let logger = new Logger(loggerConfig);

// Make random placeholders
//let progresionManager = {
//    init: function(){logger.log('module1', LOG_LEVELS.INFO, '[Progresion Manager]: Initialized')}
//}
//
//let saveLoadSystem = {
//    init: function(){logger.log('module1', LOG_LEVELS.INFO, '[Save/Load System]: Initialized')}
//}



// Cache the services in the service locator

//serviceLocator.setService(SERVICE_KEYS.PROGRESION_MANAGER, progresionManager);
//serviceLocator.setService(SERVICE_KEYS.SAVELOADSYSTEM, saveLoadSystem);
//serviceLocator.setService(SERVICE_KEYS.SETTINGS, config);
//serviceLocator.setService(SERVICE_KEYS.LOGGER, logger);

// ========================================================




