import { InventoryComponent } from "../../components/InventoryComponent";

export default class InventoryMenuModel {
    constructor(player) {
        this.playerInventoryComponent = player.getComponent(InventoryComponent);
        this.itemDisplayData = this.playerInventoryComponent.getInventory();
    }

    removeItem(idx){
        this.playerInventoryComponent.removeItem(idx);
        this.itemDisplayData.splice(idx, 1);
    }
}