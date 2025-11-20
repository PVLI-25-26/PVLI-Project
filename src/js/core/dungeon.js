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

import roomsConfig from '../../configs/Rooms/rooms.json'
import { createConnection } from './factories/connection-factory.js';
import { createEnemy } from "./factories/enemy-simple-fabric.js";
import { createItem } from './factories/item-factory.js';
import { createObstacle } from './factories/obstacle-factory.js';

/**
 * Manages dungeon rooms and instantiation of room objects into a Phaser scene.
 *
 * Notes:
 * - Room JSONs referenced by configs/Rooms/rooms.json are fetched at initialization.
 */
class Dungeon {
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
     * Create a Dungeon manager.
     * @param {string} initialRoomKey - Key of the initial room to start in.
     */
    constructor(initialRoomKey){
        // Load and map rooms to their key
        this.#initializeRooms();
        this.currentRoomKey = initialRoomKey;
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
        roomsConfig.forEach(async (cfg) => {
            const response = await fetch('assets/rooms/'+cfg.path);
            // Read JSON with template for the room being created
            const room = await response.json();
            // Give generic room the specific dungeon connections
            room.connections = cfg.connections;
            // Add room to the map of rooms
            this.#rooms.set(cfg.key, room);
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
        
        scene.logger.log('DUNGEON', 1, 'Getting room ...');
        // Get current dungeon room
        const room = this.#rooms.get(this.currentRoomKey);

        scene.logger.log('DUNGEON', 1, 'Creating obstacles ...');
        // Create obstacles in scene
        room.obstacles.forEach(objSceneData => createObstacle(scene, objSceneData));

        scene.logger.log('DUNGEON', 1, 'Creating items ...');
        // Create items in scene
        room.items.forEach(itemSceneData => createItem(scene, itemSceneData));

        scene.logger.log('DUNGEON', 1, 'Creating connections ...');
        // Create every connection in scene
        room.connections.forEach(connectionSceneData => createConnection(scene, this, connectionSceneData));
        
        scene.logger.log('DUNGEON', 1, 'Creating enemies ...');
        // Create every enemy in scene
        room.enemies.forEach(enemyData => createEnemy(scene, enemyData));

        scene.logger.log('DUNGEON', 1, 'Creating scattered objects ...');
        // Scatter objects around the scene
        this.createScatteredObjects(scene, obstaclesGroup);
    }

    createScatteredObjects(scene, obstaclesGroup) {
        for (let i = 0; i < 100; ++i) {
            const grass = createObstacle(scene, { x: Math.random() * 700 - 350, y: Math.random() * 700 - 350, key: "Grass" });
            grass.setFlipX(Math.floor(Math.random() * 2));
        }
        for (let i = 0; i < 600; i++) {

            let x = Math.random() * 1500 - 750;
            let y = Math.random() * 1500 - 750;
            if ((x < -350 || x > 350) || (y < -350 || y > 350)) {
                const tree = createObstacle(scene, { x: x, y: y, key: "Tree" });
                tree.setFlipX(Math.floor(Math.random() * 2));
                tree.setCollisionCategory(obstaclesGroup);
            }
        }
    }
}

export default new Dungeon('hub');