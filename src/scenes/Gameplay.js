import playerConfig from "../configs/player-config.json";
import audioConfig from "../configs/audio-config.json";
import dungeon from "../js/core/dungeon.js";
import { Player } from '../js/entities/Player.js';
import { EventBus } from "../js/core/event-bus.js";
import showLoaderUI from "../js/UI/LoaderUI.js";
import { SoundSceneFacade } from "../js/core/sound-facade.js";
import sceneEnemies from "../configs/enemies-config.json";
import { createEnemy } from "../js/core/enemy-simple-fabric.js";


export default class GameplayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameplayScene' });
    }
    
    preload() {
        this.logger = this.plugins.get('logger');

        showLoaderUI(this);

        this.logger.log('DUNGEON', 1, 'Loading assets...');
        // This should be moved to an initial asset loading screen and only load assets once
        this.load.spritesheet('player', 'assets/sprites/CharacterBaseSprites.png', {frameWidth:32});
        this.load.image('slime', 'assets/sprites/SlimeSprite.png');
        this.load.spritesheet('arrow', 'assets/sprites/arrow.png', {frameWidth:32});
        this.load.spritesheet('bow', 'assets/sprites/Bow.png', {frameWidth:16});
        this.load.image('aiming-arrow', 'assets/sprites/AimingArrow.png', {frameWidth:16})
        this.load.spritesheet('barrel-spritestack', 'assets/sprites/SpriteStackingPlaceholders/MiscProps/Barrel_strip8.png', {frameWidth: 14});
        this.load.spritesheet('wall-spritestack', 'assets/sprites/SpriteStackingPlaceholders/Walls/WallCornerBrick_strip16.png', {frameWidth: 16});
        this.load.spritesheet('chest-spritestack', 'assets/sprites/SpriteStackingPlaceholders/MiscProps/Chestf0_strip18.png', {frameWidth: 16, spacing: 6});
        this.load.spritesheet('crate-spritestack', 'assets/sprites/SpriteStackingPlaceholders/MiscProps/Crate_strip8.png', {frameWidth: 16});
        this.load.spritesheet('door-spritestack', 'assets/sprites/SpriteStackingPlaceholders/Doors/WoodDoor_strip16.png', {frameWidth: 16, frameHeight: 6});
        this.load.image("billboard","assets/sprites/SpriteStackingPlaceholders/Billboard/catPlaceholder.jpg");
        this.load.image("grass","assets/sprites/grass.png");
        this.load.image("tree","assets/sprites/tree.png");
    }

    create(data) {
        // Get data about new room (this data depends on the connection take, that is why it is passed through there and not in the dungeon)
        this.playerSpawn = data.playerSpawn || {x: 0, y: 0};

        // Initialize sound
        this.logger.log('DUNGEON', 1, 'Creating Sound facade...');
        this.sound_facade = new SoundSceneFacade(this, audioConfig);

        this.input.keyboard.on("keydown-ESC", () => {
            if (this.scene.isPaused("GameplayScene")) return;
            this.scene.launch("PauseMenu");
            this.scene.pause();
        });

        // Create physics groups
        this.obstaclesGroup = this.physics.add.staticGroup();
        this.enemiesGroup = this.physics.add.group();

        // Create player
        this.logger.log('DUNGEON', 1, 'Creating player...');
        this.player = new Player(this, this.playerSpawn.x, this.playerSpawn.y, playerConfig);

        // Create colliders
        this.physics.add.collider(this.player, this.obstaclesGroup);
        this.physics.add.collider(this.player, this.enemiesGroup, 
            (player, enemy) => {
                EventBus.emit('enemyMeleeHit', { attacker: enemy, target: player });
            },null, this);

        // Load scene objects from room data
        dungeon.loadCurrentRoom(this, this.obstaclesGroup, this.enemiesGroup, this.player);

        // Make camera follow the player
        this.cameras.main.startFollow(this.player, false, 0.1, 0.1, 10, 10);
    }
}

