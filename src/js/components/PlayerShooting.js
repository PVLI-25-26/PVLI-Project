import { BaseComponent } from "../core/base-component";
import { Arrow } from "../entities/Arrow/Arrow";
import { BasicTrajectory } from "../entities/Arrow/BasicTrajectory";

export class PlayerShootingComponent extends BaseComponent{
    #shootWasPressedLastFrame = false;
    #currentPower;
    #minPower;
    #maxPower;
    #powerIncSpeed;

    // For simple arrow pool
    #arrowPool;
    #lastArrow = 0;

    constructor(gameObject, minPower, maxPower, powerIncSpeed){
        super(gameObject);

        // Set config values
        this.#minPower = minPower;
        this.#currentPower = this.#minPower;
        this.#maxPower = maxPower;
        this.#powerIncSpeed = powerIncSpeed;

        // Simple object pool for testing
        this.#arrowPool = Array(30);
        for(let i = 0; i < this.#arrowPool.length; i++) 
           this.#arrowPool[i] = new Arrow(this.gameObject.scene);

        // Basic UI for testing
        this.powerBar = this.gameObject.scene.add.rectangle(this.gameObject.x, this.gameObject.y - 30, 100, 10,0x2200ff,1);
        this.powerBar.setVisible(false);
    }

    update(time, delta){
        let pointer = this.gameObject.scene.input.activePointer;

        
        if(pointer.isDown) {
            this.#shootWasPressedLastFrame = true;
            if(this.#currentPower > this.#maxPower) this.#currentPower = this.#maxPower;
            else this.#currentPower += this.#powerIncSpeed * delta;

            // Basic UI for testing (should be implemented in a container with the player)
            this.powerBar.setVisible(true);
            this.powerBar.x = this.gameObject.x;
            this.powerBar.y = this.gameObject.y-30;
            this.powerBar.width = 100 * (this.#currentPower-this.#minPower)/(this.#maxPower-this.#minPower);

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
            this.gameObject.scene.plugins.get('logger').log('PLAYER', 0, `Arrow shoot: strength-${this.#currentPower}`);
            this.#arrowPool[this.#lastArrow].shoot(new BasicTrajectory(500, this.gameObject.scene), {}, this.gameObject.x, this.gameObject.y, pointer.x, pointer.y, this.#currentPower);
            this.#lastArrow = (this.#lastArrow+1)%this.#arrowPool.length;
            this.powerBar.setVisible(false);

            this.#shootWasPressedLastFrame = false;
            this.#currentPower = this.#minPower;
        }
    }
} 