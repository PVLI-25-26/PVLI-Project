/**
 * @typedef {Object} Connection
 * @property {number} x - X position of the connection trigger.
 * @property {number} y - Y position of the connection trigger.
 * @property {string} scene - Destination scene/room key.
 * @property {number} spawnX - Player spawn X in destination room.
 * @property {number} spawnY - Player spawn Y in destination room.
 */

/**
 * @typedef {Object} RoomInstance
 * @property {string} key - Room key.
 * @property {string} path - Path to the room JSON file.
 * @property {Array<Connection>} [connections] - Connections to other rooms.
 */

import roomsConfig from '../../configs/Dungeon/dungeon.json'
import { BasicEnemy } from '../entities/Enemies/BasicEnemy.js';
import { EventBus } from './event-bus.js';
import { createConnection } from './factories/connection-factory.js';
import { createEnemy } from "./factories/enemy-simple-fabric.js";
import { createItem } from './factories/item-factory.js';
import { createNPC } from './factories/npc-factory.js';
import { createObstacle } from './factories/obstacle-factory.js';
import saveDataManager from './save-data-manager.js';
import { getCustomTiledProperty, getTiledMapLayer } from './tiled-parser.js';

/**
 * Manages dungeon rooms and instantiation of room objects into a Phaser scene.
 *
 * Notes:
 * - Room JSONs referenced by configs/Rooms/rooms.json are fetched at initialization.
 */
export class Dungeon extends Phaser.Plugins.BasePlugin {
    /**
     * Map of every dungeon room [key -> RoomConfig]
     * @type {Map<Number, RoomInstance>}
     */
    #rooms;
    /**
     * Map of only resetable room IDs and their file path [ID -> path].
     * This is used when reseting the dungeon, to only read the rooms necessary.
     * @type {Map<Number, String>}
     */
    #resetableRooms
    /**
     * Current active room key.
     * @type {string}
     */
    currentRoomKey;
    /**
     * Array of rooms explored by the player.
     * @type {Set<String>}
     */
    roomsExplored;
    /**
     * ID of the room with name Hub. Saved to emit global event when player goes to Hub.
     * @type {Number}
     */
    #hubID
    /**
     * Path of the file where the hub is defined.
     * @type {String}
     */
    #hubPath
    /**
     * ID of the room with name Intro. Saved to return to the Intro if player dies in the tutorial.
     * @type {Number}
     */
    #tutorialIntroID
    /**
     * Number of enemies alive in room
     * When this counter reaches 0, a global event "roomCleared" is emitted
     * @type {Number}
     */
    #roomEnemiesCounter;

    /**
     * Create a Dungeon manager.
     * @param {string} initialRoomKey - Key of the initial room to start in.
     */
    constructor(pluginManager){
        super('Dungeon', pluginManager);
    }

    /**
     * Initialize the plugin.
     * Sets up internal room maps and initial current room key.
     *
     * @param {string|number} [data] - Optional initial room key to start in. Defaults to 1 if falsy.
     * @returns {void}
     */
    init(data){
        // Load and map rooms to their key
        this.#initializeRooms();
        this.currentRoomKey = data || 1;
        this.roomsExplored = new Set();
        this.roomsExplored.add(this.currentRoomKey);
    }

    /**
     * Initialize all dungeon's rooms by fetching each room's JSON file.
     * Each fetched room object will receive their connections from the roomsConfig entry.
     *
     * @private
     * @returns {void}
     */
    #initializeRooms(){
        this.#rooms = new Map();
        this.#resetableRooms = new Map();

