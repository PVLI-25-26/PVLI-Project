import basicEnemyConfig from "../../../configs/Enemies/basic-enemy-config.json";
import elementalConfig from "../../../configs/Enemies/elemental-config.json";
import dryadConfig from "../../../configs/Enemies/dryad-config.json";
import golemConfig from "../../../configs/Enemies/golem-config.json";
import slimeConfig from "../../../configs/Enemies/slime-config.json";
import bossConfig from "../../../configs/Enemies/boss-config.json";
import { BasicEnemy } from "../../entities/Enemies/BasicEnemy.js";
import { Elemental } from "../../entities/Enemies/Elemental.js";
import { Dryad } from "../../entities/Enemies/Dryad.js";
import { Golem } from "../../entities/Enemies/Golem.js";
import { Slime } from "../../entities/Enemies/Slime.js";
import { Boss } from "../../entities/Enemies/Boss.js";
import { getCustomTiledProperty, getTiledObject } from "../tiled-parser.js";

const ENEMY_GLOBAL_CONFIGS = {
    "basic": basicEnemyConfig,
    "elemental": elementalConfig,
    "dryad": dryadConfig,
    "golem": golemConfig,
    "slime": slimeConfig,
    "boss": bossConfig
};

const ENEMY_TYPES = {
    "basic": BasicEnemy,
    "elemental": Elemental,
    "dryad": Dryad,
    "golem": Golem,
    "slime": Slime,
    "boss": Boss
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
    finalConfig.patrolRoute = enemyRoute?.polygon;
    const enemy = new EnemyClass(scene, enemyData.x, enemyData.y, enemyData.id, finalConfig);

    enemy.setCollisionCategory(scene.enemiesCategory);

    return enemy;
}
