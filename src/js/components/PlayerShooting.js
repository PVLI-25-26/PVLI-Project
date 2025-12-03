import { BaseComponent } from "../core/base-component";
import { EventBus } from "../core/event-bus";
import Pool from "../core/pool";
import { Arrow } from "../entities/Arrow/Arrow";
import { BasicTrajectory } from "../entities/Arrow/BasicTrajectory";
import { DepthSortedSprite } from "../entities/DepthSortedSprite";
import fireArrow from "../../configs/Arrows/fire-arrow.json";
import grassArrow from "../../configs/Arrows/grass-arrow.json";
import gassArrow from "../../configs/Arrows/gass-arrow.json";
import basicArrow from "../../configs/Arrows/basic-arrow.json";

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

    #mouseDrag;
    #mouseDragLength;

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
     * @type {Trajectory} The currently equipped trajectory
     */
    #equippedTrajectory = new BasicTrajectory(0.05, this.gameObject.scene);

    /**
     * @type {Arrow} The currently equipped arrow
     */
    #equippedArrow = basicArrow;

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
            ()=>{return new Arrow(gameObject.scene);},
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
                });	
            },
            
            
        );

        // Basic UI for testing
        this.powerBar = this.gameObject.scene.add.nineslice(this.gameObject.x, this.gameObject.y, 'aiming-arrow', 0, 16, 16, 0, 6);
        this.powerBar.setScale(1.5);
        this.powerBar.setOrigin(0,0.5);
        this.powerBar.setVisible(false);

        this.bow = new DepthSortedSprite(gameObject.scene, this.gameObject.x, this.gameObject.y, 'bow', 0);
        gameObject.scene.add.existing(this.bow);
        this.bow.scale = 2.5;
        this.bow.setVisible(false);

        this.arrowShot = this.#arrowPool.spawn();

        // Listen to camera rotation updates
        EventBus.on('cameraRotated', (R, cR, sR)=>{this.camCosR=cR;this.camSinR=sR;}, this);

        // Equip arrow when bought
        EventBus.on('arrowBought', (arrow)=>{
            this.#equippedArrow = arrow;
        })
        // Equip trajectory when bought
        EventBus.on('trajectoryBought', (trajectory)=>{
            this.#equippedTrajectory = trajectory;
        })

        this.gameObject.scene.input.keyboard.on('keydown-T', ()=>{
            EventBus.emit('arrowBought', basicArrow);
        })
        this.gameObject.scene.input.keyboard.on('keydown-G', ()=>{
            EventBus.emit('arrowBought', gassArrow);
        })

        // Move aim with mouse
        this.gameObject.scene.input.on('pointermove',(pointer)=>{
            // If mouse button is down, increase power
            if(pointer.isDown && this.gameObject.scene.input.mouse.locked) {
                // Begin drag (save first click position in another variable)
                if(!this.#shootWasPressedLastFrame){
                    this.#mouseDrag = {x: 0, y: 0};
                    EventBus.emit('playSound', 'bowLoad');
                }
                this.#shootWasPressedLastFrame = true;

                this.#mouseDrag.x += pointer.movementX;
                this.#mouseDrag.y += pointer.movementY;
                this.#mouseDragLength = Math.hypot(this.#mouseDrag.x, this.#mouseDrag.y);
                
                // Calculate shot power and clamp within values
                this.#currentPower = this.#mouseDragLength * this.#powerIncSpeed;
                this.#currentPower = Math.min(this.#currentPower, this.#maxPower);
            }
        }, this);

        // Release arrow when pointer up
        this.gameObject.scene.input.on('pointerup',(pointer)=>{
            if(this.#shootWasPressedLastFrame && this.#currentPower > this.#minPower)
            {   
                // Calculate direction of shot taking into account camera rotation
                const directionShot = this.calculateShotDirection();
                console.log(this.#equippedArrow);
                // Get arrow from pool and shoot
                this.arrowShot.shoot(
                    this.#equippedTrajectory,
                    this.#equippedArrow,
                    this.gameObject.x, this.gameObject.y, // Origin (player position)
                    directionShot.x, directionShot.y, // Target (mouse position in world coordinates)
                    this.#currentPower // Power
                );
                this.arrowShot = this.#arrowPool.spawn();

                this.hideBowAndBar();            
            }

            // Reset shooting values
            this.#shootWasPressedLastFrame = false;
            this.#currentPower = this.#minPower;
        }, this);
    }

    update(time, delta){
        if(this.#currentPower > this.#minPower){
            this.showBowAndBar(this.#mouseDrag.x, this.#mouseDrag.y, this.#mouseDragLength, this.arrowShot);
        }
        else{
            this.hideBowAndBar();
        }
    }

    calculateShotDirection(){
        const noRotDirX = this.#mouseDrag.x;
        const noRotDirY = this.#mouseDrag.y;
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
