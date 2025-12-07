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
        this.view.startButton.on("button-clicked", () => {
            EventBus.emit('stopMusic');
            EventBus.emit("playSound", "click");
            
        });
        this.view.startButton.on("button-hovered", () => {
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


        // Saved files
        
        this.view.saveFiles.forEach((element, index) => {
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

/*
        this.view.saveFiles[0].on("button-clicked", () => {
            EventBus.emit('stopMusic');
            EventBus.emit("playSound", "click");
            saveDataManager.changeCurrentSave(0);
            this.view.scene.scene.start("GameplayScene", {playerSpawn: {x: 0, y:0}});
            // Player always starts from hub
            this.view.scene.plugins.get('dungeon').returnToHub();
        });
        this.view.saveFiles[0].on("button-hovered", () => {
            EventBus.emit("playSound", "hover");
        });

        this.view.saveFiles[1].on("button-clicked", () => {
            EventBus.emit('stopMusic');
            EventBus.emit("playSound", "click");
            saveDataManager.changeCurrentSave(1);
            this.view.scene.scene.start("GameplayScene", {playerSpawn: {x: 0, y:0}});
            // Player always starts from hub
            this.view.scene.plugins.get('dungeon').returnToHub();
        });
        this.view.saveFiles[1].on("button-hovered", () => {
            EventBus.emit("playSound", "hover");
        });

        this.view.saveFiles[2].on("button-clicked", () => {
            EventBus.emit('stopMusic');
            EventBus.emit("playSound", "click");
            saveDataManager.changeCurrentSave(2);
            this.view.scene.scene.start("GameplayScene", {playerSpawn: {x: 0, y:0}});
            // Player always starts from hub
            this.view.scene.plugins.get('dungeon').returnToHub();
        });
        this.view.saveFiles[2].on("button-hovered", () => {
            EventBus.emit("playSound", "hover");
        });
        //*/
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
        }
        );

/*

        this.view.DeleteGame1.on("button-clicked", () => {
            EventBus.emit('stopMusic');
            EventBus.emit("playSound", "click");
            saveDataManager.deleteData(0);
        });
        this.view.DeleteGame1.on("button-hovered", () => {
            EventBus.emit("playSound", "hover");
        });

        this.view.DeleteGame2.on("button-clicked", () => {
            EventBus.emit('stopMusic');
            EventBus.emit("playSound", "click");
            saveDataManager.deleteData(1);
        });
        this.view.DeleteGame2.on("button-hovered", () => {
            EventBus.emit("playSound", "hover");
        });*/

        this.view.DeleteGame3.on("button-clicked", () => {
            EventBus.emit('stopMusic');
            EventBus.emit("playSound", "click");
            //saveDataManager.deleteData(2);

            //saveDataManager.saveDataDocument();

            const a = document.createElement("a");
            const file = new Blob([JSON.stringify({hola:"test"})], { type: "text/plain" });
            a.href = URL.createObjectURL(file);
            a.download = "test.json";
            a.click();
        });
        this.view.DeleteGame3.on("button-hovered", () => {
            EventBus.emit("playSound", "hover");
        });


    }
        

    setValuesFromModel() {
        const musicVolume = this.model.musicVolume;
        const sfxVolume = this.model.sfxVolume;
        
        this.view.musicSlider.setValue(musicVolume);
        this.view.sfxSlider.setValue(sfxVolume);
    }
}