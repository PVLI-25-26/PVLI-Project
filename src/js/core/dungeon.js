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
import { getCustomTiledProperty, getTiledMapLayer } from './tiled-parser.js';

/**
 * Manages dungeon rooms and instantiation of room objects into a Phaser scene.
 *
 * Notes:
 * - Room JSONs referenced by configs/Rooms/rooms.json are fetched at initialization.
 */
export class Dungeon extends Phaser.Plugins.BasePlugin {
    /**
     * Map of dungeon rooms [key -> RoomConfig]
     * @type {Map<string, RoomInstance>}
     */
    #rooms;
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
     */
    #hubID

    /**
     * Create a Dungeon manager.
     * @param {string} initialRoomKey - Key of the initial room to start in.
     */
    constructor(pluginManager){
        super('Dungeon', pluginManager);
    }

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
        // Create all dungeon rooms from the template rooms and their configs in roomsConfig
        getTiledMapLayer(roomsConfig, "Dungeon").forEach(async (cfg) => {
            const response = await fetch('assets/rooms/rooms/'+cfg.type);
            // Read JSON with template for the room being created
            const room = await response.json();
            // Give generic room the specific dungeon connections
            room.connections = cfg.properties;
            // Add room to the map of rooms
            this.#rooms.set(cfg.id, room);
            // If the room is the Hub we save it
            if(cfg.name == "Hub")
                this.#hubID = cfg.id;
        });
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
            if(entity instanceof BasicEnemy)
            {
                this.removeEnemyFromCurrentRoom(entity.id)
            }
        })

        // Get current dungeon room
        const room = this.#rooms.get(this.currentRoomKey);

        // Read JSON object to populate scene
        this.readTiledJSON(scene, room);
    }

    readTiledJSON(scene, room){
        // Set background color specified in Tiled (only the main camera)
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
                    layer.objects.forEach((obj)=>{createObstacle(scene, obj)});
                    break;
                case "Items":
                    scene.logger.log('DUNGEON', 1, 'Creating items ...');
                    layer.objects.forEach((item)=>{createItem(scene, item, this.roomsExplored.size)});
                    break;
                case "Enemies":
                    scene.logger.log('DUNGEON', 1, 'Creating enemies ...');
                    layer.objects.forEach((enemy)=>{createEnemy(scene, enemy, getTiledMapLayer(room, "Enemy Routes"))});
                    break;
                case "NPCs":
                    scene.logger.log('DUNGEON', 1, 'Creating NPCs ...');
                    layer.objects.forEach((npc)=>{createNPC(scene, npc)});
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

    createScatteredObjects(scene, scatterData) {
        const types = scatterData.type.split(" ");
        // Generates scattered objects from a rectangle defined in Tiled
        for(let i = 0; i < getCustomTiledProperty(scatterData, "fill"); ++i){
            const obj = createObstacle(scene, {
                x: Math.random()*scatterData.width+scatterData.x,
                y: Math.random()*scatterData.height+scatterData.y,
                // Get random type from all specified types
                type: types[Math.floor(Math.random()*types.length)]
            });
        }
    }

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

    changeRoom(nextRoomKey){
        this.currentRoomKey = nextRoomKey;
        this.roomsExplored.add(this.currentRoomKey);
        if(nextRoomKey == this.#hubID){
            EventBus.emit('hubReached');
        }
    }
}