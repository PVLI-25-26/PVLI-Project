import { BaseComponent } from "../core/base-component";
import serviceLocator, {SERVICE_KEYS} from "../core/service-locator";
import { Arrow } from "../entities/Arrow/Arrow";
import { BasicTrajectory } from "../entities/Arrow/BasicTrajectory";

export class PlayerShootingComponent extends BaseComponent{
    #shootWasPressedLastFrame = false;
    #minPower = 100;
    #currentPower = this.#minPower;
    #maxPower = 1000;
    #powerIncSpeed = 1;

    // For simple arrow pool
    #arrowPool;
    #lastArrow = 0;

    constructor(gameObject){
        super(gameObject);

        // Simple object pool for testing
        this.#arrowPool = Array(30);
        for(let i = 0; i < this.#arrowPool.length; i++) 
           this.#arrowPool[i] = new Arrow(this.gameObject.scene);
    }

    update(time, delta){
        let logger = serviceLocator.getService(SERVICE_KEYS.LOGGER);

        let pointer = this.gameObject.scene.input.activePointer;

        
        if(pointer.isDown) {
            this.#shootWasPressedLastFrame = true;
            if(this.#currentPower > this.#maxPower) this.#currentPower = this.#maxPower;
            else this.#currentPower += this.#powerIncSpeed * delta;

            // Code to get mouse world position when sprite stacking works
            // --
            // let mouseNorm01X = pointer.x/cam.width;
            // let mouseNorm01Y = pointer.y/cam.height;
            // let mouseNormX = mouseNorm01X*2-1;
            // let mouseNormY = mouseNorm01Y*2-1;
            // let dirX = mouseNormX * Math.cos(-cam.rotation) - mouseNormY * Math.sin(-cam.rotation);
            // let dirY = mouseNormX * Math.sin(-cam.rotation) + mouseNormY * Math.cos(-cam.rotation);
        
        }
        if(!pointer.isDown && this.#shootWasPressedLastFrame)
        {
            this.#arrowPool[this.#lastArrow].shoot(new BasicTrajectory(500, this.gameObject.scene), {}, this.gameObject.x, this.gameObject.y, pointer.x, pointer.y, this.#currentPower);
            this.#lastArrow = (this.#lastArrow+1)%this.#arrowPool.length;
            this.#arrowPool.get(this.gameObject.scene)
                           .shoot(new BasicTrajectory(500, this.gameObject.scene), 
                                  {}, 
                                  this.gameObject.x, this.gameObject.y, 
                                  pointer.x, pointer.y, 
                                  this.#currentPower);

            this.#shootWasPressedLastFrame = false;
            this.#currentPower = this.#minPower;
        }
    }
} 