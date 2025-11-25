import { Button } from "../elements/button.js";
import { Slider } from "../elements/slider.js";
import Colors from "../../../configs/color-config.json"

export default class PauseMenuView {
    constructor(scene) {
        this.scene = scene;
        this.resumeButton = null;
        this.mainMenuButton = null;
        this.elements = [];

        this.createElements();
    }

    setPresenter(presenter) {
        this.presenter = presenter;
    }

    createElements() {
        this.createButtons();

    }

    createButtons() {
        const centerX = this.scene.scale.width / 2;
        const centerY = this.scene.scale.height / 2 - 50;

        // Resume
        this.resumeButton = new Button(this.scene, centerX, centerY, "Resume","FableFont",Colors.White,20);
        this.resumeButton.addInteraction((btn) => {
            btn.on("pointerover", () => {
                btn.setColor(Colors.Red);
                btn.invokeHover();
            });
            btn.on("pointerout", () => {
                btn.setColor(Colors.White);
            });
            btn.on("pointerdown", () => {
                btn.invokeClick();
            });
        });
        this.resumeButton.setAlpha(0);
        this.elements.push(this.resumeButton);
        
        // MainMenu
        this.mainMenuButton = new Button(this.scene, centerX, centerY + 80, "Main Menu","FableFont",Colors.White,20);
        this.mainMenuButton.addInteraction((btn) => {
            btn.on("pointerover", () => {
                btn.setColor(Colors.Red);
                btn.invokeHover();
            });
            btn.on("pointerout", () => {
                btn.setColor(Colors.White);
            });
            btn.on("pointerdown", () => {
                btn.invokeClick();
            });
        });
        this.mainMenuButton.setAlpha(0);
        this.elements.push(this.mainMenuButton);
   }

}




   