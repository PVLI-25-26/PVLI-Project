/**
 * @typedef {Object} ObstacleInstance
 * @property {string} key - Template key for the obstacle (matches obstacles-config).
 * @property {number} x - X position in the room.
 * @property {number} y - Y position in the room.
 * @property {number} r - Rotation in degrees.
 */

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

/**
 * @typedef {Object} ObstacleTemplate
 * @property {string} key - Obstacle template key.
 * @property {*} [properties] - Other template-specific properties (sprite, size, etc.).
 */

import roomsConfig from '../../configs/Rooms/rooms.json'
import obstaclesConfig from '../../configs/obstacles-config.json'
import { BillBoard } from '../entities/BillBoard.js';
import { Obstacle } from '../entities/Obstacle.js';
import { createEnemy } from "./enemy-simple-fabric.js";
import { ObstacleBillboard } from '../entities/ObstacleBillboard.js';

/**
 * Manages dungeon rooms and instantiation of room objects into a Phaser scene.
 *
 * Notes:
 * - Room JSONs referenced by configs/Rooms/rooms.json are fetched at initialization.
 * - The fetched room objects should match RoomConfig shape (obstacles, connections).
 */
class Dungeon {
    /**
     * Map of obstacle templates [key -> ObstacleConfig]
     * @type {Map<string, ObstacleTemplate>}
     */
    #obstacles;
    /**
     * Map of dungeon rooms [key -> RoomConfig]
     * @type {Map<string, RoomInstance>}
     */
    #rooms;
    /**
     * Current active room key.
     * @type {string}
     */
    #currentRoomKey;

    /**
     * Create a Dungeon manager.
     * @param {string} initialRoomKey - Key of the initial room to start in.
     */
    constructor(initialRoomKey){
        // Map object and room configs to keys to reuse them for every room
        this.#initializeObstacles();
        this.#initializeRooms();
        this.#currentRoomKey = initialRoomKey;
    }
    /**
     * Initialize the obstacle templates map from obstacles-config.json.
     * Populates this.#obstacles with entries keyed by template key.
     * @private
     * @returns {void}
     */
    #initializeObstacles(){
        this.#obstacles = new Map();
        obstaclesConfig.forEach(cfg =>{
            this.#obstacles.set(cfg.key, cfg);
        });
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
            console.log(response.body);
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
    loadCurrentRoom(scene, obstaclesGroup, enemiesGroup, player){
        scene.logger.log('DUNGEON', 1, 'Loading scene data...');
        // Create every object from the room config
        const room = this.#rooms.get(this.#currentRoomKey);

        room.obstacles.forEach(obj =>{
            let obstacle;
            if (obj.type== "billboard"){
                obstacle = new ObstacleBillboard(scene,obj.x,obj.y,this.#obstacles.get(obj.key));
            }
            else{
                obstacle = new Obstacle(scene, obj.x, obj.y, this.#obstacles.get(obj.key));
            }
            obstacle.setRotation(obj.r*Math.PI/180);
            obstaclesGroup.add(obstacle);
        });

        // Create every connection from the room config
        room.connections.forEach(con =>{
            const connection = scene.add.sprite(con.x, con.y);
            scene.physics.add.existing(connection, true);
            // When player overlaps connection change room
            scene.physics.add.overlap(player, connection, ()=>{
                this.#currentRoomKey = con.scene;
                scene.logger.log('DUNGEON', 1, `Entering room: ${con.scene}`);
                scene.scene.restart({sceneName: con.scene, playerSpawn: {x:con.spawnX, y:con.spawnY}});
            });
        });
        
        room.enemies.forEach(enemyData => {
            const enemy = createEnemy(scene, enemyData);
            scene.physics.add.collider(enemy, enemiesGroup);
            enemiesGroup.add(enemy);
        });
    }
}

export default new Dungeon('hub');