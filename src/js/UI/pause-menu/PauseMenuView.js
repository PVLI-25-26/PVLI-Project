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
        this.createSliders();
        this.createIcons();
    }

    createButtons() {
        const centerX = this.scene.scale.width / 2;
        const centerY = this.scene.scale.height / 2 - 50;

        // Resume
        this.resumeButton = new Button(this.scene, centerX-100, centerY-80, null, 150, 50,
            {
                text: 'Resume',
                style: {
                    fontSize: 20,
                    color: Colors.White,
                    fontFamily: 'FableFont',
                    padding: { x: 20, y: 10 },
                }
            }
        );
        this.resumeButton.addInteraction((btn) => {
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
        
        // MainMenu
        this.mainMenuButton = new Button(this.scene, centerX-100, centerY+80, null, 150, 50,
            {
                text: 'Main Menu',
                style: {
                    fontSize: 20,
                    color: Colors.White,
                    fontFamily: 'FableFont',
                    padding: { x: 20, y: 10 },
                }
            }
        );
        this.mainMenuButton.addInteraction((btn) => {
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
        this.mainMenuButton.setAlpha(0);
        this.elements.push(this.mainMenuButton);


        // Settings
        this.settingsButton = new Button(this.scene, centerX-100, centerY, null, 150, 50,
            {
                text: 'Settings',
                style: {
                    fontSize: 20,
                    color: Colors.White,
                    fontFamily: 'FableFont',
                    padding: { x: 20, y: 10 },
                }
            }
        );
        this.settingsButton.addInteraction((btn) => {
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
        this.settingsButton.setAlpha(0);
        this.elements.push(this.settingsButton);

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
        );
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

        this.musicIcon.setScale(3);
        this.sfxIcon.setScale(3);

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




   