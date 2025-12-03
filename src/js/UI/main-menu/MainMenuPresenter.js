import { EventBus } from "../../core/event-bus.js";
import saveDataManager from "../../core/save-data-manager.js";

export default class MainMenuPresenter {
    constructor(view, model) {
        this.view = view;
        this.model = model;
        this.view.setPresenter(this);
        this.subscribeToViewEvents();
        this.setValuesFromModel();

        EventBus.emit('playMusic', 'mainMenuMusic');
    }

    subscribeToViewEvents() {
        this.view.startButton.on("button-clicked", () => {
            EventBus.emit('stopMusic');
            EventBus.emit("playSound", "click");
            this.view.scene.scene.start("GameplayScene");
        });
        this.view.startButton.on("button-hovered", () => {
            EventBus.emit("playSound", "hover");
        });
        

        this.view.musicSlider.on("slider-changed", (value) => {
            this.model.setMusicVolume(value);
        });

        this.view.sfxSlider.on("slider-changed", (value) => {
            this.model.setSFXVolume(value);
        });

        
        //Settings

        this.view.settingsButton.on("button-clicked", () => {
            EventBus.emit('stopMusic');
            EventBus.emit("playSound", "click");
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

        // Save files
        this.view.saveFile1.on("button-clicked", () => {
            EventBus.emit('stopMusic');
            EventBus.emit("playSound", "click");
            saveDataManager.changeCurrentSave(0);
        });
        this.view.saveFile1.on("button-hovered", () => {
            EventBus.emit("playSound", "hover");
        });

        this.view.saveFile2.on("button-clicked", () => {
            EventBus.emit('stopMusic');
            EventBus.emit("playSound", "click");
            this.view.scene.scene.start("GameplayScene");
            saveDataManager.changeCurrentSave(1);
        });
        this.view.saveFile2.on("button-hovered", () => {
            EventBus.emit("playSound", "hover");
        });
    }

    setValuesFromModel() {
        const musicVolume = this.model.musicVolume;
        const sfxVolume = this.model.sfxVolume;
        
        this.view.musicSlider.setValue(musicVolume);
        this.view.sfxSlider.setValue(sfxVolume);
    }
}