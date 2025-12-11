import { EventBus } from "../../core/event-bus.js";

export default class PauseMenuPresenter {
    constructor(view, model) {
        this.view = view;
        this.model = model;
        this.view.setPresenter(this);
        this.subscribeToViewEvents();
        this.setValuesFromModel();
    }

    subscribeToViewEvents() {
        // Resume
        this.view.resumeButton.on("button-clicked", () => {
            EventBus.emit("playSound", "click");
            EventBus.emit("playSound", "pauseOff");
            this.view.scene.scene.resume("GameplayScene");
            this.view.scene.scene.stop("PauseMenu");
        });

        this.view.resumeButton.on("button-hovered", () => {
            EventBus.emit("playSound", "hover");
        });

        // Main Menu 
        this.view.mainMenuButton.on("button-clicked", () => {
            EventBus.emit("playSound", "return");
            // Notify when the player exits the game (scene onDestroy event is not enough because every room change destroys the previous room scene)
            EventBus.emit("gameExited");
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
            EventBus.emit("playSound", "return");
            this.view.toggleSettings();
        });
        this.view.backButton.on("button-hovered", () => {
            EventBus.emit("playSound", "hover");
        });

        this.view.musicSlider.on("slider-changed", (value) => {
            this.model.setMusicVolume(value);
        });

        this.view.sfxSlider.on("slider-changed", (value) => {  
            this.model.setSFXVolume(value);
        });
    }   
    

    setValuesFromModel() {
        const musicVolume = this.model.musicVolume;
        const sfxVolume = this.model.sfxVolume;
        
        this.view.musicSlider.setValue(musicVolume);
        this.view.sfxSlider.setValue(sfxVolume);
    }
}
