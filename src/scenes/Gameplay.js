import playerConfig from "../configs/player-config.json";
import AudioManager from "../js/core/audio-manager-object.js"
import audioConfig from "../configs/audio-config.json";
import { Player } from '../js/entities/Player.js';
import { EventBus } from "../js/core/event-bus.js";
import { HudModel } from "../js/UI/hud/HUDModel.js";
import { HudView } from "../js/UI/hud/HUDView.js";
import { HudPresenter } from "../js/UI/hud/HUDPresenter.js";
import showLoaderUI from "../js/UI/LoaderUI.js";
import { SoundSceneFacade } from "../js/core/sound-facade.js";

import {NPC} from "../js/entities/NPC.js"
import NPCconfig from "../configs/NPCs/NPC-config.json"

import NPCsDialogueModel from "../js/UI/NPCsDialogue/NPCsDialogueModel.js";
import NPCsDialoguePresenter from "../js/UI/NPCsDialogue/NPCsDialoguePresenter.js";
import NPCsDialogueView from "../js/UI/NPCsDialogue/NPCsDialogueView.js";

import dialoguesConfig from "../configs/Dialogues/NPCsDialogue-config.json"
import dialogueEvents from "../configs/Dialogues/NPCsDialogue-buttonEvents.js"
import { InputFacade } from "../js/core/input-facade.js";
import saveDataManager from "../js/core/save-data-manager.js";
import missionManager from "../js/core/mission-manager.js";


export default class GameplayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameplayScene' });
    }
    
    preload() {
        this.logger = this.plugins.get('logger');
    }

    create(data) {
        // Fade camera in
        this.cameras.main.fadeIn(800,79,74,69);
        // Camera layers
        this.hudLayer = this.add.layer();
        // Create UI camera and set it far away (responsible for showing hud)
        this.uiCam = this.cameras.add(0, 0, this.scale.width, this.scale.height);
        this.uiCam.setScroll(10000, 10000); 
        // Tell main camera to ignore hud layer (Not necessary currently, this is because we tried to do it with layers and not setting the camera far away, it didn't work for some objects)
        this.cameras.main.ignore(this.hudLayer);

        // Remove debug mode by default
        this.toggleDebug();

        // Remove all event listeners in Event Bus (This is a quick fix to not unsubscribing from events on entity destruction, we should have done it the other way)
        EventBus.removeAllListeners();

        EventBus.on("toggleDebug", this.toggleDebug, this);

		var audioManager = new AudioManager();

        // Create input facade and lock pointer
        this.inputFacade = new InputFacade(this);
        this.inputFacade.resetPointerLockCount();

        // Create HUD
        const model = new HudModel(this);
        const view = new HudView(this);
        const presenter = new HudPresenter(view, model);
        
        // Create NPC Dialogue UI (Maybe could be handled by HUD?)
        const NPCmodel = new NPCsDialogueModel(dialoguesConfig,dialogueEvents);
        const NPCview = new NPCsDialogueView(this);
        const NPCpresenter = new NPCsDialoguePresenter(NPCview,NPCmodel)

        // Resubscribe to events (events are currently cleared every time)
        missionManager.subscribeToEvents(this);

        // Get data about new room (this data depends on the connection take, that is why it is passed through there and not in the dungeon)
        this.playerSpawn = data.playerSpawn || {x: 0, y: 0};

        // Initialize sound
        this.logger.log('GAMEPLAY', 1, 'Creating Sound facade...');
        this.plugins.get('soundfacade').initializeSoundFacade(this);

        // Lock mouse pointer when scene starts and when scene is resumed
        this.inputFacade.lockPointer();
        this.events.on('resume', this.inputFacade.lockPointer, this);
        // Unlock mouse when scene is paused
        this.events.on('pause', this.inputFacade.releasePointer, this);
        // Lock mouse if user clicks (maybe they exited the lock with ESC)
        //this.input.on('pointerdown', ()=>{this.input.mouse.requestPointerLock()}, this);

        // Pause game with [P]
        this.input.keyboard.on("keydown-P", () => {
            if (this.scene.isPaused("GameplayScene")) return;
            this.scene.launch("PauseMenu");
            this.scene.pause();
        });

        // Open inventory with [E]
        this.input.keyboard.on("keydown-E", () => {
            if (this.scene.isPaused("GameplayScene")) return;
            this.scene.launch("InventoryMenu", this.player);
            this.scene.pause();
        });

        // Create physics categories
        this.obstaclesCategory = 1 << 0;
        this.enemiesCategory = 1 << 1;
        this.playerCategory = 1 << 2;
        this.arrowCategory = 1 << 3;
        this.connectionsCategory = 1 << 4;
        this.interactablesCategory = 1 << 5;

        // Create player
        this.logger.log('GAMEPLAY', 1, 'Creating player...');
        this.player = new Player(this, this.playerSpawn.x, this.playerSpawn.y, playerConfig);
        this.player.setCollisionCategory(this.playerCategory);
        // Create colliders
        this.player.setCollidesWith([this.enemiesCategory, this.obstaclesCategory, this.connectionsCategory, this.interactablesCategory]);

        // when player is hit by an enemy it triggers a hit
        this.player.setOnCollide((pair) => {
                if(pair.bodyB.collisionFilter.category == this.enemiesCategory)
                {
                    const player = pair.bodyA.gameObject;
                    const enemy = pair.bodyB.gameObject;
                    // This should be handled by enemies
                    EventBus.emit('entityHit', { attacker: enemy, target: player, damage: 1, force: 20, duration: 300 });
                }
            });

        // Load scene objects from room data
        this.plugins.get('dungeon').loadCurrentRoom(this, this.obstaclesCategory, this.enemiesCategory, this.playerCategory, this.connectionsCategory, this.interactablesCategory);
        // Make camera follow the player
        this.cameras.main.startFollow(this.player, false, 0.1, 0.1, 10, 10);
        
        EventBus.on('playerDied', ()=>{
            this.cameras.main.fadeOut(800,79,74,69, (cam, progr)=>{
                if(progr >= 1){
                    this.plugins.get('dungeon').returnToHub();
                    this.scene.restart({playerSpawn: {x: 0, y: 0}});
                }
            });
        })
        
        EventBus.on('changeRoom', (data)=>{
            this.scene.restart(data);
        })
    }

    /**
     * Toggles debug view
     */
    toggleDebug() {
        this.matter.world.drawDebug = !this.matter.world.drawDebug;
        this.matter.world.debugGraphic.visible = this.matter.world.drawDebug;
    }
}

