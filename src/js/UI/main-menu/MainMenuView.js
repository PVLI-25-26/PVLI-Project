import { Button } from "../elements/button.js";
import { Slider } from "../elements/slider.js";
import Colors from "../../../configs/colors-config.js"

export default class MainMenuView {
    constructor(scene) {
        this.scene = scene;
        this.playButton = null;
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

        this.playButton = new Button(this.scene, centerX-100, centerY-25, null, 150, 50,
            {
                text: 'Play',
                style: {
                    fontSize: 20,
                    color: Colors.White,
                    fontFamily: 'FableFont',
                    padding: { x: 20, y: 10 },
                }
            }
        );
        this.playButton.addInteraction((btn) => {
            btn.on("pointerover", () => {
                btn.buttonText.setColor(Colors.Red);
                btn.invokeHover();
            });
            btn.on("pointerout", () => {
                btn.buttonText.setColor(Colors.White);
            });
            btn.on("pointerdown", () => {
                btn.invokeClick();
                this.toggleLoadGame();
            });
        });

        //Game Slots Button

        this.gameSlot = [];
        let yOffset = 0;
        for (let i = 0; i < 3; i++) 
        {
            this.gameSlot.push(new Button(this.scene, centerX-100, centerY-120+yOffset, null, 150, 50, {
                text: localStorage.getItem(i) == null ? 'New Game' : 'Play Game ' + (i + 1),
                style: {
                    fontSize: 20,
                    color: Colors.White,
                    fontFamily: 'FableFont',
                    padding: {x:20, y: 10}
                }
            }))
            this.gameSlot[i].addInteraction((btn) => 
            {
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
            })
            
            this.gameSlot[i].setActive(false);
            this.gameSlot[i].setVisible(false);

            yOffset+=100;
        }

        //Delete data buttons

        this.deleteGame = [];

        for(let i = 0; i < this.gameSlot.length; i++)
        {
            this.deleteGame.push(new Button(this.scene, centerX+130, this.gameSlot[i].y, null, 20, 20,
            {
                text: 'X',
                style: {
                    fontSize: 10,
                    color: Colors.White,
                    fontFamily: 'FableFont',
                    padding: { x: 5, y: 5 },
                }
            },
            {
                texture: "UIbackground",
                frame: 0,
                leftWidth: 3,
                rightWidth: 3,
                topHeight: 3,
                bottomHeight: 3
            }
        ).setScale(2)
        );

        this.deleteGame[i].addInteraction((btn) => {
            btn.on("pointerover", () => {
                btn.buttonText.setColor(Colors.Red);
                btn.invokeHover();
            });
            btn.on("pointerout", () => {
                btn.buttonText.setColor(Colors.White);
            });
            btn.on("pointerdown", () => {
                btn.invokeClick();
                this.toggleSlotOptions(i);
                this.gameSlot[i].buttonText.setText('New Game');
            });
        });

        this.deleteGame[i].setActive(false);
        this.deleteGame[i].setVisible(false);

        }
    
        //Save Game Document Buttons
        this.saveGame = [];
        for(let i = 0; i < this.gameSlot.length; i++)
        {
            this.saveGame.push(new Button(this.scene, centerX+80, this.gameSlot[i].y, null, 20, 20, null,
                // {
                //     text: 'Save',
                //     style: {
                //         fontSize: 10,
                //         color: Colors.White,
                //         fontFamily: 'FableFont',
                //         padding: { x: 5, y: 5 },
                //     }
                // },
                {
                    texture: "saveIcon",
                    frame: 0,
                    leftWidth: 0,
                    rightWidth: 0,
                    topHeight: 0,
                    bottomHeight: 1
                }
            ).setScale(2))
        
            this.saveGame[i].addInteraction((btn) => {
                btn.on("pointerover", () => {
                    btn.buttonNineslice.setTint(Colors.RedHex);
                    btn.invokeHover();
                });
                btn.on("pointerout", () => {
                    btn.buttonNineslice.setTint(0xFFFFFF);
                });
                btn.on("pointerdown", () => {
                    btn.invokeClick();
                });

                this.saveGame[i].setActive(false);
                this.saveGame[i].setVisible(false);
            });
        }
        //Load File Button
        this.loadGameFile = [];
        for(let i = 0; i < this.gameSlot.length; i++)
        {
            this.loadGameFile.push(new Button(this.scene, centerX+80, this.gameSlot[i].y, null, 20, 20, null,
                // {
                //     text: 'LoadFile',
                //     style: {
                //         fontSize: 10,
                //         color: Colors.White,
                //         fontFamily: 'FableFont',
                //         padding: { x: 5, y: 5 },
                //     }
                // },
                {
                    texture: "saveIcon",
                    frame: 0,
                    leftWidth: 0,
                    rightWidth: 0,
                    topHeight: 0,
                    bottomHeight: 1
                }
            ).setScale(2))
        
            this.loadGameFile[i].addInteraction((btn) => {
                btn.on("pointerover", () => {
                    btn.buttonNineslice.setTint(Colors.RedHex);
                    btn.invokeHover();
                });
                btn.on("pointerout", () => {
                    btn.buttonNineslice.setTint(0xFFFFFF);
                });
                btn.on("pointerdown", () => {
                    btn.invokeClick();
                    
                });

                this.loadGameFile[i].setActive(false);
                this.loadGameFile[i].setVisible(false);
            });
        }


        //Settings Icon

        this.settingsButton = new Button(this.scene, screenLeft+25, screenTop+25, null, 32,32,
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

        // Go back to main menu from settings button
        this.backButton = new Button(this.scene, screenLeft+25, screenTop+25, null, 32, 32,
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


        //Volver a menu desde Load Games
        this.GoMenuButton = new Button(this.scene, screenLeft+25, screenTop+25, null, 32, 32,
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
        this.GoMenuButton.addInteraction((btn) => {
            btn.on("pointerover", () => {
                this.GoMenuButton.buttonNineslice.setFrame(3);
                btn.invokeHover();
            });
            btn.on("pointerout", () => {
                this.GoMenuButton.buttonNineslice.setFrame(2);
            });
            btn.on("pointerdown", () => {
                btn.invokeClick();
            });
        });
        this.GoMenuButton.setActive(false);
        this.GoMenuButton.setVisible(false);

    }

    createSliders() {
        this.musicSlider = new Slider(this.scene, 400, 250, 300, 20, 0.5);
        this.sfxSlider = new Slider(this.scene, 400, 350, 300, 20, 0.5);
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


        this.playButton.setActive(!this.playButton.active);
        this.playButton.setVisible(!this.playButton.visible);

        this.backButton.setActive(!this.backButton.active);
        this.backButton.setVisible(!this.backButton.visible);

        this.settingsButton.setActive(!this.settingsButton.active);
        this.settingsButton.setVisible(!this.settingsButton.visible);
        
    }
    toggleSlotOptions(slotNum){

        this.deleteGame[slotNum].setActive(!this.deleteGame[slotNum].active);
        this.deleteGame[slotNum].setVisible(!this.deleteGame[slotNum].visible);

        this.loadGameFile[slotNum].setActive(!this.loadGameFile[slotNum].active);
        this.loadGameFile[slotNum].setVisible(!this.loadGameFile[slotNum].visible);

        this.saveGame[slotNum].setActive(!this.saveGame[slotNum].active);
        this.saveGame[slotNum].setVisible(!this.saveGame[slotNum].visible);
    }

    toggleLoadGame(){
        this.GoMenuButton.setActive(!this.GoMenuButton.active);
        this.GoMenuButton.setVisible(!this.GoMenuButton.visible);

        this.settingsButton.setActive(!this.settingsButton.active);
        this.settingsButton.setVisible(!this.settingsButton.visible);

        this.playButton.setActive(!this.playButton.active);
        this.playButton.setVisible(!this.playButton.visible);


        for(let i = 0 ; i< this.gameSlot.length ;i++){

            this.gameSlot[i].setActive(!this.gameSlot[i].active);
            this.gameSlot[i].setVisible(!this.gameSlot[i].visible);

            if (localStorage.getItem(i) != null && this.gameSlot[i].active){
                this.deleteGame[i].setActive(true);
                this.deleteGame[i].setVisible(true);

                this.deleteGame[i].setActive(false);
                this.loadGameFile[i].setVisible(false);

                this.saveGame[i].setActive(true);
                this.saveGame[i].setVisible(true);                
            }
            else if(localStorage.getItem(i) == null && this.gameSlot[i].active){
                this.deleteGame[i].setActive(false);
                this.deleteGame[i].setVisible(false);

                this.deleteGame[i].setActive(true);
                this.loadGameFile[i].setVisible(true);

                this.saveGame[i].setActive(false);
                this.saveGame[i].setVisible(false);
            }
            else{
                this.deleteGame[i].setActive(false);
                this.deleteGame[i].setVisible(false);

                this.deleteGame[i].setActive(false);
                this.loadGameFile[i].setVisible(false);

                this.saveGame[i].setActive(false);
                this.saveGame[i].setVisible(false);
            }             
        }      
    }
} 
