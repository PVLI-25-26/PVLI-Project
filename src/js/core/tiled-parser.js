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