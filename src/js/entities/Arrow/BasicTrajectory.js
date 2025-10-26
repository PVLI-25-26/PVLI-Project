import { EventBus } from "../../core/event-bus";

export class BasicTrajectory {
    #gravityStr;
    #scene;
    #airTime = 750;
    #isFlying = true;
    #arrow;

    constructor(gravityStrength, scene){
        this.#gravityStr = gravityStrength;
        this.#scene = scene;
    }

    shoot(arrow, camRotation){
        let logger = this.#scene.plugins.get('logger');
        this.#arrow = arrow;
        // To normalize direction
        let targetLength = Math.sqrt(arrow.target.x * arrow.target.x + arrow.target.y * arrow.target.y);
        
        // To make fake "auto aiming"
        let offSet = -100;

        // calculate final velocity
        let a = arrow.power/targetLength; // Saving time by doing this for both axes
        let vX = arrow.target.x*a;
        let vY = arrow.target.y*a + offSet;

        // apply velocities
        arrow.body.setVelocity(vX, vY);
        this.updateAcceleration(camRotation, Math.cos(-camRotation), Math.sin(-camRotation));

        // End arrow flight at a certain time
        this.#scene.time.delayedCall(this.#airTime, ()=>{
            this.stopFlying();
            EventBus.emit('arrowLanded', this.#arrow);
        });

        EventBus.on('cameraRotated', this.updateAcceleration, this);
    }

    update(time, delta){
        // While flight is on going, update rotation to the trajectory
        if(this.#isFlying) this.#arrow.rotation = this.#arrow.body.angle;
    }

    onCollision(){
        this.stopFlying();
    }

    updateAcceleration(R, cosR, sinR){
        // Update acceleration when camera is rotated
        this.#arrow.body.setAcceleration(-sinR*this.#gravityStr, cosR*this.#gravityStr);
    }

    stopFlying(){
        // End arrow flight
        this.#isFlying = false;
        this.#arrow.body.setAcceleration(0,0);
        this.#arrow.body.setVelocity(0,0); 
        EventBus.off('cameraRotated', this.updateAcceleration);
    }
}