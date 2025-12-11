import { BaseComponent } from "../core/base-component";
import { EventBus } from "../core/event-bus";
import Pool from "../core/pool";
import { Arrow } from "../entities/Arrow/Arrow";
import { BasicTrajectory } from "../entities/Arrow/BasicTrajectory";
import { DepthSortedSprite } from "../entities/DepthSortedSprite";
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

    /**
     * @type {Object} Vector representing the drag of the mouse
     */
    #mouseDrag;
    /**
     * @type {Number} Length of the vector #mouseDrag
     */
    #mouseDragLength;

    /**
     * @type {Pool} Simple object pool for arrows.
     */
    #arrowPool;
    /**
     * @type {Arrow} Arrow entity to be shot (got from the arrow pool)
     */
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
     * @type {Boolean} Flag to know if the player has the special arrows selected
     */
    #isSpecialArrowActive = false;

    /**
     * @type {Number} Factor multiplied to the arrow effect as extra damage
     */
    #damageMultiplier = 1;

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
        this.playerKeys = this.gameObject.scene.inputFacade.getPlayerKeys();

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

        // Create Bow, power bar, and get arrow (All for visual represent aiming in the game)
        this.powerBar = this.gameObject.scene.add.nineslice(this.gameObject.x, this.gameObject.y, 'aiming-arrow', 0, 16, 16, 0, 6);
        this.powerBar.setScale(1.5);
        this.powerBar.setOrigin(0,0.5);
        this.powerBar.setVisible(false);

        this.bow = new DepthSortedSprite(gameObject.scene, this.gameObject.x, this.gameObject.y, 'bow', 0);

		this.gameObject.scene.add.existing(this.bow);
		this.bow.offsetX = 0.5;
		this.bow.offsetY = 0.8;
		this.bow.setOrigin(0.3,0.5),
        this.bow.scale = 4;
        this.bow.setVisible(false);
        this.arrowShot = this.#arrowPool.spawn();

        // Listen to camera rotation updates
        EventBus.on('cameraRotated', (R, cR, sR)=>{this.camCosR=cR;this.camSinR=sR;}, this);

        // Equip arrow when bought
        EventBus.on('arrowEquipped', (arrow)=>{
            this.#equippedArrow = arrow;
        })
        // Equip trajectory when bought
        EventBus.on('trajectoryEquipped', (trajectory)=>{
            this.#equippedTrajectory = trajectory;
        })

        // Move aim with mouse
        this.gameObject.scene.input.on('pointermove',(pointer)=>{
            // If mouse button is down, increase power
            if(pointer.isDown && this.gameObject.scene.input.mouse.locked) {
                // Begin drag (save first click position in another variable)

					EventBus.emit("PlayerAiming");
                if(!this.#shootWasPressedLastFrame){
                    this.#mouseDrag = {x: 0, y: 0};
                    EventBus.emit('playSound', 'bowLoad');
                    EventBus.emit('playerStartedAiming');
                }
                this.#shootWasPressedLastFrame = true;

                this.#mouseDrag.x += pointer.movementX;
                this.#mouseDrag.y += pointer.movementY;
                this.#mouseDragLength = Math.hypot(this.#mouseDrag.x, this.#mouseDrag.y);
                
                // Calculate shot power and clamp within values
                this.#currentPower = this.#mouseDragLength * this.#powerIncSpeed;
                this.#currentPower = Math.min(this.#currentPower, this.#maxPower);
            }
			else{
				EventBus.emit("PlayerNotAiming");
				
			}
        }, this);

        // Release arrow when pointer up
        this.gameObject.scene.input.on('pointerup',(pointer)=>{
            if(this.#shootWasPressedLastFrame && this.#currentPower > this.#minPower)
            {   
                // Calculate direction of shot taking into account camera rotation
                const directionShot = this.calculateShotDirection();
                // Get current effect
                // Make shallow copy of effect, no need to make deep copy (it is done in buffManager) the reason we make shallow copy is to not share the attacker and reciever properties added later in the arrow object.
                const effect = Object.assign({}, this.#isSpecialArrowActive ? this.#equippedArrow : basicArrow);
                effect.damage *= this.#damageMultiplier;
                // Get arrow from pool and shoot
                this.arrowShot.shoot(
                    this.#equippedTrajectory,
                    effect,
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
        // Handle bow aiming
        if(this.#currentPower > this.#minPower){
            this.showBowAndBar(this.#mouseDrag.x, this.#mouseDrag.y, this.#mouseDragLength, this.arrowShot);
        }
        else{
            this.hideBowAndBar();
        }

        // Handle arrow switching
        if(Phaser.Input.Keyboard.JustDown(this.playerKeys.switchArrows)){
            this.#isSpecialArrowActive = !this.#isSpecialArrowActive;
            EventBus.emit('playerArrowsSwitched');
        }
    }

    /**
     * @returns {Object} direction of shot with player drag  values
     */
    calculateShotDirection(){
        const noRotDirX = this.#mouseDrag.x;
        const noRotDirY = this.#mouseDrag.y;
        let dir = this.rotateVector(this.camCosR, this.camSinR, {x: noRotDirX, y: noRotDirY});
        dir.x = this.gameObject.x - dir.x;
        dir.y = this.gameObject.y - dir.y;
        return dir;
    }

    /**
     * Rotates a vector.
     * @param {Number} cR - cosine of rotation wanted
     * @param {Number} sR - sine of rotation wanted
     * @param {Number} vec - vector to rotate
     * @returns returns vector passed rotated
     */
    rotateVector(cR, sR, vec){
        return {x: vec.x * cR - vec.y * sR,
                y: vec.x * sR + vec.y * cR};
    }

    /**
     * Shows the bow and power bar indicators
     * @param {Number} dragX  - drag direction x
     * @param {Number} dragY - drag direction y
     * @param {Number} dragLength - drag length
     * @param {Object} arrow - arrow being shot
     */
    showBowAndBar(dragX, dragY, dragLength, arrow){
        // Calculate drag direction taking into account cam direction
        const dragDir = this.rotateVector(this.camCosR, this.camSinR, {y: dragY, x: dragX});
        // Bow orbit values
        const orbitDistance = 20;
        const orbitX = this.gameObject.x - orbitDistance*dragDir.x/dragLength;
        const orbitY = this.gameObject.y - orbitDistance*dragDir.y/dragLength;
        // How much the player has drawn the bow
        const drawProgress01 = (this.#currentPower-this.#minPower)/(this.#maxPower-this.#minPower);

        // Show power bar and set width to progress
        this.powerBar.setVisible(true);
        this.powerBar.width = 100 * drawProgress01;
        this.powerBar.alpha = Math.max(0, drawProgress01*100);
        
        // Rotate power bar with drag rotation
        const dragRotation = Math.atan2(-dragDir.y, -dragDir.x);
        this.powerBar.rotation = dragRotation;
        this.powerBar.x = orbitX;
        this.powerBar.y = orbitY;
        
        // Show bow and rotate with drag direction
        this.bow.setVisible(true);
        this.bow.rotation = dragRotation;
        this.bow.x = orbitX;
        this.bow.y = orbitY;
        this.bow.setFrame(Math.max(0, Math.round(drawProgress01*3)));

        // Show arow being shot and rotate with drag direction
        arrow.setVisible(true);
        arrow.setDepth(this.bow.depth+0.1);
        arrow.rotation = dragRotation;
        arrow.x = this.gameObject.x - (arrow.width/2 + orbitDistance - Math.max(0, Math.round(drawProgress01)*10)) * dragDir.x/dragLength;
        arrow.y = this.gameObject.y - (arrow.width/2 + orbitDistance - Math.max(0, Math.round(drawProgress01)*10)) * dragDir.y/dragLength;
    }

    /**
     * Hides the bow and power bar visual indicators
     */
    hideBowAndBar(){
        // If they are visible, hide them
        if(this.bow.visible || this.powerBar.visible){
            this.bow.setFrame(0);
            // Hide with tween reducing alpha
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

    /**
     * Set currently equipped trajectory
     * @param {*} trajectory 
     */
    setArrowTrajectory(trajectory){
        if(trajectory){
            // SHOULD MAKE A TRAJECTORY FROM A TRAJECTORY CONFIG, NOT JUST ACCEPT AN OBJECT AS IS
            EventBus.emit('trajectoryEquipped', trajectory);
        }
        else {
            //EventBus.emit('trajectoryEquipped', BasicTrajectory);
        }
    }
    /**
     * Get currently active trajectory
     */
    getArrowTrajectory(){
        //return this.#equippedTrajectory;
        // SHOULD RETURN A TRAJECTORY CONFIG TO THEN CREATE TRAJECTORIES, CANT JUST GIVE A PHASER OBJECT TO PARSE AS A JSON
    }
    /**
     * Set currently equipped effect
     * @param {*} effect 
     */
    setArrowEffect(effect){
        if(effect){
            EventBus.emit('arrowEquipped', effect);
        }
        else {
            EventBus.emit('arrowEquipped', basicArrow);
        }
    }
    /**
     * Get currently equipped effect
     */
    getArrowEffect(){
        return this.#equippedArrow;
    }

    /**
     * Reset equipped arrow and trajectory to defaults
     */
    resetArrowAndTrajectory() {
        EventBus.emit('arrowEquipped', basicArrow);
        this.#equippedTrajectory = new BasicTrajectory(0.05, this.gameObject.scene);
    }

    /**
     * Get current damage multiplier
     */
    getDamageMultiplier(){
        return this.#damageMultiplier;
    }

    /**
     * Set current damage multiplier
     * @param {Number} value 
     */
    setDamageMultiplier(value){
        this.#damageMultiplier = value;
    }

    destroy() {
        super.destroy();
        EventBus.off('cameraRotated', this);
        EventBus.off('arrowEquipped', this);
        EventBus.off('trajectoryEquipped', this);
    }
} 
