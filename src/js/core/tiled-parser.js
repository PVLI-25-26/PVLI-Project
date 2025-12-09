/**
 * Get a custom property value from a Tiled object.
 *
 * @param {Object} tiledObject - Tiled object that may contain a properties array.
 * @param {string} propertyName - Name of the custom property to retrieve.
 * @returns {*|undefined} The property value if found, otherwise undefined.
 */
export function getCustomTiledProperty(tiledObject, propertyName){
    if(tiledObject.properties)
    {
        for(const property of tiledObject.properties)
        {
            if(property.name === propertyName){
                return property.value;
            }
        }
    }
    return undefined;
}

/**
 * Retrieve the objects array for a named layer in a Tiled map JSON.
 *
 * @param {Object} tiledMap - Full Tiled map (or room) JSON that contains a layers array.
 * @param {string} layerName - Name of the layer to find.
 * @returns {Array<Object>|undefined} The layer's objects array if found, otherwise undefined.
 */
export function getTiledMapLayer(tiledMap, layerName){
    if(tiledMap.layers){
        for(const layer of tiledMap.layers)
        {
            if(layer.name === layerName){
                return layer.objects;
            }
        }
    }
    return undefined;
}

/**
 * Find an object by its id inside a Tiled layer's objects array.
 *
 * @param {Array<Object>} tiledLayer - Array of Tiled objects (usually the result of getTiledMapLayer).
 * @param {number} objectID - ID of the object to locate.
 * @returns {Object|undefined} The matching object if found, otherwise undefined.
 */
export function getTiledObject(tiledLayer, objectID){
    if(tiledLayer){
        for(const object of tiledLayer)
        {
            if(object.id === objectID){
                return object;
            }
        }
    }
    return undefined;
}