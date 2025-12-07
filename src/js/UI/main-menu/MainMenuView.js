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
                text: 'Play',
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
                this.toggleLoadGame();
            });
        });

        //SaveFiles

        this.saveFiles = [];
        let yOffset = 0;
        for (let i = 0; i < 3; i++) 
        {
            this.saveFiles.push(new Button(this.scene, centerX-100, centerY-120+yOffset, null, 150, 50, {
                text: localStorage.getItem(i) == null ? 'New Game' : 'Load Game ' + (i + 1),
                style: {
                    fontSize: 20,
                    color: Colors.White,
                    fontFamily: 'FableFont',
                    padding: {x:20, y: 10}
                }
            }))
            this.saveFiles[i].addInteraction((btn) => 
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
            
            this.saveFiles[i].setActive(false);
            this.saveFiles[i].setVisible(false);

            yOffset+=100;
        }
        /*
        this.saveFile1 = new Button(this.scene, centerX-100, centerY-120, null, 150, 50,
            {
                text: localStorage.getItem(0) == null ? 'New Game': 'Load Game 1',
                style: {
                    fontSize: 20,
                    color: Colors.White,
                    fontFamily: 'FableFont',
                    padding: { x: 20, y: 10 },
                }
            }
        );
        this.saveFile1.addInteraction((btn) => {
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

        this.saveFile2 = new Button(this.scene, centerX-100, centerY - 20, null, 150, 50,
            {
                text: localStorage.getItem(1) == null ? 'New Game': 'Load Game 2',
                style: {
                    fontSize: 20,
                    color: Colors.White,
                    fontFamily: 'FableFont',
                    padding: { x: 20, y: 10 },
                }
            }
        );
        this.saveFile2.addInteraction((btn) => {
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

        

        this.saveFile3 = new Button(this.scene, centerX-100, centerY+80, null, 150, 50,
            {
                text: localStorage.getItem(2) == null ? 'New Game': 'Load Game 3',
                style: {
                    fontSize: 20,
                    color: Colors.White,
                    fontFamily: 'FableFont',
                    padding: { x: 20, y: 10 },
                }
            }
        );
        console.log(localStorage.getItem(2));
        this.saveFile3.addInteraction((btn) => {
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

        this.saveFile1.setActive(false);
        this.saveFile1.setVisible(false);

        this.saveFile2.setActive(false);
        this.saveFile2.setVisible(false);

        this.saveFile3.setActive(false);
        this.saveFile3.setVisible(false);

        */

        //Delete data buttons

        this.deleteGame = [];

        for(let i = 0; i < this.saveFiles.length; i++)
        {
            this.deleteGame.push(new Button(this.scene, centerX+80, this.saveFiles[i].y, null, 20, 20,
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
                this.saveFiles[i].buttonText.setText('New Game');

                this.deleteGame[i].setActive(false);
                this.deleteGame[i].setVisible(false);
            });
        });

        this.deleteGame[i].setActive(false);
        this.deleteGame[i].setVisible(false);

        }


/*

        this.DeleteGame1 = new Button(this.scene, centerX+80, this.saveFiles[0].y, null, 20, 20,
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
        ).setScale(2);

        this.DeleteGame1.addInteraction((btn) => {
            btn.on("pointerover", () => {
                btn.buttonText.setColor(Colors.Red);
                btn.invokeHover();
            });
            btn.on("pointerout", () => {
                btn.buttonText.setColor(Colors.White);
            });
            btn.on("pointerdown", () => {
                btn.invokeClick();
                this.saveFiles[0].buttonText.setText('New Game');

                this.DeleteGame1.setActive(false);
                this.DeleteGame1.setVisible(false);
            });
        });
 
        this.DeleteGame2 = new Button(this.scene, centerX+80, this.saveFiles[1].y, null, 20, 20,
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
        ).setScale(2);

        this.DeleteGame2.addInteraction((btn) => {
            btn.on("pointerover", () => {
                btn.buttonText.setColor(Colors.Red);
                btn.invokeHover();
            });
            btn.on("pointerout", () => {
                btn.buttonText.setColor(Colors.White);
            });
            btn.on("pointerdown", () => {
                btn.invokeClick();
                this.saveFiles[1].buttonText.setText('New Game');

                this.DeleteGame2.setActive(false);
                this.DeleteGame2.setVisible(false);
            });
        });
*/

    

        this.DeleteGame3 = new Button(this.scene, centerX+150, this.saveFiles[2].y, null, 50, 20,
            {
                text: 'Save',
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
        ).setScale(2);
        this.DeleteGame3.addInteraction((btn) => {
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
        this.GoMenuButton.setActive(false);
        this.GoMenuButton.setVisible(false);


        

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

    toggleLoadGame(){
        this.GoMenuButton.setActive(!this.GoMenuButton.active);
        this.GoMenuButton.setVisible(!this.GoMenuButton.visible);

        this.settingsButton.setActive(!this.settingsButton.active);
        this.settingsButton.setVisible(!this.settingsButton.visible);

        this.startButton.setActive(!this.startButton.active);
        this.startButton.setVisible(!this.startButton.visible);


        for(let i = 0 ; i< this.saveFiles.length ;i++){

            this.saveFiles[i].setActive(!this.saveFiles[i].active);
            this.saveFiles[i].setVisible(!this.saveFiles[i].visible);

            if (localStorage.getItem(i) != null && this.saveFiles[i].active){
                this.deleteGame[i].setActive(true);
                this.deleteGame[i].setVisible(true);

                //TO DO:poner cargar archivo como false
                //      poner guardar archivo como true
            }
            else{
                this.deleteGame[i].setActive(false);
                this.deleteGame[i].setVisible(false);

                //TO DO:poner cargar archivo como true
                //      poner guardar archivo como false
            }            
        }

        /*

        

        this.saveFile1.setActive(!this.saveFile1.active);
        this.saveFile1.setVisible(!this.saveFile1.visible);

        this.saveFile2.setActive(!this.saveFile2.active);
        this.saveFile2.setVisible(!this.saveFile2.visible);

        this.saveFile3.setActive(!this.saveFile3.active);
        this.saveFile3.setVisible(!this.saveFile3.visible);

        for(let i = 0 ; i< this.saveFiles.length ;i++){
            if (localStorage.getItem(0) != null && this.saveFiles[0].active){
            this.DeleteGame1.setActive(true);
                    this.DeleteGame1.setVisible(true);
            }
            else{
                this.DeleteGame1.setActive(false);
                this.DeleteGame1.setVisible(false);
            }
        }
       
        if (localStorage.getItem(0) != null && this.saveFiles[0].active){
        this.DeleteGame1.setActive(true);
        this.DeleteGame1.setVisible(true);
        }
        else{
        this.DeleteGame1.setActive(false);
        this.DeleteGame1.setVisible(false);
        }


        if (localStorage.getItem(1) != null && this.saveFiles[1].active){
        this.DeleteGame2.setActive(true);
        this.DeleteGame2.setVisible(true);
        }
        else{
        this.DeleteGame2.setActive(false);
        this.DeleteGame2.setVisible(false);
        }
        
        
        if (localStorage.getItem(2) != null && this.saveFiles[2].active){
        this.DeleteGame3.setActive(true);
        this.DeleteGame3.setVisible(true);
        }
        else{
        this.DeleteGame3.setActive(false);
        this.DeleteGame3.setVisible(false);
        }
         */
    }
} 