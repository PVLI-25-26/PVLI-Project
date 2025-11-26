import { Button } from "../elements/button.js";
import { Slider } from "../elements/slider.js";
import Colors from "../../../configs/color-config.json"
import { ButtonIcon } from "../elements/iconButton.js";

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
        this.createSliders();
        this.createIcons();
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


        // Settings
        this.settingsButton = new Button(this.scene, centerX, centerY + 160,"Settings","FableFont",Colors.White,20);
        this.settingsButton.addInteraction((btn) => {
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
        this.settingsButton.setAlpha(0);
        this.elements.push(this.settingsButton);

        //Go Back from settings to MainMenu
        this.backButton = new ButtonIcon(this.scene, screenLeft+50, screenTop+50, 'arrow', 1);
        this.backButton.setFrame(1);
        this.backButton.setActive(false);
        this.backButton.setVisible(false);
        this.backButton.addInteraction((btn) => {
            btn.on("pointerover", () => {

                this.backButton.setFrame(0);
                btn.invokeHover();          
            });
           btn.on("pointerout", () => {
                 btn.setFrame(1);
            });
            btn.on("pointerdown", () => {
   
                btn.invokeClick();
                  
            });
        });

        this.resumeButton.setActive(true);
        this.resumeButton.setVisible(true);

        this.mainMenuButton.setActive(true);
        this.mainMenuButton.setVisible(true);

        this.settingsButton.setActive(true);
        this.settingsButton.setVisible(true);
   }

    createSliders() {
        this.musicSlider = new Slider(this.scene,  400, 350, 300, 20, 0.5);
        this.sfxSlider = new Slider(this.scene, 400, 250, 300, 20, 0.5);
        
        this.sfxSlider.setVisible(false);
        this.sfxSlider.setActive(false);
        this.musicSlider.setVisible(false);
        this.musicSlider.setActive(false);
    }
    createIcons() {
        
        this.musicIcon = this.scene.add.image(215, 250, 'musicIcon').setOrigin(0.5);
        this.sfxIcon = this.scene.add.image(215, 350, 'sfxIcon').setOrigin(0.5);

        this.musicIcon.setScale(0.12);
        this.sfxIcon.setScale(0.08);

        this.musicIcon.setVisible(false);
        this.musicIcon.setActive(false);
        this.sfxIcon.setVisible(false);
        this.sfxIcon.setActive(false);
    }
       toggleSettings(){

        this.backButton.setActive(!this.backButton.active);
        this.backButton.setVisible(!this.backButton.visible);

        this.musicSlider.setActive(!this.musicSlider.active);
        this.sfxSlider.setActive(!this.sfxSlider.active);
        this.musicIcon.setActive(!this.musicIcon.active);
        this.sfxIcon.setActive(!this.sfxIcon.active);

        this.musicSlider.setVisible(!this.musicSlider.visible);
        this.sfxSlider.setVisible(!this.sfxSlider.visible);
        this.musicIcon.setVisible(!this.musicIcon.visible);
        this.sfxIcon.setVisible(!this.sfxIcon.visible);

        this.resumeButton.setActive(!this.resumeButton.active);
        this.resumeButton.setVisible(!this.resumeButton.visible);

        this.mainMenuButton.setActive(!this.mainMenuButton.active);
        this.mainMenuButton.setVisible(!this.mainMenuButton.visible);

        this.settingsButton.setActive(!this.settingsButton.active);
        this.settingsButton.setVisible(!this.settingsButton.visible);
        
    }
}




   