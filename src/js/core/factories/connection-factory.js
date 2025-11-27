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
    connection.setCollidesWith(scene.playerCategory);
    // When player overlaps connection change room
    connection.setOnCollide(()=>{
        dungeon.changeRoom(connectionSceneData.scene);
        scene.logger.log('DUNGEON', 1, `Entering room: ${connectionSceneData.scene}`);
        scene.scene.restart({sceneName: connectionSceneData.scene, playerSpawn: {x:connectionSceneData.spawnX, y:connectionSceneData.spawnY}});
    });

    return connection;
}