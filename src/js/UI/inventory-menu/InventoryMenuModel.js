import { InventoryComponent } from "../../components/InventoryComponent";

/**
 * Model for the inventory menu UI.
 * Responsible for exposing the player's inventory data to the view and forwarding actions.
 */
export default class InventoryMenuModel {
    /**
     * Create the inventory menu model.
     * @param {Phaser.GameObjects.GameObject} player - Player object.
     */
    constructor(player) {
        // Get player inventory
        this.playerInventoryComponent = player.getComponent(InventoryComponent);
        this.itemDisplayData = this.playerInventoryComponent.getInventory();
    }

    /**
     * Remove an item at the given index from both the player's inventory and the UI model.
     * @param {number} idx - Index of the item to remove.
     * @returns {void}
     */
    removeItem(idx){
        // Remove item from player's inventory (will apply buffs of said item)
        this.playerInventoryComponent.removeItem(idx);
        // Remove item from display data
        this.itemDisplayData.splice(idx, 1);
    }
}