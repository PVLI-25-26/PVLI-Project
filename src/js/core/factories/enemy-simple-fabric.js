import basicEnemyConfig from "../../../configs/Enemies/basic-enemy-config.json";
import { BasicEnemy } from "../../entities/Enemies/BasicEnemy.js";
import { getCustomTiledProperty, getTiledObject } from "../tiled-parser.js";

const ENEMY_GLOBAL_CONFIGS = {
    "basic": basicEnemyConfig
};

const ENEMY_TYPES = {
  "basic": BasicEnemy,
};

export function createEnemy(scene, enemyData, patrolRoutes) {
    const EnemyClass = ENEMY_TYPES[enemyData.type];
    if (!EnemyClass) throw new Error(`Unknown enemy type: ${enemyData.type}`);

    const enemyGlobalConfig = ENEMY_GLOBAL_CONFIGS[enemyData.type];
    if (!enemyGlobalConfig) throw new Error(`Missing global config for ${enemyData.type}`);

    // Merge global config with enemy scene-specific data
    const finalConfig = {
        ...enemyGlobalConfig,
        ...enemyData
    };

    // Get enemy patrol route and add it to its config properties
    const enemyRoute = getTiledObject(patrolRoutes, (getCustomTiledProperty(enemyData, "PatrolRoute")));
    finalConfig.patrolRoute = enemyRoute.polygon;
    const enemy = new EnemyClass(scene, enemyData.x, enemyData.y, enemyData.id, finalConfig);

    enemy.setCollisionCategory(scene.enemiesCategory);

    return enemy;
}
