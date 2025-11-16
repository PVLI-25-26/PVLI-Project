import itemsConfig from '../../../configs/items-config.json'
import { Item } from '../../entities/Item';

const itemTemplates = new Map();
itemsConfig.forEach(cfg =>{
    itemTemplates.set(cfg.key, cfg);
});

export function createItem(scene, itemSceneData){
    let item = new Item(scene, itemSceneData.x, itemSceneData.y, itemTemplates.get(itemSceneData.key));
    item.setCollisionCategory(scene.itemsCategory);
    return item;
}