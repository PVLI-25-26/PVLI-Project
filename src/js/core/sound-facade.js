import { EventBus } from "./event-bus";

/**
 * Facade for managing sound and music playback within a Phaser scene.
 * Handles sound effect playback, background music, and dynamic volume adjustments.
 * Listens to global {@link EventBus} events for sound control.
 * 
 * @class
 * @category Core
 */
export class SoundSceneFacade {
    /**
     * The Phaser scene this facade belongs to
     * @type {Phaser.Scene}
     */
    scene;

    /**
     * Dictionary of sound effects
     * @type {Object.<string, Phaser.Sound.BaseSound>}
     */
    sounds = {};

    /**
     * Dictionary of music tracks
     * @type {Object.<string, Phaser.Sound.BaseSound>}
     */
    music = {};

    /**
     * Currently playing music track
     * @type {Phaser.Sound.BaseSound|null}
     */
    currentMusic = null;

    /**
     * SFX Volume
     * @type {Number}
     */
    SFXVolume;

    /**
     * Music Volume
     * @type {Number}
     */
    MusicVolume;

    /**
     * Creates a new SoundSceneFacade instance
     * @param {Phaser.Scene} scene - The Phaser scene this facade belongs to
     * @param {Object} config - Configuration object for sounds and music
     * @param {Array} config.sounds - Array of sound effect configurations
     * @param {Array} config.music - Array of music track configurations
     */
    constructor(scene, config) {
        this.scene = scene;
        this.sounds = {};
        this.music = {};
        this.currentMusic = null;

        // config.sounds.forEach(s => {
        //     this.sounds[s.key] = scene.sound.add(s.key);
        // });

        config.music.forEach(m => {
            this.music[m.key] = scene.sound.add(m.key, { loop: m.loop, volume: m.volume });
        });

        this.subscribeToEvents();
    }

    /**
     * Subscribes the sound facade to relevant global {@link EventBus} events
     * @returns {void}
     */
    subscribeToEvents() {
        this.scene.events.on('destroy', () => this.destroy());

        EventBus.on("playSound", this.playSound, this);
        EventBus.on("playMusic", this.playMusic, this);
        EventBus.on("stopMusic", this.stopMusic, this);

        EventBus.on("musicVolumeChanged", (value) => {
            if (this.currentMusic) {
                this.currentMusic.setVolume(value);
            }
            this.MusicVolume = value;
        });

        EventBus.on("sfxVolumeChanged", (value) => {
            // Object.values(this.sounds).forEach((sound) => sound.setVolume(value));
            this.SFXVolume = value;
        });
    }

    /**
     * Plays a sound effect by key
     * @param {string} key - The key of the sound effect to play
     * @returns {void}
     */
    playSound(key) {
        // const sound = this.sounds[key];
        // if (sound) sound.play();
        this.scene.sound.play(key, {volume: this.SFXVolume});
    }

    /**
     * Stops a specific sound effect by key
     * @param {string} key - The key of the sound effect to stop
     * @returns {void}
     */
    stopSound(key) {
        // const sound = this.sounds[key];
        // if (sound) {
        //     sound.stop();
        // }
        this.scene.sound.stopByKey(key);
    }

    /**
     * Plays background music by key
     * Stops any currently playing track before starting the new one
     * @param {string} key - The key of the music track to play
     * @returns {void}
     */
    playMusic(key) {
        if (this.currentMusic) {
            this.currentMusic.stop();
        }
        const music = this.music[key];
        if (music) {
            music.play();
            this.currentMusic = music;
        }
    }

    /**
     * Stops the currently playing music, if any
     * @returns {void}
     */
    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic = null;
        }
    }

    /**
     * Unsubscribes all event listeners and performs cleanup
     * Should be called when the scene is destroyed
     * @returns {void}
     */
    destroy() {
        EventBus.off("playSound", this.playSound, this);
        EventBus.off("playMusic", this.playMusic, this);
        EventBus.off("stopMusic", this.stopMusic, this);
    }
}