import Phaser from "phaser";
import { EventBus } from "../../core/event-bus.js";

export default class PauseMenuModel {
    constructor(initialMusicVolume = 0.3, initialSFXVolume = 0.3) {
        this.musicVolume = initialMusicVolume;
        this.sfxVolume = initialSFXVolume;
    }

    setMusicVolume(value) {
        this.musicVolume = Phaser.Math.Clamp(value, 0, 1);
        EventBus.emit("musicVolumeChanged", this.musicVolume);
    }

    setSFXVolume(value) {
        this.sfxVolume = Phaser.Math.Clamp(value, 0, 1);
        EventBus.emit("sfxVolumeChanged", this.sfxVolume);
    }
}
