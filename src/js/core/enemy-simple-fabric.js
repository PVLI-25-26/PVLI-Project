import basicEnemyConfig from "../../configs/Enemies/basic-enemy-config.json";
import { BasicEnemy } from "../entities/Enemies/BasicEnemy.js";

const ENEMY_GLOBAL_CONFIGS = {
    "basic": basicEnemyConfig
};

const ENEMY_TYPES = {
  "basic": BasicEnemy,
};

export function createEnemy(scene, enemyData) {
    const EnemyClass = ENEMY_TYPES[enemyData.type];
    if (!EnemyClass) throw new Error(`Unknown enemy type: ${enemyData.type}`);

    const enemyGlobalConfig = ENEMY_GLOBAL_CONFIGS[enemyData.type];
    if (!enemyGlobalConfig) throw new Error(`Missing global config for ${enemyData.type}`);

    // Merge global config with enemy scene-specific data
    const finalConfig = {
        ...enemyGlobalConfig,
        ...enemyData
    };

    const enemy = new EnemyClass(scene.matter.world, enemyData.pos.x, enemyData.pos.y, finalConfig);

    return enemy;
}