        getTiledMapLayer(roomsConfig, "Dungeon").forEach(async (cfg) => {
            const path = 'assets/rooms/rooms/' + cfg.type;
            const response = await fetch(path);
            // Read JSON with template for the room being created
            const room = await response.json();

            // Give generic room the specific dungeon connections
            room.connections = cfg.properties;
            // Add room to the map of rooms
            this.#rooms.set(cfg.id, room);
            // If the room is the Hub we save it
            if(cfg.name == "Hub"){
                this.#hubID = cfg.id;
                this.#hubPath = path;
            }
            // If the room is the beginning of the tutorial we save it
            else if(cfg.name == "Intro"){
                this.#tutorialIntroID = cfg.id;
            }
            // If the room is any other room (dungeon rooms) we save them to then only reset these rooms when dungeon restarts
            else{
                this.#resetableRooms.set(cfg.id, path);
            }
        });
    }

    /**
     * Reset the dungeon rooms (resets everything but the Hub and Intro scenes)
     * @private
     * @returns {void}
     */
    #resetDungeon(){
        EventBus.emit("dungeonReset");
        this.#resetableRooms.forEach(async (path, id)=>{
            const response = await fetch(path);
            // Read JSON with template for the room being created
            const room = await response.json();

            const prevRoom = this.#rooms.get(id);
            // Give the new room the previous room connections
            room.connections = prevRoom.connections;

            // Overwrite previous values in the map of rooms
            this.#rooms.set(id, room);
        });
    }

    /**
     * Reset the hub (resets only the hub)
     * @private
     * @returns {void}
     */
    async #resetHub(){
        EventBus.emit("hubReset");
        const response = await fetch(this.#hubPath);
        // Read JSON with template for the room being created
        const room = await response.json();

        const prevRoom = this.#rooms.get(this.#hubID);
        // Give the new room the previous room connections
        room.connections = prevRoom.connections;

        // Overwrite previous values in the map of rooms
        this.#rooms.set(this.#hubID, room);
    }

    /**
     * Populate the given Phaser scene with the current room's obstacles and connections.
     *
     * @param {Phaser.Scene} scene - The scene where objects will be created.
     * @param {Phaser.GameObjects.Group|Phaser.Physics.Arcade.Group} obstaclesGroup - Group to add obstacle instances to.
     * @param {Phaser.GameObjects.Sprite} player - Player object used for overlap checks with connections.
     * @returns {void}
     */
    loadCurrentRoom(scene, obstaclesGroup){
        scene.logger.log('DUNGEON', 1, 'Loading room ...');

        // listen to when an item is picked to remove it from room instance data
        EventBus.on('itemPicked', (picker, item)=>{
            this.removeItemFromCurrentRoom(item.id);
        })

        // listen to when an enemy is killed to removeit from room instance data
        EventBus.on('entityDied', (entity)=>{
            if(entity.type == 'enemy' || entity.type == 'boss')
            {
                this.removeEnemyFromCurrentRoom(entity.id)
                this.#roomEnemiesCounter--;
                if(this.#roomEnemiesCounter == 0){
                    EventBus.emit('roomCleared');
                }
            }
        })

        EventBus.on("changeRoom", this.changeRoom, this);

        EventBus.on("spawnObstacle", (data)=>createObstacle(scene, data))
        EventBus.on("spawnItem", (data)=>createItem(scene, data, this.roomsExplored.length))
        EventBus.on("spawnEnemy", (data)=>createEnemy(scene, data))

        // Get current dungeon room
        const room = this.#rooms.get(this.currentRoomKey);
        // Read JSON object to populate scene
        this.readTiledJSON(scene, room);

        // If the room has no enemies, emit 'roomCleared'
        if(this.#roomEnemiesCounter == 0) EventBus.emit('roomCleared');
    }

    /**
     * Parse a Tiled room JSON and instantiate its objects into the provided scene.
     *
     * @param {Phaser.Scene} scene - Scene where objects should be created.
     * @param {Object} room - Tiled room JSON object.
     * @returns {void}
     */
    readTiledJSON(scene, room){
        // Set background color specified in Tiled (only the main camera)
        // console.log(this.currentRoomKey);
        // console.log(this.#rooms);
        // console.log(this.#rooms.get(this.currentRoomKey));
        scene.cameras.main.setBackgroundColor(room.backgroundcolor);

        // Fix polygon coordinates used as enemy routes
        // Explanation: Points in polygons have a "local position" in the polygon, not the actual world coordinates
        //              For that reason, why first fix the enemy routes and them give them to the enemies how want them
        // Why Polygons then? Because it's far better than setting points by hand
        getTiledMapLayer(room, "Enemy Routes")?.forEach(route=>{
            route.polygon.forEach(point=>{
                point.x += route.x;
                point.y += route.y;
            })
        });

        // We use each layer in tiled to filter the types of object to be instantiated
        // Each factory handles whatever they have to do to create the object
        room.layers.forEach((layer)=>{
            switch(layer.name){
                case "Obstacles":
                    scene.logger.log('DUNGEON', 1, 'Creating obstacles ...');
                    layer.objects.forEach((obj)=>{
                        // Choose random obstcle from list given
                        const types = obj.type.split(" ");
                        obj.type = types[Math.floor(Math.random()*types.length)];
                        createObstacle(scene, obj)
                    });
                    break;
                case "Items":
                    scene.logger.log('DUNGEON', 1, 'Creating items ...');
                    layer.objects.forEach((item)=>{
                        // Choose random item from list given
                        const types = item.type.split(" ");
                        item.type = types[Math.floor(Math.random()*types.length)];
                        createItem(scene, item, this.roomsExplored.size)
                    });
                    break;
                case "Enemies":
                    scene.logger.log('DUNGEON', 1, 'Creating enemies ...');
                    layer.objects.forEach((enemy)=>{
                        // Choose random enemy from list given
                        const types = enemy.type.split(" ");
                        enemy.type = types[Math.floor(Math.random()*types.length)];
                        createEnemy(scene, enemy, getTiledMapLayer(room, "Enemy Routes"))
                    });
                    this.#roomEnemiesCounter = layer.objects.length;
                    break;
                case "NPCs":
                    scene.logger.log('DUNGEON', 1, 'Creating NPCs ...');
                    layer.objects.forEach((npc)=>{
                        // Choose random npc from list given
                        const types = npc.type.split(" ");
                        npc.type = types[Math.floor(Math.random()*types.length)];
                        createNPC(scene, npc);
                    });
                case "Scattering":
                    scene.logger.log('DUNGEON', 1, 'Creating scattered objects ...');
                    layer.objects.forEach((scattering)=>{this.createScatteredObjects(scene, scattering)});
                    break;
                case "World Borders":
                    scene.logger.log('DUNGEON', 1, 'Creating world borders objects ...');
                    layer.objects.forEach((worldBorder)=>{this.createWorldBorder(scene, worldBorder);});
                default:
                    break;
            }
        })

        scene.logger.log('DUNGEON', 1, 'Creating connections ...');
        // Create every connection in scene
        room.connections?.forEach(connectionSceneData => createConnection(scene, this, connectionSceneData.value));
    }

    /**
     * Create a rectangular world border object in the scene using Matter physics.
     *
     * @param {Phaser.Scene} scene - Scene where border will be created.
     * @param {Object} worldBorder - Tiled object describing the border (expects x, y, width, height).
     * @returns {void}
     */
    createWorldBorder(scene, worldBorder) {
        const border = scene.add.rectangle(worldBorder.x + worldBorder.width / 2, worldBorder.y + worldBorder.height / 2, worldBorder.width, worldBorder.height, 0)
            .setVisible(false);
        scene.matter.add.gameObject(border, {
            "shape": {
                "type": "rectangle",
                "width": worldBorder.width,
                "height": worldBorder.height
            },
            isStatic: true,
        });
        border.setCollisionCategory(scene.obstaclesCategory);
    }

    /**
     * Generate scattered obstacle objects inside a rectangular area defined in Tiled.
     *
     * @param {Phaser.Scene} scene - Scene where objects will be created.
     * @param {Object} scatterData - Tiled object defining area and types (expects x, y, width, height, type and custom property 'fill').
     * @returns {void}
     */
    createScatteredObjects(scene, scatterData) {
        const types = scatterData.type.split(" ");
        // Generates scattered objects from a rectangle defined in Tiled
        for(let i = 0; i < getCustomTiledProperty(scatterData, "fill"); ++i){
            let posX;
            let posY;
            if(!scatterData.ellipse){
                posX = Math.random()*scatterData.width+scatterData.x;
                posY = Math.random()*scatterData.height+scatterData.y;
            }
            else{
                const angle = Math.random()*2*Math.PI;
                posX = scatterData.x + Math.cos(angle) * scatterData.width*Math.random() + scatterData.width/2;
                posY = scatterData.y + Math.sin(angle) * scatterData.height*Math.random() + scatterData.height/2;
            }

            const obj = createObstacle(scene, {
                x: posX,
                y: posY,
                // Get random type from all specified types
                type: types[Math.floor(Math.random()*types.length)]
            });
        }
    }

    /**
     * Remove an item from the current room's Tiled data after it has been picked.
     *
     * @param {number} itemID - ID of the item to remove.
     * @returns {void}
     */
    removeItemFromCurrentRoom(itemID){
        // Get current room
        const currentRoom = this.#rooms.get(this.currentRoomKey);
        // Get items in room
        const items = getTiledMapLayer(currentRoom, "Items");
        if(items){
            // Get index of id given
            const itemIdx = items.findIndex((item)=>item.id == itemID);
            // Remove the item from the room data
            if(itemIdx != -1) items.splice(itemIdx, 1);
        }
    }

    /**
     * Remove an enemy from the current room's Tiled data after it has died.
     *
     * @param {number} enemyID - ID of the enemy to remove.
     * @returns {void}
     */
    removeEnemyFromCurrentRoom(enemyID){
        // Get current room
        const currentRoom = this.#rooms.get(this.currentRoomKey);
        // Get enemies in room
        const enemies = getTiledMapLayer(currentRoom, "Enemies");
        if(enemies){
            // Get index of id given
            const enemyIdx = enemies.findIndex((enemy)=>enemy.id == enemyID);
            // Remove the enemy from the room data
            if(enemyIdx != -1) enemies.splice(enemyIdx, 1);
        }
    }

    /**
     * Change the current active room.
     * If leaving the hub, the hub is reset. If entering the hub, the dungeon is reset and 'hubReached' event emitted.
     *
     * @param {number|string} nextRoomKey - Key/ID of the room to switch to.
     * @returns {void}
     */
    changeRoom(nextRoomKey){
        // If previous room was hub, then we can reload the hub now that we left it
        if(this.currentRoomKey == this.#hubID){
            this.#resetHub();
        }
        // Update current room key
        this.currentRoomKey = nextRoomKey;
        // Add room to explored rooms set
        this.roomsExplored.add(this.currentRoomKey);

        // If we have changed room to the hub, reset the dungeon no that we left it
        if(nextRoomKey == this.#hubID){
            EventBus.emit('hubReached');
            // reset dungeon exploration
            this.roomsExplored.clear();
            this.roomsExplored.add(nextRoomKey); // Add hub to the explored rooms (always starts with hub)
            this.#resetDungeon(); // Restart all the dungeon
            saveDataManager.setData('isTutorialComplete', true);
        }
    }

    /**
     * Return the player to the appropriate hub room depending on tutorial completion.
     *
     * @returns {void}
     */
    returnToHub(){
        if(saveDataManager.getData('isTutorialComplete'))
        {
            // If tutorial is complete return to normal hub
            this.changeRoom(this.#hubID);
        }
        else{
            // If tutorial isn't complete return to tutorial hub
            this.changeRoom(this.#tutorialIntroID);
        }
    }
}
