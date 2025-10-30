import { EventBus } from "../../core/event-bus.js";

export default class PauseMenuPresenter {
    constructor(view, model) {
        this.view = view;
        this.model = model;
        this.view.setPresenter(this);
        this.subscribeToViewEvents();
    }

    subscribeToViewEvents() {
        this.view.resumeButton.on("button-clicked", () => {
            EventBus.emit("playSound", "click");
            this.view.scene.scene.resume("GameplayScene");
            this.view.scene.scene.stop("PauseMenu");
        });

        this.view.resumeButton.on("button-hovered", () => {
            EventBus.emit("playSound", "hover");
        });
    }
}
