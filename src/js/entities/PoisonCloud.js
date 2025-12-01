/**
 * Cloud that applies poison (or anything actually) to all enemies in an area
 */
export class PoisonCloud{
    /**
     * 
     * @param {*} scene Scene to spawn the cloud
     * @param {*} x x coordinate to spawn the cloud in the scene
     * @param {*} y y coordinate to spawn the cloud in the scene
     * @param {*} poisonEffect effect to apply when an enemy enters
     */
    constructor(scene, x, y, poisonEffect){
        this.scene = scene;

        // Create area of effect for poison cloud
        const poisonzone = this.scene.add.zone(x, y);
        scene.matter.add.gameObject(poisonzone, {
            shape:{
                type: "circle",
                radius: 100
            },
            isSensor: true,
            isStatic: true
        });

        // Set timer to destroy cloud 
        this.scene.time.addEvent({
            delay: 5000,
            callback: ()=>{poisonzone.destroy(true);}
        })

        // Set collisions with player and enemy
        poisonzone.setCollidesWith([this.scene.playerCategory, this.scene.enemiesCategory]);
        poisonzone.setOnCollide((pair)=>{
            const entity = pair.bodyA.gameObject;
            entity.emit('buffApplied', poisonEffect);
        });
        poisonzone.setOnCollideEnd((pair)=>{
            const entity = pair.bodyA.gameObject;
            entity.emit('buffRemoved', poisonEffect.type)
        });
    }
}