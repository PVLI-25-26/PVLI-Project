import ballConfig from '../../../configs/Items/ball-config.json'
import goldenCupConfig from '../../../configs/Items/golden-cup-config.json'
import keyConfig from '../../../configs/Items/key-config.json'
import quesoConfig from '../../../configs/Items/queso-config.json'
import redVialConfig from '../../../configs/Items/red-vial-config.json'
import healthFlowerConfig from '../../../configs/Items/health-flower-config.json'
import speedVaseConfig from '../../../configs/Items/speed-vase-config.json'
import { Item } from '../../entities/Item';
import { ItemDisplay } from '../../UI/inventory-menu/ItemDisplay';

const ITEM_CONFIGS ={
    "ball": ballConfig,
    "golden-cup": goldenCupConfig,
    "key": keyConfig,
    "queso": quesoConfig,
    "red-vial": redVialConfig,
    "health-flower": healthFlowerConfig,
    "speed-vase": speedVaseConfig
}

export class ItemKey{
    type;
    level;
    constructor(type, level){
        this.type=type; 
        this.level=level;
    }
}

function getItemConfig(itemKey) {
    const itemsOfType = ITEM_CONFIGS[itemKey.type];
    const itemConfig = itemsOfType[itemKey.level];
    return itemConfig;
}

function clampItemLevel(itemKey, level) {
    return (level < ITEM_CONFIGS[itemKey].length ? level : ITEM_CONFIGS[itemKey].length - 1);
}

export function createItem(scene, itemSceneData, roomsExplored){
    const randomItemLevel = Math.round(Math.random() * (roomsExplored-1));
    const itemKey = new ItemKey(itemSceneData.type, clampItemLevel(itemSceneData.type, randomItemLevel));
    const itemConfig = getItemConfig(itemKey);
    itemConfig.key = itemKey;
    let item = new Item(
        scene, 
        itemSceneData.x, 
        itemSceneData.y, 
        itemSceneData.id, 
        // Coge la id base del objeto y le suma el numero de habitaciones exploradas para sacara el item real
        itemConfig
    );
    item.setCollisionCategory(scene.interactablesCategory);
    return item;
}

export function createItemDisplay(scene, x, y, w, h, itemKey){
    const itemConfig = getItemConfig(itemKey);
    const itemDisplay = new ItemDisplay(scene, x, y, itemConfig.displayData, w, h);

    return itemDisplay;
}


export function createItemBuff(itemKey){
    const itemConfig = getItemConfig(itemKey);
    return itemConfig.buffData;
}