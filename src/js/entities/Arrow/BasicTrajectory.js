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

    shoot(arrow){
        this.#arrow = arrow;
        let targetLength = Math.sqrt(arrow.target.x * arrow.target.x + arrow.target.y * arrow.target.y);

        arrow.body.setVelocity(arrow.target.x*arrow.power/targetLength, arrow.target.y*arrow.power/targetLength);
        arrow.body.setAcceleration(0, this.#gravityStr);

        this.#scene.time.delayedCall(this.#airTime, ()=>{
            arrow.body.setAcceleration(0,0);
            arrow.body.setVelocity(0,0); 
            this.#isFlying=false;
            EventBus.emit('arrowLanded', this.#arrow);
        });
    }

    update(time, delta){
        if(this.#isFlying) this.#arrow.rotation = this.#arrow.body.angle;
        // Todo - the following code will be necessary when the sprite stacking works
        //body.setAcceleration(-Math.sin(-cam.rotation)*1000, Math.cos(-cam.rotation)*1000);
    }

    onCollision(){
        this.#isFlying = false;
        this.#arrow.body.setAcceleration(0,0);
        this.#arrow.body.setVelocity(0,0); 
    }
}