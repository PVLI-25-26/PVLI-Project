import { BaseComponent } from "../core/base-component";
import createPlayerKeys from "../../configs/controls-config";
import { EventBus } from "../core/event-bus";

/**
 * Component that allows a player to pick up items using a temporary sensor zone.
 *
 * @extends {BaseComponent}
 */
export class PlayerPickItemControllerComponent extends BaseComponent{
    /**
     * Radius in pixels for the pickup sensor.
     * @type {number}
     * @private
     */
    #pickUpRadius;

    /**
     * Create a PlayerPickItemControllerComponent.
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - Owner game object (player).
     * @param {number} pickUpRadius - Radius in pixels for the pickup sensor zone.
     */
    constructor(gameObject, pickUpRadius){
        super(gameObject);
        // set properties
        this.#pickUpRadius = pickUpRadius
        // get player keys
        this.keys = createPlayerKeys(gameObject.scene);

        // Create pick up effect zone to detect items nearby
        this.pickUpZone = this.gameObject.scene.add.zone(this.gameObject.x, this.gameObject.y);
        this.gameObject.scene.matter.add.gameObject(this.pickUpZone, {
            shape: {
                type: "circle",
                radius: this.#pickUpRadius,
            },
            isSensor: true
        });
        this.pickUpZone.setOnCollide((pair)=>{this.pickItem(pair)});
        this.pickUpZone.setCollidesWith(0);

        this.logger = this.gameObject.scene.plugins.get('logger');
    }

    update(t, dt){
        // Toggle effect zone
        if(this.keys.pickItem.isDown) {
            this.pickUpZone.setPosition(this.gameObject.x, this.gameObject.y);
            this.pickUpZone.setCollidesWith(this.gameObject.scene.itemsCategory);
        }
        else{
            this.pickUpZone.setCollidesWith(0);
        }
    }

    /**
     * Handler invoked when the pickup sensor collides with another body.
     * Emits an 'itemPicked' event on the EventBus with the picker and the item.
     *
     * @param {MatterCollisionPair} pair - Collision pair object provided by Matter.
     * @returns {void}
     */
    pickItem(pair){
        // Pick items in effect zone
        let zone = pair.bodyA.gameObject;
        let item = pair.bodyB.gameObject;
        EventBus.emit('itemPicked', this.gameObject, item);
    }

    /**
     * Cleans up the component, disabling it.
     * @returns {void}
     */
    destroy() {
        super.destroy();
    }
}