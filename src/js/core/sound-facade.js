import { EventBus } from "./event-bus";
import audioConfig from "../../configs/audio-config.json";

/**
 * Facade for managing sound and music playback within a Phaser scene.
 * Handles sound effect playback, background music, and dynamic volume adjustments.
 * Listens to global {@link EventBus} events for sound control.
 * 
 * @class
 * @category Core
 */
export class SoundSceneFacade extends Phaser.Plugins.BasePlugin{
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
    currentMusicKey = null;

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
     * @param {Object} audioConfig - Configuration object for sounds and music
     * @param {Array} audioConfig.sounds - Array of sound effect configurations
     * @param {Array} audioConfig.music - Array of music track configurations
     */
    constructor(pluginManager) {
        super('soundfacade', pluginManager);

        this.sounds = {};
        this.music = {};
        this.currentMusicKey = null;
        this.MusicVolume = 0.3;
        this.SFXVolume = 0.3;
    }

    /**
     * Initializes sound facade and gets scene to play sounds on
     * @param {Phaser.Scene} scene the scene to reproduce sounds on from now on
     */
    initializeSoundFacade(scene){
        this.scene = scene;
        this.subscribeToEvents();
    }

    /**
     * Subscribes the sound facade to relevant global {@link EventBus} events
     * @returns {void}
     */
    subscribeToEvents() {
        this.scene.events.on('destroy', () => this.destroy());

        
        // audioConfig.sounds.forEach(s => {
        //     this.sounds[s.key] = this.scene.sound.add(s.key);
        // });

        // audioConfig.music.forEach(m => {
        //     this.music[m.key] = this.scene.sound.add(m.key, { loop: m.loop, volume: m.volume });
        // });

        EventBus.on("playSound", this.playSound, this);
        EventBus.on("playMusic", this.playMusic, this);
        EventBus.on("stopMusic", this.stopMusic, this);

        EventBus.on("musicVolumeChanged", (value) => {
            // if (this.currentMusic) {
            //     this.currentMusic.setVolume(value);
            // }
            this.MusicVolume = value;
            if(this.currentMusicKey){
                const currentMusic = this.scene.sound.get(this.currentMusicKey);
                currentMusic.volume = this.MusicVolume;
            }
        });

        EventBus.on("sfxVolumeChanged", (value) => {
            // Object.values(this.sounds).forEach((sound) => sound.setVolume(value));
            this.SFXVolume = value;
        });
		EventBus.on("hubReached",()=>{
			EventBus.emit("playMusic","HUBMusic");
			EventBus.emit("playMusic","ForestAmbient");
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
        // const music = this.music[key];
        // Reproduce nueva musica
        this.currentMusicKey = key;
        this.scene.sound.play(key, {volume: 0});
        const music = this.scene.sound.get(key);
        var ease_in = this.scene.tweens.add({
            targets: music,
            duration: 600,
            ease: Phaser.Math.Easing.Sine.In,
            volume: this.MusicVolume
        })

    }

    /**
     * Stops the currently playing music, if any
     * @returns {void}
     */
    stopMusic(key) {
        const music = this.scene.sound.get(key?key:this.currentMusicKey);

        if(this.currentMusicKey == key){
            this.currentMusicKey = null;
        }

        if (music != null) {
			var ease_out = this.scene.tweens.add({
				targets: music,
				duration: 600,
				ease: Phaser.Math.Easing.Sine.Out,
				volume: 0.01,
				onComplete:()=>{
 	    	    	music.stop();
				}
			})
       }
    }

    /**
     * 
     * @returns Sound Effects volume
     */
    getCurrentSFXVolume(){
        return this.SFXVolume;
    }

    /**
     * 
     * @returns Sound Music volume
     */
    getCurrentMusicVolume(){
        return this.MusicVolume;
    }

    /**
     * Unsubscribes all event listeners and performs cleanup
     * Called when scene is destroyed automatically
     * @returns {void}
     */
    destroy() {
        EventBus.off("playSound", this.playSound, this);
        EventBus.off("playMusic", this.playMusic, this);
        EventBus.off("stopMusic", this.stopMusic, this);
    }
}
