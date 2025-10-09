export const SERVICE_KEYS = Object.freeze({
    PROGRESION_MANAGER: 'ProgressionManager',
    SOUND_MANAGER: 'SoundManager',
    SAVELOADSYSTEM: 'SaveLoadSystem',
    SETTINGS: 'Settings',
    LOGGER: 'Logger',
});

class ServiceLocator {
    // cachedServices is private and can't be directly accessed
    #cachedServices;

    constructor (){
        // Here we store the services used
        this.#cachedServices = {};
    }

    /**
     * @param {SERVICE_KEYS} serviceKey Key of the service to register
     * @param {Object} service Service being registered
     */
    setService(serviceKey, service){
        // If the service existed it is replaced, if not a new property is made with the new serviceKey
        this.#cachedServices[serviceKey] = service;
    }

    /**
     * @param {SERVICE_KEYS} serviceKey Key of the service to return
     */
    getService(serviceKey){
        // Returns the service with the key serviceKey. If not return undefined
        return this.#cachedServices[serviceKey];
    }

    /**
     * @param {SERVICE_KEYS} serviceKey Key of the service to remove
     */
    removeService(serviceKey){
        delete this.#cachedServices[serviceKey];
    }

    /**
     * Removes all services from the service locator
     */
    removeAllServices(){
        this.#cachedServices = {};
    }
}

// This is only executed once, therefore all who import it have the same instance
export default new ServiceLocator();