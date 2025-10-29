import { BaseComponent } from "../core/base-component";
import { EventBus } from "../core/event-bus";
import { Arrow } from "../entities/Arrow/Arrow";
import { BasicTrajectory } from "../entities/Arrow/BasicTrajectory";

/**
 * Component to handle player shooting mechanics.
 * 
 * @class
 * @category Components
 * @extends BaseComponent
 */
export class PlayerShootingComponent extends BaseComponent{
    /**
     * @type {boolean} Whether the shoot button was pressed last frame.
     */
    #shootWasPressedLastFrame = false;

    /**
     * @type {number} Current power/magnitude of the shot.
     */
    #currentPower;

    /**
     * @type {number} Minimum power/magnitude of the shot.
     */
    #minPower;

    /**
     * @type {number} Maximum power/magnitude of the shot.
     */
    #maxPower;

    /**
     * @type {number} Speed at which the power increases while holding the shoot button.
     */
    #powerIncSpeed;

    #mouseBeginDragPos;
    #mouseEndDragPos;

    /**
     * @type {Arrow[]} Simple object pool for arrows.
     */
    #arrowPool;
    /**
     * @type {number} Index of the last arrow used in the pool.
     */
    #lastArrow = 0;

    /**
     * @type {number} Current cosine of camera rotation.
     */
    camCosR = 1;

    /**
     * @type {number} Current sine of camera rotation.
     */
    camSinR = 0;

