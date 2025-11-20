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
        this.soundFacade = new SoundSceneFacade(this, audioConfig);

        const model = new InventoryMenuModel(player);
        const view = new InventoryMenuView(this);
        const presenter = new InventoryMenuPresenter(view, model); 
    }
}