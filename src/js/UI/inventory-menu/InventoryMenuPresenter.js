import { EventBus } from "../../core/event-bus";

/**
 * Presenter for the inventory menu view.
 * Responsible for wiring view events to model actions and emitting global events (sounds, scene control).
 */
export default class InventoryMenuPresenter {
    /**
     * Create a presenter for the inventory menu.
     * @param {InventoryMenuView} view - Inventory UI view instance.
     * @param {InventoryMenuModel} model - Inventory UI model instance.
     */
    constructor(view, model) {
        this.view = view;
        this.model = model;
        this.view.setPresenter(this);
        // Give view values in model
        this.resetViewValuesFromModel();
        this.subscribeToViewEvents();
    }

    /**
     * Subscribe to view events and forward actions to the model or global EventBus.
     * @returns {void}
     */
    subscribeToViewEvents() {
        // Exit button clicked
        this.view.exitButton.on("button-clicked", () => {
            this.view.scene.scene.resume("GameplayScene");
            this.view.scene.scene.stop("InventoryMenu");
            EventBus.emit("playSound", "click");
        });

        // Exit button hovered
        this.view.exitButton.on("button-hovered", () => {
            EventBus.emit("playSound", "hover");
        });

        // Item consumed (removed)
        this.view.itemDisplayListContainer.on("itemConsumed", (idx)=>{
            this.model.removeItem(idx);
        })
    }

    /**
     * Populate the view using the current model data.
     * @returns {void}
     */
    resetViewValuesFromModel(){
        this.view.resetInventoryList(this.model.itemDisplayData);
    }
}