import { BaseComponent } from "../core/base-component";
import { EventBus } from "../core/event-bus";
import { createItemBuff } from "../core/factories/item-factory";

export class InventoryComponent extends BaseComponent{
    #playerInventory;

    constructor(gameObject){
        super(gameObject);
        this.#playerInventory = [];
        EventBus.on('itemPicked', (picker, item)=>{
            if(this.gameObject === picker) this.addItemToInventory(item.key);
        });
    }

    update(t, dt){}

    addItemToInventory(itemKey){
        this.#playerInventory.push(itemKey);
    }

    getInventory(){
        return this.#playerInventory;
    }

    removeItem(idx){
        const itemBuffData = createItemBuff(this.#playerInventory[idx]);
        if(itemBuffData){
            this.gameObject.emit('buffApplied', itemBuffData);
        }
        this.#playerInventory.splice(idx, 1);
    }
}