    /**
     * Creates a new PlayerShootingComponent to handle player shooting.
     * 
     * @param {Object} gameObject Gameobject to which this component is attached.
     * @param {number} minPower Minimum power/magnitude of the arrows shot.
     * @param {number} maxPower Maximum power/magnitude of the arrows shot.
     * @param {number} powerIncSpeed Speed at which the power increases while holding the shoot button.
     */
    constructor(gameObject, minPower, maxPower, powerIncSpeed){
        super(gameObject);

        // Set shooting properties values
        this.#minPower = minPower;
        this.#currentPower = 0;
        this.#maxPower = maxPower;
        this.#powerIncSpeed = powerIncSpeed;

        // Initialize object pool for testing
        this.#arrowPool = Array(30);
        for(let i = 0; i < this.#arrowPool.length; i++) 
           this.#arrowPool[i] = new Arrow(this.gameObject.scene);

        // Basic UI for testing
        this.powerBar = this.gameObject.scene.add.rectangle(this.gameObject.x, this.gameObject.y, 100, 3,0x2200ff,1);
        this.powerBar.setOrigin(0,0.5);
        this.powerBar.setVisible(false);

        // Listen to camera rotation updates
        EventBus.on('cameraRotated', (R, cR, sR)=>{this.camCosR=cR;this.camSinR=sR;}, this);
    }

    update(time, delta){
        // Get mouse data
        let pointer = this.gameObject.scene.input.activePointer;

        // Begin drag (save first click position in another variable)
        if(pointer.isDown && !this.#shootWasPressedLastFrame){
            this.#mouseBeginDragPos = {x: pointer.x, y: pointer.y};
            EventBus.emit('playSound', 'bowLoad');
        }
        // If mouse button is down, increase power
        if(pointer.isDown) {
            this.#shootWasPressedLastFrame = true;

            // Update last mouse pos while dragging
            this.#mouseEndDragPos = {x: pointer.x, y: pointer.y};
            
            // Calculate shot power and clamp within values
            this.#currentPower = Math.hypot(
                this.#mouseEndDragPos.x - this.#mouseBeginDragPos.x,
                this.#mouseEndDragPos.y - this.#mouseBeginDragPos.y
            ) * this.#powerIncSpeed;
            this.#currentPower = Math.min(this.#currentPower, this.#maxPower);

            /*  LOGIC FOR click & hold shooting style SAVE IT JUST IN CASE
            // increase power while click held
            if(this.#currentPower > this.#maxPower) this.#currentPower = this.#maxPower;
            else this.#currentPower += this.#powerIncSpeed * delta;
            */

            // Basic UI for testing (should be implemented in a container with the player)
            this.powerBar.setVisible(true);
            this.powerBar.x = this.gameObject.x;
            this.powerBar.y = this.gameObject.y;
            this.powerBar.width = 100 * -(this.#currentPower-this.#minPower)/(this.#maxPower-this.#minPower);
            const dragDir = this.rotateVector(this.camCosR, this.camSinR,
                {y: this.#mouseEndDragPos.y - this.#mouseBeginDragPos.y, 
                x: this.#mouseEndDragPos.x - this.#mouseBeginDragPos.x});
            
            this.powerBar.rotation = Math.atan2(dragDir.y, dragDir.x);
        }
        // When mouse button is released after being pressed, shoot arrow
        if(!pointer.isDown && this.#shootWasPressedLastFrame && this.#currentPower > this.#minPower)
            {
            const logger = this.gameObject.scene.plugins.get('logger');

            /* LOGIC FOR click & hold shooting style SAVE IT JUST IN CASE
            // Get mouse position in world coordinates
            const cam = this.gameObject.scene.cameras.main; // Get main camera
            const mousePosLength = Math.hypot(pointer.x, pointer.y); // Distance from center of screen to mouse position
            const mouseNorm01X = pointer.x/cam.width; // Normalize mouse x to 0-1
            const mouseNorm01Y = pointer.y/cam.height; // Normalize mouse y to 0-1
            const mouseNormX = mouseNorm01X*2-1; // Normalize mouse x to -1 to 1
            const mouseNormY = mouseNorm01Y*2-1; // Normalize mouse y to -1 to 1
            // Rotate normalized mouse position by -cameraRotation
            let dirX = mouseNormX * Math.cos(-this.camRotation) - mouseNormY * Math.sin(-this.camRotation);
            let dirY = mouseNormX * Math.sin(-this.camRotation) + mouseNormY * Math.cos(-this.camRotation);
            // Scale by the actual distance from center to mouse position
            dirX *= mousePosLength;
            dirY *= mousePosLength;
            // Translate to world coordinates
            dirX += cam.scrollX+cam.width/2;
            dirY += cam.scrollY+cam.height/2;
            */
            
            // Calculate direction of shot taking into account camera rotation
            const directionShot = this.calculateShotDirection();
            
            // Get arrow from pool and shoot
            this.#arrowPool[this.#lastArrow].shoot(
                new BasicTrajectory(1500, this.gameObject.scene), // Create new basic trajectory for now (later we can inject different types)
                {}, // Give empty effect for now (Upate when we have effects and enemies implemented)
                this.gameObject.x, this.gameObject.y, // Origin (player position)
                directionShot.x, directionShot.y, // Target (mouse position in world coordinates)
                this.#currentPower // Power
            );
            // Update last arrow index to get next arrow in pool
            this.#lastArrow = (this.#lastArrow+1)%this.#arrowPool.length;
            // Remove power bar UI
            this.powerBar.setVisible(false);
            // Reset shooting values
            this.#shootWasPressedLastFrame = false;
            this.#currentPower = this.#minPower;
        }
    }

    calculateShotDirection(){
        const noRotDirX = (this.#mouseEndDragPos.x - this.#mouseBeginDragPos.x);
        const noRotDirY = (this.#mouseEndDragPos.y - this.#mouseBeginDragPos.y);
        let dir = this.rotateVector(this.camCosR, this.camSinR, {x: noRotDirX, y: noRotDirY});
        dir.x = this.gameObject.x - dir.x;
        dir.y = this.gameObject.y - dir.y;
        return dir;
    }

    rotateVector(cR, sR, vec){
        return {x: vec.x * cR - vec.y * sR,
                y: vec.x * sR + vec.y * cR};
    }
} 