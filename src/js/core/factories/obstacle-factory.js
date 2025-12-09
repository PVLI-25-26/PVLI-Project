import { ObstacleBillboard } from "../../entities/ObstacleBillboard";
import { Obstacle } from "../../entities/Obstacle";
import obstaclesConfig from '../../../configs/obstacles-config.json'

/**
 * Template object loaded from obstacles-config.json describing how to build an obstacle.
 * @typedef {Object} ObstacleTemplate
 * @property {string} key - Unique template key.
 * @property {Object} [billboardConfig] - Configuration used to create an ObstacleBillboard (visual + optional animation).
 * @property {Object} [spriteStackConfig] - Configuration used to create a stacked-sprite Obstacle.
 * @property {Object} [physicsConfig] - Optional physics configuration (collision shape, etc.).
 */

/**
 * Scene data describing an obstacle instance to create.
 * This usually comes from a room JSON describing object placement.
 * @typedef {Object} ObjSceneData
 * @property {number} x - X world position.
 * @property {number} y - Y world position.
 * @property {string} type - Template key referencing an ObstacleTemplate.
 * @property {number} [rotation] - Optional rotation in degrees/radians depending on usage.
 */

/**
 * Internal map of obstacle template key -> ObstacleTemplate.
 * @type {Map<string, ObstacleTemplate>}
 */
const obstacleTemplates = new Map();
obstaclesConfig.forEach(cfg =>{
    obstacleTemplates.set(cfg.key, cfg);
});

/**
 * Create an obstacle instance from scene placement data.
 *
 * The function chooses between ObstacleBillboard and Obstacle (sprite stack) depending on
 * the template fields present. If a physicsConfig is present on the template, the created
 * obstacle will be assigned the scene's obstacles collision category.
 *
 * @param {Phaser.Scene} scene - Phaser scene used to construct GameObjects and access plugins.
 * @param {ObjSceneData} objSceneData - Placement data describing which template to use and where.
 * @returns {Obstacle|ObstacleBillboard|undefined} Newly created obstacle instance, or undefined if creation failed.
 */
export function createObstacle(scene, objSceneData){
    let obstacle;
    let obstacleTemplate = obstacleTemplates.get(objSceneData.type);
    if (obstacleTemplate.billboardConfig){
        obstacle = new ObstacleBillboard(scene, objSceneData.x, objSceneData.y, obstacleTemplate);
    }
    else if(obstacleTemplate.spriteStackConfig){
        obstacle = new Obstacle(scene, objSceneData.x, objSceneData.y, obstacleTemplate);
        obstacle.setAngle(objSceneData.rotation);
    }
    else{
        scene.plugins.get('logger').log('LOADING', 3, "Couldn't make obstacle without billboard or spritestack config");
    }
    if(obstacleTemplate.physicsConfig) obstacle.setCollisionCategory(scene.obstaclesCategory);

    return obstacle
}