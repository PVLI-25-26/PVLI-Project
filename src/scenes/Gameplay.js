import playerConfig from "../configs/player-config.json";
import audioConfig from "../configs/audio-config.json";
import obstaclesConfig from "../configs/obstacles-config.json";
import defaultRoom from "../configs/Rooms/hub-config.json";
import roomsConfig from "../configs/Rooms/rooms.json";
import { Obstacle } from '../js/entities/Obstacle.js';
import { Player } from '../js/entities/Player.js';
import showLoaderUI from "../js/UI/LoaderUI.js";
import { SoundSceneFacade } from "../js/core/sound-facade.js";
import { BillBoard } from "../js/entities/BillBoard.js";
import BillConfig from "../configs/billboard-config.json"

export default class GameplayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameplayScene' });
    }
    
    preload() {
        this.logger = this.plugins.get('logger');

        showLoaderUI(this);

        this.logger.log('SCENE', 1, 'Loading assets...');
        // This should be moved to an initial asset loading screen and only load assets once
        this.load.image('player', 'assets/sprites/player-dummy.png');
        this.load.spritesheet('arrow', 'assets/sprites/arrow.png', {frameWidth:32});
        this.load.spritesheet('barrel-spritestack', 'assets/sprites/SpriteStackingPlaceholders/MiscProps/Barrel_strip8.png', {frameWidth: 14});
        this.load.spritesheet('wall-spritestack', 'assets/sprites/SpriteStackingPlaceholders/Walls/WallCornerBrick_strip16.png', {frameWidth: 16});
        this.load.spritesheet('chest-spritestack', 'assets/sprites/SpriteStackingPlaceholders/MiscProps/Chestf0_strip18.png', {frameWidth: 16, spacing: 6});
        this.load.spritesheet('crate-spritestack', 'assets/sprites/SpriteStackingPlaceholders/MiscProps/Crate_strip8.png', {frameWidth: 16});
        this.load.spritesheet('door-spritestack', 'assets/sprites/SpriteStackingPlaceholders/Doors/WoodDoor_strip16.png', {frameWidth: 16, frameHeight: 6});

        this.logger.log('SCENE', 1, 'Assets loaded');
    }

    create(data) {
        // Get data of current room
        this.roomData = data.roomData || defaultRoom;
        this.playerSpawn = data.playerSpawn || {x: 0, y: 0};

        // Initialize sound
        this.logger.log('SCENE', 1, 'Creating Sound facade');
        this.sound_facade = new SoundSceneFacade(this, audioConfig);

        this.input.keyboard.on("keydown-ESC", () => {
            if (this.scene.isPaused("GameplayScene")) return;
            this.scene.launch("PauseMenu");
            this.scene.pause();
        });

        // Map object and room configs to keys to reuse them
        // This should be done once and store globally somewhere (still thinking where)
        this.obstacles = new Map();
        obstaclesConfig.forEach(cfg =>{
            this.obstacles.set(cfg.key, cfg);
        });
        // This should be done once and store globally somewhere (still thinking where)
        this.rooms = new Map();
        roomsConfig.forEach(cfg =>{
            fetch('src/configs/Rooms/'+cfg.path)
                .then((response)=>response.json())
                .then((room)=>this.rooms.set(cfg.key, room));
        });

        // Create physics groups
        this.obstaclesGroup = this.physics.add.staticGroup();
        this.connectionsGroup = this.physics.add.staticGroup();

        // Create player
        this.logger.log('SCENE', 1, 'Creating player');
        this.player = new Player(this, this.playerSpawn.x, this.playerSpawn.y, playerConfig);

        // Load scene objects from room data
        this.loadObjects(this.roomData);

        // Create collider with obstacles
        this.physics.add.collider(this.player, this.obstaclesGroup);

        // Make camera follow the player
        this.cameras.main.startFollow(this.player, false, 0.1, 0.1, 10, 10);
    }

    loadObjects(roomConfig){
        // Create every object from the room config
        this.logger.log('SCENE', 1, 'Creating objects: ');
        roomConfig.obstacles.forEach(obj =>{
            this.logger.log('SCENE', 1, `${obj.key}, ${obj.x}, ${obj.y}`);
            const obstacle = new Obstacle(this, obj.x, obj.y, this.obstacles.get(obj.key));
            obstacle.setRotation(obj.r*Math.PI/180);
            this.obstaclesGroup.add(obstacle);
        });

        // Create every connection from the room config
        this.logger.log('SCENE', 1, 'Creating connections: ');
        roomConfig.connections.forEach(con =>{
            this.logger.log('SCENE', 1, `${con.scene}, ${con.x}, ${con.y}`);
            const connection = this.add.sprite(con.x, con.y);
            this.physics.add.existing(connection, true);

            // When player overlaps connection change room
            this.physics.add.overlap(this.player, connection, ()=>{
                this.scene.restart({roomData: this.rooms.get(con.scene), playerSpawn: {x:con.spawnX, y:con.spawnY}});
            });
        });
        
    }

    update(time, delta) {}
}

