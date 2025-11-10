import { BaseComponent } from "../core/base-component";
import { EventBus } from "../core/event-bus";
import Pool from "../core/pool";
import { Arrow } from "../entities/Arrow/Arrow";
import { BasicTrajectory } from "../entities/Arrow/BasicTrajectory";
import { DepthSortedSprite } from "../entities/DepthSortedSprite";

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
     * @type {Pool} Simple object pool for arrows.
     */
    #arrowPool;
    arrowShot;

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

        // Initialize object pool
        this.#arrowPool = new Pool(
            gameObject.scene,
            10,
            ()=>{return new Arrow(gameObject.scene.matter.world);},
            (entity)=>{entity.scene.tweens.add({
                targets: entity,
                alpha: 0,
                duration: 200,
                onComplete: (tween)=>{
                    tween.remove();
                    entity.setActive(false);
                    entity.setVisible(false);
                    entity.alpha = 1;
                },
		    });	},
        );

        // Basic UI for testing
        this.powerBar = this.gameObject.scene.add.nineslice(this.gameObject.x, this.gameObject.y, 'aiming-arrow', 0, 16, 16, 0, 6);
        this.powerBar.setScale(1.5);
        this.powerBar.setOrigin(0,0.5);
        this.powerBar.setVisible(false);

        this.bow = new DepthSortedSprite(gameObject.scene.matter.world, this.gameObject.x, this.gameObject.y, 'bow', 0);
        gameObject.scene.add.existing(this.bow);
        this.bow.scale = 2.5;
        this.bow.setVisible(false);

        this.arrowShot = this.#arrowPool.spawn();

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

            const dragX = this.#mouseEndDragPos.x - this.#mouseBeginDragPos.x;
            const dragY = this.#mouseEndDragPos.y - this.#mouseBeginDragPos.y;
            const dragLength = Math.hypot(dragX, dragY);
            
            // Calculate shot power and clamp within values
            this.#currentPower = dragLength * this.#powerIncSpeed;
            this.#currentPower = Math.min(this.#currentPower, this.#maxPower);

            /*  LOGIC FOR click & hold shooting style SAVE IT JUST IN CASE
            // increase power while click held
            if(this.#currentPower > this.#maxPower) this.#currentPower = this.#maxPower;
            else this.#currentPower += this.#powerIncSpeed * delta;
            */
            if(this.#currentPower > this.#minPower){
                this.showBowAndBar(dragX, dragY, dragLength, this.arrowShot);
            }
            else{
                this.hideBowAndBar();
            }
            
        }
        // When mouse button is released after being pressed, shoot arrow
        if(!pointer.isDown && this.#shootWasPressedLastFrame && this.#currentPower > this.#minPower)
            {
            const logger = this.gameObject.scene.plugins.get('logger');
            
            // Calculate direction of shot taking into account camera rotation
            const directionShot = this.calculateShotDirection();
            
            // Get arrow from pool and shoot
            this.arrowShot.shoot(
                new BasicTrajectory(0.05, this.gameObject.scene), // Create new basic trajectory for now (later we can inject different types)
                {}, // Give empty effect for now (Upate when we have effects and enemies implemented)
                this.gameObject.x, this.gameObject.y, // Origin (player position)
                directionShot.x, directionShot.y, // Target (mouse position in world coordinates)
                this.#currentPower // Power
            );
            this.arrowShot = this.#arrowPool.spawn();

            this.hideBowAndBar();            
            
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

    showBowAndBar(dragX, dragY, dragLength, arrow){
        const dragDir = this.rotateVector(this.camCosR, this.camSinR, {y: dragY, x: dragX});
        const orbitDistance = 20;
        const orbitX = this.gameObject.x - orbitDistance*dragDir.x/dragLength;
        const orbitY = this.gameObject.y - orbitDistance*dragDir.y/dragLength;
        const drawProgress01 = (this.#currentPower-this.#minPower)/(this.#maxPower-this.#minPower);

        this.powerBar.setVisible(true);
        this.powerBar.width = 100 * drawProgress01;
        this.powerBar.alpha = Math.max(0, drawProgress01*100);
        
        
        const dragRotation = Math.atan2(-dragDir.y, -dragDir.x);
        this.powerBar.rotation = dragRotation;
        this.powerBar.x = orbitX;
        this.powerBar.y = orbitY;
        
        this.bow.setVisible(true);
        this.bow.rotation = dragRotation;
        this.bow.x = orbitX;
        this.bow.y = orbitY;
        this.bow.setFrame(Math.max(0, Math.round(drawProgress01*3)));

        arrow.setVisible(true);
        arrow.setDepth(this.bow.depth+0.1);
        arrow.rotation = dragRotation;
        arrow.x = this.gameObject.x - (arrow.width/2 + orbitDistance - Math.max(0, Math.round(drawProgress01)*10)) * dragDir.x/dragLength;
        arrow.y = this.gameObject.y - (arrow.width/2 + orbitDistance - Math.max(0, Math.round(drawProgress01)*10)) * dragDir.y/dragLength;
    }

    hideBowAndBar(){
        if(this.bow.visible || this.powerBar.visible){
            this.bow.setFrame(0);
            this.gameObject.scene.tweens.add({
                targets: [this.bow, this.powerBar, this.arrowShot],
                alpha: 0,
                duration: 200,
                onComplete: (tween)=>{
                    tween.destroy();
                    this.powerBar.setVisible(false);
                    this.powerBar.alpha = 1;
                    this.bow.setVisible(false);
                    this.bow.alpha = 1;
                    this.arrowShot.setVisible(false);
                    this.arrowShot.alpha = 1;
                }
            })
        }
    }
} 