/*

import { Button } from "../elements/button.js";
import { Slider } from "../elements/slider.js";
export default class SettingsMenuView {
    constructor(scene) {
        this.scene = scene;
        this.backButton = null;
        this.mainMenuButton = null;
        this.elements = [];

        this.createElements();
    }

    setPresenter(presenter) {
        this.presenter = presenter;
    }

    createElements() {
        this.createButtons();
         this.createSliders();
         this.createIcons();
    }

    createButtons() {
        const centerX = this.scene.scale.width / 2;
        const centerY = this.scene.scale.height / 2 - 50;

        // Resume
        this.backButton = new Button(this.scene, screenLeftX, topY, "Go Back");
        this.backButton.addInteraction((btn) => {
            btn.on("pointerover", () => {
                btn.setColor("#ffffffff");
                btn.invokeHover();
            });
            btn.on("pointerout", () => {
                btn.setColor("#b2b2b2ff");
            });
            btn.on("pointerdown", () => {
                btn.invokeClick();
            });
        });
        this.backButton.setAlpha(0);
        this.elements.push(this.backButton);
    }
    createSliders() {
        this.musicSlider = new Slider(this.scene, 250, 550, 300, 20, 0.5);
        this.sfxSlider = new Slider(this.scene, 250, 500, 300, 20, 0.5);
    }

    createIcons() {
        this.musicIcon = this.scene.add.image(65, 550, 'musicIcon').setOrigin(0.5);
        this.sfxIcon = this.scene.add.image(65, 500, 'sfxIcon').setOrigin(0.5);

        this.musicIcon.setScale(0.12);
        this.sfxIcon.setScale(0.08);
    }
}*/