import { EventBus } from "../../core/event-bus";

export default class InventoryMenuPresenter {
    constructor(view, model) {
        this.view = view;
        this.model = model;
        this.view.setPresenter(this);
        this.resetViewValuesFromModel();
        this.subscribeToViewEvents();
    }

    subscribeToViewEvents() {
        this.view.exitButton.on("button-clicked", () => {
            this.view.scene.scene.resume("GameplayScene");
            this.view.scene.scene.stop("InventoryMenu");
            EventBus.emit("playSound", "click");
        });
        this.view.exitButton.on("button-hovered", () => {
            EventBus.emit("playSound", "hover");
        });

        this.view.itemDisplayListContainer.on("itemConsumed", (idx)=>{
            this.model.removeItem(idx);
        })
    }

    resetViewValuesFromModel(){
        this.view.resetInventoryList(this.model.itemDisplayData);
    }
}