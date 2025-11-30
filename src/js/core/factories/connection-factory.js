import { EventBus } from "../event-bus";

export function createConnection(scene, dungeon, connectionSceneData){
    const connection = scene.matter.add.sprite(connectionSceneData.x, connectionSceneData.y, "player", null, {
                shape: {
                    type: "rectangle",
                    width: 48,
                    height: 48
                },
                isStatic: true,
                isSensor: true
            });
    connection.setCollisionCategory(scene.connectionsCategory);
    
    // When player overlaps connection change room
    connection.setOnCollide(()=>{
        dungeon.changeRoom(connectionSceneData.scene);
        scene.logger.log('DUNGEON', 1, `Entering room: ${connectionSceneData.scene}`);
        
        scene.scene.restart({sceneName: connectionSceneData.scene, playerSpawn: {x:connectionSceneData.spawnX, y:connectionSceneData.spawnY}});
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