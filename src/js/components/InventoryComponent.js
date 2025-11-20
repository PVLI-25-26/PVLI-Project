import { BaseComponent } from "../core/base-component";
import { EventBus } from "../core/event-bus";
import { createItemBuff } from "../core/factories/item-factory";

/**
 * Component that manages a simple player inventory (list of item keys).
 *
 * Inventory items are represented as item keys (string) values.
 *
 * @extends {BaseComponent}
 */
export class InventoryComponent extends BaseComponent{
    /**
     * Internal array holding item keys in the player's inventory.
     * @type {Array<ItemKey>}
     * @private
     */
    #playerInventory;

    /**
     * Create an InventoryComponent.
     * @param {Phaser.GameObjects.GameObject} gameObject - Owner game object (player).
     */
    constructor(gameObject){
        super(gameObject);
        // Create inventory (array of item keys)
        this.#playerInventory = [];
        // Wire item picked events to add item to inventory
        EventBus.on('itemPicked', (picker, item)=>{
            if(this.gameObject === picker) this.addItemToInventory(item.key);
        });
    }

    update(t, dt){}

    /**
     * Add an item key to the player's inventory.
     * @param {ItemKey} itemKey - Identifier key of the item to add.
     * @returns {void}
     */
    addItemToInventory(itemKey){
        this.#playerInventory.push(itemKey);
    }

    /**
     * Get the inventory array.
     * Note: returns the internal array reference (shallow). Consumers should treat it as read-only or clone it.
     * @returns {Array<ItemKey>} Array of item keys currently in inventory.
     */
    getInventory(){
        return this.#playerInventory;
    }

    /**
     * Remove an item at the given index from the player's inventory.
     * If the item has an associated buff payload (via createItemBuff), emit a 'buffApplied' event on the owner.
     *
     * @param {number} idx - Index of the item to remove.
     * @returns {void}
     */
    removeItem(idx){
        // Get item buff data
        const itemBuffData = createItemBuff(this.#playerInventory[idx]);
        // If item has buff associated, apply the buff
        if(itemBuffData){
            this.gameObject.emit('buffApplied', itemBuffData);
        }
        // Remove item from array
        this.#playerInventory.splice(idx, 1);
    }
}