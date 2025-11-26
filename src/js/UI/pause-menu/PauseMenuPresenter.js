import { EventBus } from "../../core/event-bus.js";

export default class PauseMenuPresenter {
    constructor(view, model) {
        this.view = view;
        this.model = model;
        this.view.setPresenter(this);
        this.subscribeToViewEvents();
    }

    subscribeToViewEvents() {
        // Resume
        this.view.resumeButton.on("button-clicked", () => {
            EventBus.emit("playSound", "click");
            this.view.scene.scene.resume("GameplayScene");
            this.view.scene.scene.stop("PauseMenu");
        });

        this.view.resumeButton.on("button-hovered", () => {
            EventBus.emit("playSound", "hover");
        });

        // Main Menu 
        this.view.mainMenuButton.on("button-clicked", () => {
            EventBus.emit("playSound", "click");
            // Останавливаем паузу и геймплей, переходим в главное меню
            this.view.scene.scene.stop("PauseMenu");
            this.view.scene.scene.stop("GameplayScene");
            this.view.scene.scene.start("MainMenu");
        });

        this.view.mainMenuButton.on("button-hovered", () => {
            EventBus.emit("playSound", "hover");
        });

        // Settings
        this.view.settingsButton.on("button-clicked", () => {
             EventBus.emit('stopMusic');
            EventBus.emit("playSound", "click");
            this.view.toggleSettings();
        });
        this.view.settingsButton.on("button-hovered", () => {
            EventBus.emit("playSound", "hover");
        });

        
        // Back
        this.view.backButton.on("button-clicked", () => {
             EventBus.emit('stopMusic');
            EventBus.emit("playSound", "click");
            this.view.toggleSettings();
        });
        this.view.backButton.on("button-hovered", () => {
            EventBus.emit("playSound", "hover");
        });
    }   
}
