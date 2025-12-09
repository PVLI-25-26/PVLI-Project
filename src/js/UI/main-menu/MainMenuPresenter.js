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


        this.view.playButton.on("button-clicked", () => {
            EventBus.emit('stopMusic');
            EventBus.emit("playSound", "click");
            
        });
        this.view.playButton.on("button-hovered", () => {
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

        // Back from settings
        this.view.backButton.on("button-clicked", () => {
             EventBus.emit('stopMusic');
            EventBus.emit("playSound", "click");
            this.view.toggleSettings();
        });
        this.view.backButton.on("button-hovered", () => {
            EventBus.emit("playSound", "hover");
        });

        //Back From Load Game

         this.view.GoMenuButton.on("button-clicked", () => {
             EventBus.emit('stopMusic');
            EventBus.emit("playSound", "click");
            this.view.toggleLoadGame();
        });
        this.view.GoMenuButton.on("button-hovered", () => {
            EventBus.emit("playSound", "hover");
        });


        // Game Slots
        
        this.view.gameSlot.forEach((element, index) => {
            element.on("button-clicked", () => {
                EventBus.emit('stopMusic');
                EventBus.emit("playSound", "click");
                saveDataManager.changeCurrentSave(index);
                this.view.scene.scene.start("GameplayScene", {playerSpawn: {x: 0, y:0}});
            // Player always starts from hub
                this.view.scene.plugins.get('dungeon').returnToHub();
            });
            element.on("button-hovered", () => {
                EventBus.emit("playSound", "hover");
            })
        });



        //delete Files 

        this.view.deleteGame.forEach((element,index)=>{
            element.on("button-clicked", () => {
                EventBus.emit('stopMusic');
                EventBus.emit("playSound", "click");
                saveDataManager.deleteData(index);
            });
            element.on("button-hovered", () => {
                EventBus.emit("playSound", "hover");
            });
        });
        
        //Save Game Files
        this.view.saveGame.forEach((element,index)=>{
            element.on("button-clicked", () => {
                EventBus.emit('stopMusic');
                EventBus.emit("playSound", "click");
                saveDataManager.saveDataDocument(index);;
            });
            element.on("button-hovered", () => {
                EventBus.emit("playSound", "hover");
            });
        });

        //Load Game Files
        this.view.loadGameFile.forEach((element,index)=>{
            element.on("button-clicked", () => {
                EventBus.emit('stopMusic');
                EventBus.emit("playSound", "click");
                saveDataManager.loadDataDocument(index);           
            });
            element.on("button-hovered", () => {
                EventBus.emit("playSound", "hover");
            }); 
        });

        //On loaded Files
        EventBus.on("DataLoaded", (i) => {
            this.view.toggleSlotOptions(i);
            this.view.gameSlot[i].buttonText.setText('Load Saved Game '+ (i+1));
        });
        
        
    }
        

    setValuesFromModel() {
        const musicVolume = this.model.musicVolume;
        const sfxVolume = this.model.sfxVolume;
        
        this.view.musicSlider.setValue(musicVolume);
        this.view.sfxSlider.setValue(sfxVolume);
    }
}