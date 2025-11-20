import { InventoryComponent } from "../../components/InventoryComponent";

export default class InventoryMenuModel {
    constructor(player) {
        this.itemDisplayData = player.getComponent(InventoryComponent).getInventory();
    }

    removeItem(idx){
        this.itemDisplayData.splice(idx, 1);
    }
}