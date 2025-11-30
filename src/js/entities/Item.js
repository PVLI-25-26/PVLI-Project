import { EventBus } from "../core/event-bus";
import { ItemKey } from "../core/factories/item-factory";
import { BillBoard } from "./BillBoard";
import Colors from "../../configs/color-config.json"

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
    constructor(scene, x, y, id, config){
        super(scene, x, y, config.billboardConfig, config.physicsConfig);
        // save item key
        this.key = config.key;
        this.id = id;

        // Add item to scene
        this.scene.add.existing(this);

        // save item collect sound
        this.collectSound = config.collectSound;

        // Listen to item picked events
        EventBus.on('interact', this.pickUpItem, this);

//#region KeyTipCode
        // Key press tip shown when player is close (This logic should be moved to HUD but Daniil is sick so ill move it later when he pushes)
        this.keyTip = this.scene.add.nineslice(this.x, this.y, 'UIbackground',0,15,15,3,3,3,3).setVisible(false).setScale(2);
        this.keyTipKey = this.scene.add.text(this.x, this.y, 'F', {
            color: Colors.White,
            fontFamily: 'MicroChat',
            fontSize: 10
        }).setOrigin(0.5).setVisible(false);

        // Key press tip offset when shown
        this.keyTipOffsetX = 20;
        this.keyTipOffsetY = -50;

        // Create interact zone to detect if player is close
        this.interactZone = this.scene.add.zone(this.x, this.y);
        this.scene.matter.add.gameObject(this.interactZone, {
            shape: {
                type: "circle",
                radius: 30,
            },
            isSensor: true
        });
        this.interactZone.setOnCollide((pair)=>{
            this.scene.tweens.add({
                targets: [this.keyTip, this.keyTipKey],
                alpha: 1,
                duration:150,
            });
            this.keyTip.setAlpha(0);
            this.keyTip.setVisible(true);
            this.keyTipKey.setAlpha(0);
            this.keyTipKey.setVisible(true);
        });
        this.interactZone.setOnCollideEnd(()=>{
            this.scene?.tweens.add({
                targets: [this.keyTip, this.keyTipKey],
                alpha: 0,
                duration:150,
                onComplete: ()=>{this.keyTip.setVisible(false); this,this.keyTipKey.setVisible(false)}
            });
        })
        this.interactZone.setCollidesWith(this.scene.playerCategory);

        EventBus.on('cameraRotated', (R, cR, sR) => {
            this.keyTip.x = this.keyTipOffsetX * cR - this.keyTipOffsetY * sR + this.x;
            this.keyTip.y = this.keyTipOffsetX * sR + this.keyTipOffsetY * cR + this.y;
            this.keyTip.rotation = -R;
            this.keyTipKey.x = this.keyTip.x;
            this.keyTipKey.y = this.keyTip.y;
            this.keyTipKey.rotation = this.keyTip.rotation;
        }, this);
//#endregion
    }

    /**
     * Handler invoked when an 'itemPicked' event is emitted on the EventBus.
     * If the picked item matches this instance, plays the configured collect sound,
     * fades the item out, disables collisions and hides the object.
     *
     * @param {Phaser.GameObjects.GameObject} actor - The game object that picked the item (e.g. player).
     * @param {Phaser.GameObjects.GameObject|Item} reciever - The item instance that was picked.
     * @returns {void}
     */
    pickUpItem(actor, reciever){
        // check if the item picked is this item
        if(reciever === this)
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
            this.interactZone.destroy(true);
            EventBus.emit('itemPicked', actor, reciever);
        }
    }
}