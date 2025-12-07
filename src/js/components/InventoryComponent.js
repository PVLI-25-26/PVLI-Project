import { BaseComponent } from "../core/base-component";
import { EventBus } from "../core/event-bus";
import { createItemBuff, getItemGold } from "../core/factories/item-factory";

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
     * Amount of gold the player has.
     * @type {Number}
     * @private
     */
    #gold;
    /**
     * Create an InventoryComponent.
     * @param {Phaser.GameObjects.GameObject} gameObject - Owner game object (player).
     */
    constructor(gameObject, inventory, gold){
        super(gameObject);
        // Create inventory (array of item keys)
        this.#playerInventory = inventory || [];
        // Set player gold
        this.#gold = gold || 0;
        EventBus.emit('playerGoldInitialized', this.#gold);

        // Wire item picked events to add item to inventory
        EventBus.on('itemPicked', (picker, item)=>{
            if(this.gameObject === picker) this.addItemToInventory(item.key);
        });
        // When hub reached convert all player items into gold
        EventBus.on('hubReached', ()=>{
            if(this.#playerInventory.length > 0){
                let totalGold = 0;
                for(let item of this.#playerInventory){
                    totalGold += getItemGold(item);
                }
                this.addGold(totalGold);
                this.#playerInventory = [];
            }
        }, this);
        EventBus.on('removeGold', this.removeGold, this);
        EventBus.on('addGold', this.addGold, this);

        // For each item player can buy, check if there is enought gold, if there is, equip the item        
        EventBus.on('abilityBought', (ability)=>{
            if(ability.gold <= this.#gold){
                this.removeGold(ability.gold);
                EventBus.emit('abilityEquipped', ability);
            }
            else{
                console.log('not enought coins')
            }
        });
        EventBus.on('arrowBought', (arrow)=>{
            if(arrow.gold <= this.#gold){
                this.removeGold(arrow.gold);
                EventBus.emit('arrowEquipped', arrow);
            }
            else{
                console.log('not enought coins')
            }
        });
        EventBus.on('trajectoryBought', (trajectory)=>{
            if(trajectory.gold <= this.#gold){
                this.removeGold(trajectory.gold);
                EventBus.emit('trajectoryEquipped', trajectory);
            }
            else{
                console.log('not enought coins')
            }
        })
        this.gameObject.scene.input.keyboard.on('keydown-M', ()=>{this.addGold(50);});
        this.gameObject.scene.input.keyboard.on('keydown-N', ()=>{this.removeGold(50);});
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
     * Get the amount of gold.
     * @returns {Number} Amount of gold.
     */
    getGold(){
        return this.#gold;
    }

    /**
     * Remove gold from player. WIll neve set negative values for gold.
     * @param {Number} amount amount to remove
     */
    removeGold(amount){
        this.#gold -= amount;
        if(this.#gold < 0) this.#gold = 0;
        EventBus.emit('playerGoldChanged', this.#gold);
    }

    /**
     * Add gold to player. Will neve set negative values for gold.
     * @param {Number} amount amount to add
     */
    addGold(amount){
        this.#gold += amount;
        if(this.#gold < 0) this.#gold = 0;
        EventBus.emit('playerGoldChanged', this.#gold);
    }

    /**
     * Remove an item at the given index from the player's inventory.
     * If the item has an associated buff payload (via createItemBuff), emit a 'buffApplied' event on the owner.
     *
     * @param {number} idx - Index of the item to remove.
     * @returns {void}
     */
    removeItem(idx){
        EventBus.emit('itemConsumed', this.#playerInventory[idx]);
        // Get item buff data
        const itemBuffData = createItemBuff(this.#playerInventory[idx]);
        // If item has buff associated, apply the buff
        if(itemBuffData){
            this.gameObject.emit('buffApplied', itemBuffData);
        }

        // Remove item from array
        this.#playerInventory.splice(idx, 1);
    }

    clearInventory(){
        this.#playerInventory = [];
    }
}