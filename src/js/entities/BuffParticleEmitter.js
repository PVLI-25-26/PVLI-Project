export class BuffParticleEmitter {
    constructor(scene, target, texture, duration, speed, width, frameMin = 0, frameMax = 0){
        this.scene = scene;
        
        // Create emitter
        this.emitter = scene.add.particles(0, 0, texture, {
            speedY: {
                onEmit: (particle, key, t, value)=> {
                    // Make particles go up depending on camera rotation
                    const camRot = scene.cameras.main.rotation;
                    return -speed*Math.cos(camRot)
                }
            },
            speedX: {
                onEmit: (particle, key, t, value)=> {
                    // Make particles go up depending on camera rotation
                    const camRot = scene.cameras.main.rotation;
                    return -speed*Math.sin(camRot)
                }
            },
            x:{
                onEmit: (particle, key, t, value)=> {
                    // Choose random horizontal pos (horizontal from camera perspective) in target given
                    const camRot = scene.cameras.main.rotation;
                    return ((Math.random()*2-1)*width)*Math.cos(camRot) + target.x;
                }
            },
            y:{
                onEmit: (particle, key, t, value)=> {
                    // Choose random horizontal pos (horizontal from camera perspective) in target given
                    const camRot = scene.cameras.main.rotation;
                    return ((Math.random()*2-1)*width)*Math.sin(camRot) + target.y;
                }
            },
            rotate: {
                // Rotate particle to camera rotation
                onEmit: (particle, key, t, value)=> {
                    const camRot = scene.cameras.main.rotation;
                    return -camRot*180/Math.PI;
                }
            },
            frame: {min: frameMin, max: frameMax},
            scale: 2,
            lifespan: {min: 200, max: 300},
            alpha: {start: 1, end: 0},
            emitting: true,
            maxAliveParticles: 10
        });

        // Set timer to destroy particles 
        this.timer = scene.time.addEvent({
            delay: duration,
            callback: ()=>{
                scene.tweens.add({
                    targets: this.emitter,
                    alpha: 0,
                    duration: 150,
                    onComplete: ()=>{
                        this.emitter.destroy(true);
                    }
                })
            }
        });
        
    }

    remove(){
        this.timer.remove();
        this.scene.tweens.add({
            targets: this.emitter,
            alpha: 0,
            duration: 150,
            onComplete: ()=>{
                this.emitter.destroy(true);
            }
        })
    }
}