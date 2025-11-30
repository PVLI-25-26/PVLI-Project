import { Button } from "../elements/button.js";
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

        this.startButton = new Button(this.scene, centerX-100, centerY-25, null, 150, 50,
            {
                text: 'Start Game',
                style: {
                    fontSize: 20,
                    color: Colors.White,
                    fontFamily: 'FableFont',
                    padding: { x: 20, y: 10 },
                }
            }
        );
        this.startButton.addInteraction((btn) => {
            btn.on("pointerover", () => {
                btn.buttonText.setColor(Colors.Red);
                btn.invokeHover();
            });
            btn.on("pointerout", () => {
                btn.buttonText.setColor(Colors.White);
            });
            btn.on("pointerdown", () => {
                btn.invokeClick();
            });
        });

        this.settingsButton = new Button(this.scene, screenLeft, screenTop, null, 32,32,
            null,
            {
                texture: 'settingsIcon',
                frame: 0,
                leftWidth: 0,
                rightWidth: 0,
                topHeight: 0,
                bottomHeight: 1
            }
        )
        this.settingsButton.addInteraction((btn) => {
            btn.on("pointerover", () => {
                this.scene.tweens.add({
                    targets: this.settingsButton.buttonNineslice,
                    angle: 90,
                    duration: 100,
                    repeat: 0
                });
                this.settingsButton.buttonNineslice.setFrame(1);
                btn.invokeHover();
            });
            btn.on("pointerout", () => {
                this.scene.tweens.add({
                    targets: this.settingsButton.buttonNineslice,
                    angle: 0,
                    duration: 100,
                    repeat: 0
                });
                this.settingsButton.buttonNineslice.setFrame(0);
            });
            btn.on("pointerdown", () => {
                this.toggleSettings();
                btn.invokeClick();
            });
        });

        // Go back to main menu button
        this.backButton = new Button(this.scene, screenLeft, screenTop, null, 32, 32,
            null,
            {
                texture: 'settingsIcon',
                frame: 2,
                leftWidth: 0,
                rightWidth: 0,
                topHeight: 0,
                bottomHeight: 1
            }
        )
        this.backButton.addInteraction((btn) => {
            btn.on("pointerover", () => {
                this.backButton.buttonNineslice.setFrame(3);
                btn.invokeHover();
            });
            btn.on("pointerout", () => {
                this.backButton.buttonNineslice.setFrame(2);
            });
            btn.on("pointerdown", () => {
                btn.invokeClick();
            });
        });
        this.backButton.setActive(false);
        this.backButton.setVisible(false);
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

        this.musicIcon.setScale(3);
        this.sfxIcon.setScale(3);

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