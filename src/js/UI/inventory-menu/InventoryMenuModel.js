import dungeon from "../../core/dungeon";

export default class InventoryMenuModel {
    constructor() {
        this.itemDisplayData = dungeon.playerInventory;
    }

    removeItem(idx){
        this.itemDisplayData.splice(idx, 1);
    }
}