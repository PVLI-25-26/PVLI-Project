import dungeon from "../core/dungeon";
import { EventBus } from "../core/event-bus";
import { BillBoard } from "./BillBoard";

/**
 * Game entity representing a world item that can be picked up by the player.
 *
 * @extends {BillBoard}
 */
export class Item extends BillBoard{
    /**
     * Create an Item instance.
     * @param {Phaser.Scene} scene - Phaser scene instance.
     * @param {number} x - X world position.
     * @param {number} y - Y world position.
     * @param {ItemConfig} config - Item configuration object.
     */
    constructor(scene, x, y, config){
        super(scene, x, y, config.billboardConfig, config.physicsConfig);
        // save item key
        this.key = config.key;

        // Add item to scene
        this.scene.add.existing(this);

        // save item collect sound
        this.collectSound = config.collectSound;

        // Listen to item picked events
        EventBus.on('itemPicked', this.pickUpItem, this);
    }

    /**
     * Handler invoked when an 'itemPicked' event is emitted on the EventBus.
     * If the picked item matches this instance, plays the configured collect sound,
     * fades the item out, disables collisions and hides the object.
     *
     * @param {Phaser.GameObjects.GameObject} picker - The game object that picked the item (e.g. player).
     * @param {Phaser.GameObjects.GameObject|Item} item - The item instance that was picked.
     * @returns {void}
     */
    pickUpItem(picker, item){
        // check if the item picked is this item
        if(item === this)
        {
            // play this item collect sound
            EventBus.emit('playSound', this.collectSound);

            // tween item to disappear
            this.scene.tweens.add({
                targets: this,
                alpha: 0,
                duration: 100,
                repeat: 0,
                onComplete: (tween)=>{
                    this.setActive(false);
                    this.setVisible(false);
                    tween.remove();
                }
            });

            // Remove collisions to ensure it isn't picked again
            this.setCollidesWith(0);
        }
    }
}