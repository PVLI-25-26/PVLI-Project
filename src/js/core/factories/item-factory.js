import ballConfig from '../../../configs/Items/ball-config.json'
import goldenCupConfig from '../../../configs/Items/golden-cup-config.json'
import keyConfig from '../../../configs/Items/key-config.json'
import quesoConfig from '../../../configs/Items/queso-config.json'
import redVialConfig from '../../../configs/Items/red-vial-config.json'
import healthFlowerConfig from '../../../configs/Items/health-flower-config.json'
import speedVaseConfig from '../../../configs/Items/speed-vase-config.json'
import damageRockConfig from '../../../configs/Items/damage-rock.json'
import { Item } from '../../entities/Item';
import { ItemDisplay } from '../../UI/inventory-menu/ItemDisplay';

const ITEM_CONFIGS ={
    "ball": ballConfig,
    "golden-cup": goldenCupConfig,
    "key": keyConfig,
    "queso": quesoConfig,
    "red-vial": redVialConfig,
    "health-flower": healthFlowerConfig,
    "speed-vase": speedVaseConfig,
    "damage-rock": damageRockConfig,
}

/**
 * Key that identifies an item type and its level.
 * @typedef {Object} ItemKey
 * @property {string} type - Item type key (matches keys of ITEM_CONFIGS).
 * @property {number} level - Item level index within the type's config array.
 */
export class ItemKey{
    /**
     * Item type (matches keys of ITEM_CONFIGS).
     * @type {string}
     */
    type;
    /**
     * Item level index within the type's config array.
     * @type {number}
     */
    level;
    /**
     * Create an ItemKey instance.
     * @param {string} type - Item type key.
     * @param {number} level - Item level index.
     */
    constructor(type, level){
        this.type=type; 
        this.level=level;
    }
}

/**
 * Get the configuration object for a given item key instance.
 *
 * @param {ItemKey} itemKey - ItemKey instance identifying type and level.
 * @returns {Object} The item configuration object for the requested type/level.
 */
function getItemConfig(itemKey) {
    const itemsOfType = ITEM_CONFIGS[itemKey.type];
    const itemConfig = itemsOfType[itemKey.level];
    return itemConfig;
}

/**
 * Clamp a requested item level to the available range for a given item type.
 *
 * @param {string} itemType - Item type key (one of the keys in ITEM_CONFIGS).
 * @param {number} level - Requested level index.
 * @returns {number} Clamped level index (never less than 0, never greater than last available index).
 */
function clampItemLevel(itemKey, level) {
    return (level < ITEM_CONFIGS[itemKey].length ? level : ITEM_CONFIGS[itemKey].length - 1);
}

/**
 * Create an Item entity for the scene using scene data.
 *
 * @param {Phaser.Scene} scene - Phaser scene where the item will be created.
 * @param {Object} itemSceneData - Data from the level describing the item (must include type, x, y, id).
 * @param {number} roomsExplored - Number of rooms explored (used to randomize item level).
 * @returns {Item} The created Item entity.
 */
export function createItem(scene, itemSceneData, roomsExplored){
    // get random item level depending on rooms explored
    const randomItemLevel = Math.round(Math.random() * (roomsExplored-1));
    // get item key
    const itemKey = new ItemKey(itemSceneData.type, clampItemLevel(itemSceneData.type, randomItemLevel));
    // get item config from item key
    const itemConfig = getItemConfig(itemKey);
    itemConfig.key = itemKey;
    // create item
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

/**
 * Create a UI ItemDisplay for the given item key.
 *
 * @param {Phaser.Scene} scene - Scene to attach the display to.
 * @param {number} x - X position.
 * @param {number} y - Y position.
 * @param {number} w - Width of the display.
 * @param {number} h - Height of the display.
 * @param {ItemKey} itemKey - ItemKey identifying which item to display.
 * @returns {ItemDisplay} The constructed ItemDisplay instance.
 */
export function createItemDisplay(scene, x, y, w, h, itemKey){
    const itemConfig = getItemConfig(itemKey);
    // Add to the display data, the gold value of the item
    itemConfig.displayData.gold = itemConfig.gold;
    const itemDisplay = new ItemDisplay(scene, x, y, itemConfig.displayData, w, h);

    return itemDisplay;
}

/**
 * Return the buff data associated with an item key.
 *
 * @param {ItemKey} itemKey - ItemKey identifying the item.
 * @returns {Object|undefined} Buff data object or undefined if none.
 */
export function createItemBuff(itemKey){
    const itemConfig = getItemConfig(itemKey);
    return itemConfig.buffData;
}

/**
 * Get the gold value of an item.
 *
 * @param {ItemKey} itemKey - ItemKey identifying the item.
 * @returns {number} Gold value for the item.
 */
export function getItemGold(itemKey){
    return getItemConfig(itemKey).gold;
}