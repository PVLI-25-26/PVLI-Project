import { BaseComponent } from "../core/base-component";
import createPlayerKeys from "../../configs/controls-config";
import { EventBus } from "../core/event-bus";

/**
 * Component that allows a player to pick up items using a temporary sensor zone.
 *
 * @extends {BaseComponent}
 */
export class PlayerInteractControllerComponent extends BaseComponent{
    /**
     * Radius in pixels for the interact sensor.
     * @type {number}
     * @private
     */
    #interactRadius;

    /**
     * Create a PlayerPickItemControllerComponent.
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - Owner game object (player).
     * @param {number} interactRadius - Radius in pixels for the interact sensor zone.
     */
    constructor(gameObject, interactRadius){
        super(gameObject);
        // set properties
        this.#interactRadius = interactRadius
        // get player keys
        this.keys = gameObject.scene.inputFacade.getPlayerKeys();

        // Create interact effect zone to detect entities nearby
        this.interactZone = this.gameObject.scene.add.zone(this.gameObject.x, this.gameObject.y);
        this.gameObject.scene.matter.add.gameObject(this.interactZone, {
            shape: {
                type: "circle",
                radius: this.#interactRadius,
            },
            isSensor: true
        });
        this.interactZone.setOnCollide((pair)=>{this.interact(pair)});
        this.interactZone.setCollidesWith(0);

        this.logger = this.gameObject.scene.plugins.get('logger');
    }

    update(t, dt){
        // Toggle effect zone
        if(this.keys.pickItem.isDown) {
            this.interactZone.setPosition(this.gameObject.x, this.gameObject.y);
            this.interactZone.setCollidesWith(this.gameObject.scene.interactablesCategory);
        }
        else{
            this.interactZone.setCollidesWith(0);
        }
    }

    /**
     * Handler invoked when the pickup sensor collides with another body.
     * Emits an 'interact' event on the EventBus with the actor and the reciever.
     *
     * @param {MatterCollisionPair} pair - Collision pair object provided by Matter.
     * @returns {void}
     */
    interact(pair){
        // get entity interacted in effect zone
        let zone = pair.bodyA.gameObject;
        let reciever = pair.bodyB.gameObject;
        EventBus.emit('interact', this.gameObject, reciever);
    }

    /**
     * Cleans up the component, disabling it.
     * @returns {void}
     */
    destroy() {
        super.destroy();
    }
}