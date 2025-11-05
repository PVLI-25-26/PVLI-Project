import { EventBus } from "../../core/event-bus";
import { DepthSortedSprite } from "../DepthSortedSprite";
import { Obstacle } from "../Obstacle.js";


/**
 * Trajectory controller interface used by Arrow instances.
 *
 * A Trajectory is an object that manages an arrow's movement lifecycle.
 * @typedef {Object} Trajectory
 * @property {function(Phaser.GameObjects.Sprite, number):void} shoot - Start the trajectory for the arrow. Receives the arrow and the camera/scene rotation if needed.
 * @property {function(number, number):void} update - Per-frame update called with (time, delta).
 * @property {function():void} onCollision - Called when the arrow collides with something.
 */


/**
 * Arrow entity — a lightweight projectile GameObject used for shooting any type of arrow.
 *
 * This class wraps a Phaser Sprite and delegates movement to a provided
 * "trajectory" controller object.
 * The class will need ot be injected with a trajectory and an effect, which it will use
 * to handle shooting and collisions.
 * @class
 * @extends Phaser.GameObjects.Sprite
 * @module entities/Arrow
 */
export class Arrow extends DepthSortedSprite{
    /**
     * Trajectory controller instance which manages movement and lifecycle.
     * @type {Trajectory}
     */
    trajectory;

    /**
     * Effect payload to apply when the arrow hits something.
     * @type {*}
     */
    effect;

    /**
     * Target direction vector calculated on shoot: {x:number, y:number}.
     * @type {{x:number, y:number}}
     */
    target;

    /**
     * Power/magnitude of the shot (speed scalar).
     * @type {number}
     */
    power;


    /**
     * Create a new Arrow.
     *
     * @param {Phaser.Scene} scene - The scene this Arrow belongs to.
     */
    constructor(scene){
        super(scene, 0, 0, 'arrow', 0);

        // This should probably be done by the pool
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.colliders = []; // вот здесь

        // collision with obstacles
        this.colliders.push(
            this.scene.physics.add.collider(
                this,
                this.scene.obstaclesGroup,
                this.onCollision,
                null,
                this
            )
        );

        // collision with enemies
        this.colliders.push(
            this.scene.physics.add.collider(
                this,
                this.scene.enemiesGroup,
                this.onCollision,
                null,
                this
            )
        );
        
        this.setActive(false);
        this.setVisible(false);
        this.colliders.forEach(collider => collider.active = false);

        // Make the collider smaller to look like the arrow is inside the object it hits
        this.body.setSize(this.width-25, this.height-25);
    }

    /**
     * Shoot the arrow using a trajectory controller.
     * 
     * A trajectory and an effect must be injected to handle movement and collisions.
     * 
     * The trajectory controller should handle movement and lifecycle for the
     * arrow (methods: `shoot(arrow, rotation)`, `update(time, delta)`,
     * `onCollision()`).
     *
     * @param {Trajectory} trajectory - Trajectory controller.
     * @param {*} effect - Any effect payload to apply on hit (damage, status, etc.).
     * @param {number} oX - Origin X (start x coordinate).
     * @param {number} oY - Origin Y (start y coordinate).
     * @param {number} tX - Target X (mouse/aim x coordinate).
     * @param {number} tY - Target Y (mouse/aim y coordinate).
     * @param {number} power - Magnitude of the shot (speed/power scalar).
     * @returns {void}
     */
    shoot(trajectory, effect, oX, oY, tX, tY, power){
        this.resetState();
        this.x = oX;
        this.y = oY;

        this.trajectory = trajectory;
        this.effect = effect;

        // target direction
        this.target = {x: tX-oX, y: tY-oY};
        this.power = power;

        this.setFrame(0);

        // This should be done by the pool
        this.setActive(true);
        this.setVisible(true);
        this.colliders.forEach(collider => collider.active = true);

        this.setOrigin(0.5,0.5);

        this.trajectory.shoot(this);

        EventBus.emit('playSound', 'arrowSwish');

        EventBus.on('entityDied', (entity) => {
            if (this.stuckTo === entity) {
                this.setVisible(false);
                this.stuckTo = null; 
            }
        });
    }

    /**
     * Called by the physics collider when the arrow hits another body.
     *
     * @param {Phaser.GameObjects.Sprite|Arrow} arrow - The arrow instance/body.
     * @param {Phaser.GameObjects.GameObject} other - The other object collided with.
     * @returns {void}
     */
    onCollision(arrow, other){
        // Notify the trajectory controller about the collision so it can
        // handle stopping, pooling or effects.
        this.trajectory.onCollision();
        
        if (other instanceof Obstacle) {
            this.onLanded();
        } 
        this.stickToObject(other);
        EventBus.emit('arrowHit', { arrow: arrow, target: other });
    }

    onLanded(){
        this.colliders.forEach(collider => collider.active = false);
        EventBus.emit('arrowLanded', this);
        this.setFrame(1);
        this.applyBouncyTween();
        EventBus.emit('playSound', 'arrowLand');
    }

    stickToObject(target) {
        this.stuckTo = target;

        this.offsetX = this.x - target.x;
        this.offsetY = this.y - target.y;

        this.body.enable = false;

        this.setOrigin(0.8, 0.5);
    }

    resetState() {
        this.stuckTo = null;
        this.offsetX = 0;
        this.offsetY = 0;
        this.body.enable = true;
        this.setOrigin(0.5, 0.5);
    }

    updateArrowVisuals(normalizedAirTime01){
        this.rotation = this.body.angle;
    }

    preUpdate(time, delta){
        super.preUpdate(time, delta);
        if (this.stuckTo && this.stuckTo.active) {
            this.x = this.stuckTo.x + this.offsetX;
            this.y = this.stuckTo.y + this.offsetY;
        } else if (this.trajectory) {
            this.trajectory.update(time, delta);
        }
    }

    applyBouncyTween(){
        this.setOrigin(0.8,0.5);
        this.scene.tweens.add({
            targets: this,
            rotation: '+=0.15',
            ease: 'Linear',
            duration: 50,
            repeat: 2,
            yoyo: true,
        });
    }
}