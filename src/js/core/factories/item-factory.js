import itemsConfig from '../../../configs/items-config.json'
import { Item } from '../../entities/Item';
import { ItemDisplay } from '../../UI/inventory-menu/ItemDisplay';

const itemTemplates = new Map();
itemsConfig.forEach(cfg =>{
    itemTemplates.set(cfg.key, cfg);
});

export function createItem(scene, itemSceneData){
    let item = new Item(scene, itemSceneData.x, itemSceneData.y, itemSceneData.id, itemTemplates.get(itemSceneData.type));
    item.setCollisionCategory(scene.itemsCategory);
    return item;
}

export function createItemDisplay(scene, x, y, w, h, itemKey){
    const itemData = itemTemplates.get(itemKey).displayData;
    const itemDisplay = new ItemDisplay(scene, x, y, itemData, w, h);

    return itemDisplay;
}

export function createItemBuff(itemKey){
    return itemTemplates.get(itemKey).buffData;
}