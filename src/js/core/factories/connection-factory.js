import { EventBus } from "../event-bus";
import {createObstacle} from "./obstacle-factory"

export function createConnection(scene, dungeon, connectionSceneData){
    const portalData = {

        type: 'portal',
        x: connectionSceneData.x,
        y: connectionSceneData.y,
        rotation: connectionSceneData.rotation,
    }
    const connection = createObstacle(scene,portalData);
    connection.setCollisionCategory(scene.connectionsCategory);
    
    // When player overlaps connection change room
    connection.setOnCollide(()=>{
        
        dungeon.changeRoom(connectionSceneData.scene);
        scene.logger.log('DUNGEON', 1, `Entering room: ${connectionSceneData.scene}`);

        // Fade out camera and change sceen (this code shouldn't be here, but idk where to put it)
        scene.cameras.main.fadeOut(800,79,74,69, (cam, progr)=>{
            if(progr >= 1){
                scene.scene.restart({sceneName: connectionSceneData.scene, playerSpawn: {x:connectionSceneData.spawnX, y:connectionSceneData.spawnY}});
            }
        });
    });
    // Connections appear when the room is cleared
    connection.setActive(false);
    connection.setVisible(false);
    connection.setCollidesWith(0);
    EventBus.on('roomCleared', ()=>{
        scene.logger.log('DUNGEON', 1, `Room cleared`);
        connection.setActive(true);
        connection.setVisible(true);
        connection.setCollidesWith(scene.playerCategory);
    })

    return connection;
}