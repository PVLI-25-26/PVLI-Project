import { ObstacleBillboard } from "../../entities/ObstacleBillboard";
import { Obstacle } from "../../entities/Obstacle";
import obstaclesConfig from '../../../configs/obstacles-config.json'

const obstacleTemplates = new Map();
obstaclesConfig.forEach(cfg =>{
    obstacleTemplates.set(cfg.key, cfg);
});

export function createObstacle(scene, objSceneData){
    let obstacle;
    let obstacleTemplate = obstacleTemplates.get(objSceneData.type);
    if (obstacleTemplate.billboardConfig){
        obstacle = new ObstacleBillboard(scene, objSceneData.x, objSceneData.y, obstacleTemplate);
    }
    else if(obstacleTemplate.spriteStackConfig){
        obstacle = new Obstacle(scene, objSceneData.x, objSceneData.y, obstacleTemplate);
        console.log("Added obstacle to world layer:", obstacle);
        obstacle.setAngle(objSceneData.rotation);
    }
    else{
        scene.plugins.get('logger').log('LOADING', 3, "Couldn't make obstacle without billboard or spritestack config");
    }
    if(obstacleTemplate.physicsConfig) obstacle.setCollisionCategory(scene.obstaclesCategory);

    // scene.worldLayer.add(obstacle);
    return obstacle
}