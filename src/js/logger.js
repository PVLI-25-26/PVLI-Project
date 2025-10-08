export const LOG_LEVELS = Object.freeze({
    DEBUG: 0,
    INFO: 1,
    WARNING: 2,
    ERROR: 3,
})

/**
 * 
 * @returns Returns current time formatted as hh:mm:ss
 */
function getCurrentTime() {
    let date = new Date();
    let h = String(date.getHours()).padStart(2, '0');
    let m = String(date.getMinutes()).padStart(2, '0');
    let s = String(date.getSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
}

// TODO - make logger read from an actual config file in the developer computer
export class Logger{
    #enabledModules;
    #currentLogLevel;

    /**
     * @param {Object} config Configuration object with predefined values for the logger.
     * @param {Array.<string>} config.modules Enabled modules of the logger
     * @param {LOG_LEVELS} config.level Log level of the logger
     */
    constructor(config){
        this.#enabledModules = new Set(config.modules);
        this.#currentLogLevel = config.level;
    }
    /**
     * 
     * @param {string} message Message to log.
     * @param {string} moduleKey Module to which the log belongs to.
     * @param {LOG_LEVELS} logLevel Level of the message being logged
     */
    log(moduleKey, logLevel, message){
        if(!this.#enabledModules.has(moduleKey)
           || logLevel < this.#currentLogLevel)
            return;
        let logLevelText = ['DEBUG', 'INFO', 'WARNING', 'ERROR'];

        let text = `${getCurrentTime()} [${moduleKey}] [${logLevelText[logLevel]}]: ${message}`;
        
        console.log(text);
    }

    enableModule(moduleKey){
        this.#enabledModules.add(moduleKey);
    }

    disableModule(moduleKey){
        this.#enabledModules.delete(moduleKey);
    }

    /**
     * 
     * @param {LOG_LEVELS} logLevel 
     */
    setLogLevel(logLevel){
        this.#currentLogLevel = logLevel;
    }
}