/**
 * Particle emitter for short-lived buff effects that orients emission to the camera.
 *
 * The emitter spawns particles around a target position, offset according to the current camera rotation
 * so particles appear to emit "up" relative to the camera. The emitter automatically fades and destroys
 * itself after the provided duration.
 */
export class BuffParticleEmitter {
    /**
     * Create a BuffParticleEmitter.
     * @param {Phaser.Scene} scene - The Phaser scene instance.
     * @param {{x:number,y:number}} target - Target object or position used as the emission origin (must have x and y).
     * @param {string} texture - Key of the particles texture atlas/spritesheet used by the emitter.
     * @param {number} duration - Duration in milliseconds before the emitter is faded out and destroyed.
     * @param {number} speed - Base particle speed (used to compute per-axis speed depending on camera rotation).
     * @param {number} width - Horizontal spread width (in world units) around the target where particles spawn.
     * @param {number} [frameMin=0] - Minimum frame index for particle frames (if using an atlas/spritesheet).
     * @param {number} [frameMax=0] - Maximum frame index for particle frames (if using an atlas/spritesheet).
     */
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
                this.remove();
            }
        });
        
    }

    /**
     * Immediately stop and remove the emitter with a short fade tween.
     *
     * This clears the scheduled timer and starts a fade tween to destroy the particle manager.
     */
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