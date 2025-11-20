import { BaseComponent } from "../core/base-component";
import createPlayerKeys from "../../configs/controls-config";
import { EventBus } from "../core/event-bus";

export class PlayerPickItemControllerComponent extends BaseComponent{
    #pickUpRadius;

    constructor(gameObject, pickUpRadius){
        super(gameObject);
        this.#pickUpRadius = pickUpRadius
        this.keys = createPlayerKeys(gameObject.scene);

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
        if(this.keys.pickItem.isDown) {
            this.pickUpZone.setPosition(this.gameObject.x, this.gameObject.y);
            this.pickUpZone.setCollidesWith(this.gameObject.scene.itemsCategory);
        }
        else{
            this.pickUpZone.setCollidesWith(0);
        }
    }

    pickItem(pair){
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