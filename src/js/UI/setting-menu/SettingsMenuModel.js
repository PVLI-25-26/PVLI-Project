/*import Phaser from "phaser";
import { EventBus } from "../../core/event-bus";

// TODO: add initial volume parameters from saved settings
export default class SettingsMenuModel  {
    constructor(initialMusicVolume = 0.3, initialSFXVolume = 0.3) {
        this.musicVolume = initialMusicVolume;
        this.sfxVolume = initialSFXVolume;
    }

    // Sets the music volume level in the model and emits an event to notify all listeners (sound facade, etc.)
    setMusicVolume(value) {
        this.musicVolume = Phaser.Math.Clamp(value, 0, 1); 
        EventBus.emit('musicVolumeChanged', this.musicVolume); 
    }

    // Sets the SFX volume level in the model and emits an event to notify all listeners (sound facade, etc.)
    setSFXVolume(value) {
        this.sfxVolume = Phaser.Math.Clamp(value, 0, 1);
        EventBus.emit('sfxVolumeChanged', this.sfxVolume); 
    }
}*/