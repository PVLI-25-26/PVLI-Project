import Phaser from "phaser";
import { LOG_LEVELS, Logger } from "./logger";
import serviceLocator, { SERVICE_KEYS } from "./service-locator";


export class LoaderUI {
    /**
     * 
     * @param {Phaser.Scene} scene The scene where the loader shows the loading information
     * @param {Phaser.Loader} loader The loader used to load all the assets
     */
    constructor(scene){
        this.scene = scene;
        let text = scene.add.text(0,0,"Progress ");
        scene.load.on("progress", function (progress) {
            text.text = 'Progress [';
            for(let i = 0; i < progress*50; i++)
                text.text += '#';
            for(let i = 0; i < (1-progress)*50; i++)
                text.text += ' ';
            text.text += ']';

            serviceLocator.getService(SERVICE_KEYS.LOGGER).log("LOADER", LOG_LEVELS.DEBUG, text.text);
        });
        scene.load.once("complete", function () {
            text.text = `Loading Complete`;
            serviceLocator.getService(SERVICE_KEYS.LOGGER).log("LOADER", LOG_LEVELS.DEBUG, `Loading complete`)
        });
    }

    
}