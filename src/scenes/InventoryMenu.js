import { SoundSceneFacade } from "../js/core/sound-facade";
import audioConfig from "../configs/audio-config.json";
import InventoryMenuModel from "../js/UI/inventory-menu/InventoryMenuModel";
import InventoryMenuPresenter from "../js/UI/inventory-menu/InventoryMenuPresenter";
import InventoryMenuView from "../js/UI/inventory-menu/InventoryMenuView";

export default class InventoryMenu extends Phaser.Scene {
    constructor(){
        super('InventoryMenu');
    }
    preload(){
        audioConfig.sounds.forEach(sound => this.load.audio(sound.key, sound.file));
    }

    create(player){
        this.plugins.get('soundfacade').initializeSoundFacade(this);

        const model = new InventoryMenuModel(player);
        const view = new InventoryMenuView(this);
        const presenter = new InventoryMenuPresenter(view, model); 

        this.keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    }

    update(){
        super.update()
        if(Phaser.Input.Keyboard.JustDown(this.keyESC) || Phaser.Input.Keyboard.JustDown(this.keyE)){
            this.scene.resume("GameplayScene");
            this.scene.stop("InventoryMenu");
        }
    }
}