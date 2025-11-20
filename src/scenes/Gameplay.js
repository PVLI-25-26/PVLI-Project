import playerConfig from "../configs/player-config.json";
import audioConfig from "../configs/audio-config.json";
import dungeon from "../js/core/dungeon.js";
import { Player } from '../js/entities/Player.js';
import { EventBus } from "../js/core/event-bus.js";
import showLoaderUI from "../js/UI/LoaderUI.js";
import { SoundSceneFacade } from "../js/core/sound-facade.js";

export default class GameplayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameplayScene' });
    }
    
    preload() {
        this.logger = this.plugins.get('logger');
    }

    create(data) {
        EventBus.removeAllListeners();
        
        // Get data about new room (this data depends on the connection take, that is why it is passed through there and not in the dungeon)
        this.playerSpawn = data.playerSpawn || {x: 0, y: 0};

        // Initialize sound
        this.logger.log('GAMEPLAY', 1, 'Creating Sound facade...');
        this.sound_facade = new SoundSceneFacade(this, audioConfig);

        this.input.keyboard.on("keydown-ESC", () => {
            if (this.scene.isPaused("GameplayScene")) return;
            this.scene.launch("PauseMenu");
            this.scene.pause();
        });

        this.input.keyboard.on("keydown-SHIFT", () => {
            if (this.scene.isPaused("GameplayScene")) return;
            this.scene.launch("InventoryMenu", this.player);
            this.scene.pause();
        });


        // Create physics groups
        this.obstaclesCategory = 1 << 0;
        this.enemiesCategory = 1 << 1;
        this.playerCategory = 1 << 2;
        this.arrowCategory = 1 << 3;
        this.connectionsCategory = 1 << 4;
        this.itemsCategory = 1 << 5;

        // Create player
        this.logger.log('GAMEPLAY', 1, 'Creating player...');
        this.player = new Player(this, this.playerSpawn.x, this.playerSpawn.y, playerConfig);
        this.player.setCollisionCategory(this.playerCategory);
        // Create colliders
        this.player.setCollidesWith([this.enemiesCategory, this.obstaclesCategory, this.connectionsCategory, this.itemsCategory]);

        // HOW DO I MAKE THIS ONLY WITH ONE CATEGORY
        this.player.setOnCollide((pair) => {
                if(pair.bodyB.collisionFilter.category == this.enemiesCategory)
                {
                    const player = pair.bodyA.gameObject;
                    const enemy = pair.bodyB.gameObject;
                    EventBus.emit('enemyMeleeHit', { attacker: enemy, target: player });
                }
            });
        // this.physics.add.collider(this.player, this.enemiesCategory, 
        //     (player, enemy) => {
        //         EventBus.emit('enemyMeleeHit', { attacker: enemy, target: player });
        //     },null, this);

        // Load scene objects from room data
        dungeon.loadCurrentRoom(this, this.obstaclesCategory, this.enemiesCategory, this.playerCategory, this.connectionsCategory, this.itemsCategory);
        // Make camera follow the player
        this.cameras.main.startFollow(this.player, false, 0.1, 0.1, 10, 10);
    }
}

