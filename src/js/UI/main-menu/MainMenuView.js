import { Button } from "../elements/button.js";
import { ButtonIcon } from "../elements/iconButton.js";
import { Slider } from "../elements/slider.js";
import Colors from "../../../configs/color-config.json"

export default class MainMenuView {
    constructor(scene) {
        this.scene = scene;
        this.startButton = null;
        this.musicSlider = null;
        this.sfxSlider = null;
        
        this.createElements();
    }

    setPresenter(presenter) {
        this.presenter = presenter;
    }

    createElements() {
        this.createButtons();
        this.createIcons();
        this.createSliders();
    }

    createButtons() {
        const centerX = this.scene.scale.width / 2;
        const centerY = this.scene.scale.height / 2;

        this.startButton = new Button(this.scene, centerX, centerY, "Start Game", "FableFont",Colors.White,20,"center");
        this.startButton.addInteraction((btn) => {
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

        this.settingsButton = new ButtonIcon(this.scene, screenLeft+50, screenTop+50, 'settingsIcon', 1);
        this.settingsButton.setFrame(0);
        this.settingsButton.addInteraction((btn) => {
            btn.on("pointerover", () => {

                this.scene.tweens.add({
                    targets: this.settingsButton,
                    angle: 90,
                    duration: 100,
                    repeat: 0
                });
                this.settingsButton.setFrame(1);
                btn.invokeHover();          
            });
            btn.on("pointerout", () => {
                
                this.scene.tweens.add({
                    targets: this.settingsButton,
                    angle: 0,
                    duration: 100,
                    repeat: 0
                });
                this.settingsButton.setFrame(0);
            });
            btn.on("pointerdown", () => {
                
                this.scene.tweens.add({
                    targets: this.settingsButton,
                    angle: 120,
                    duration: 100,
                    yoyo: true
                });
                this.toggleSettings();
                btn.invokeClick();

            });
        });

         //Go Back from settings to MainMenu
        this.backButton = new ButtonIcon(this.scene, screenLeft+50, screenTop+50, 'settingsIcon', 1);
        this.backButton.setFrame(2);
        this.backButton.setActive(false);
        this.backButton.setVisible(false);
        this.backButton.addInteraction((btn) => {
            btn.on("pointerover", () => {

                this.backButton.setFrame(3);
                btn.invokeHover();          
            });
           btn.on("pointerout", () => {
                 btn.setFrame(2);
            });
            btn.on("pointerdown", () => {
                btn.invokeClick();  
            });
        });
        this.backButton.setActive(false);
        this.backButton.setVisible(false);

    }

    createSliders() {
        this.musicSlider = new Slider(this.scene, 400, 350, 300, 20, 0.5);
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
        this.musicSlider.setActive(!this.musicSlider.active);
        this.sfxSlider.setActive(!this.sfxSlider.active);
        this.musicIcon.setActive(!this.musicIcon.active);
        this.sfxIcon.setActive(!this.sfxIcon.active);

        this.musicSlider.setVisible(!this.musicSlider.visible);
        this.sfxSlider.setVisible(!this.sfxSlider.visible);
        this.musicIcon.setVisible(!this.musicIcon.visible);
        this.sfxIcon.setVisible(!this.sfxIcon.visible);


        this.startButton.setActive(!this.startButton.active);
        this.startButton.setVisible(!this.startButton.visible);

        this.backButton.setActive(!this.backButton.active);
        this.backButton.setVisible(!this.backButton.visible);

        this.settingsButton.setActive(!this.settingsButton.active);
        this.settingsButton.setVisible(!this.settingsButton.visible);
        
    }
} 