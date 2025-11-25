/*

import { EventBus } from "../../core/event-bus.js";

export default class SettingsMenuPresenter {
    constructor(view, model) {
        this.view = view;
        this.model = model;
        this.view.setPresenter(this);
        this.subscribeToViewEvents();
        this.setValuesFromModel();

        EventBus.emit('playMusic', 'mainMenuMusic');
    }

    subscribeToViewEvents() {
        // Back
        this.view.backButton.on("button-clicked", () => {
            
            EventBus.emit("playSound", "click");
            /*
            if () //si viene del PauseMenu, lleva al PauseMenu
            {
                this.view.scene.scene.start("PauseMenu");
            }
            else if () // si viene del MainMenu, vuelve a MainMenu
            {
                this.view.scene.scene.start("MainManu");
            }
            
            this.view.scene.scene.stop("SettingsMenu");
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
}*/