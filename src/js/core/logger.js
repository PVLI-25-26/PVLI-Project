/**
 * Available levels for logging
 * 
 * DEBUG < INFO < WARNING < ERROR
 */
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

/**
 * Logs messages to the console with a custom behaviour.
 * Only messages with a higher log level and in the enabled modules are logged to console.
 */
export class Logger{
    #enabledModules;
    #currentLogLevel;

    /**
     * Creates the logger with the configuration given
     * @param {Object} config Configuration object with predefined values for the logger.
     * @param {Array.<string>} config.modules Enabled modules of the logger
     * @param {LOG_LEVELS} config.level Log level of the logger
     */
    constructor(config){
        this.#enabledModules = new Set(config.modules);
        this.#currentLogLevel = config.level;
    }
    /**
     * Logs a message to the console
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

    /**
     * Enables a module from logging
     * @param {String} moduleKey The key being enabled
     */
    enableModule(moduleKey){
        this.#enabledModules.add(moduleKey);
    }

    /**
     * Disables a module from logging
     * @param {String} moduleKey The key being disabled
     */
    disableModule(moduleKey){
        this.#enabledModules.delete(moduleKey);
    }

    /**
     * Changes the current log level
     * @param {LOG_LEVELS} logLevel New log level to set
     */
    setLogLevel(logLevel){
        this.#currentLogLevel = logLevel;
    }
}