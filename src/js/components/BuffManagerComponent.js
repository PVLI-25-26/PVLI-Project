import { BaseComponent } from "../core/base-component";

import { burningDebuff } from "./Buffs/BurningDebuff";
import { inmobilizedDebuff} from "./Buffs/InmobilizedDebuff"
import { poisonedDebuff } from "./Buffs/PoisonedDebuff";

import { dashBuff } from "./Buffs/DashBuff";
import { forceFieldBuff } from "./Buffs/ForceFieldBuff";
import { invisibilityBuff } from "./Buffs/InvisiblityBuff";

import { movementBuff } from "./Buffs/MovementBuff";
import { healingBuff } from "./Buffs/HealingBuff";
import { powerBuff } from "./Buffs/PowerBuff";


/**
 * Interface for a buff implementation.
 * @typedef {Object} BuffLogic
 * @property {function(*, Phaser.GameObjects.GameObject):void} apply - Apply the buff effect to the target.
 * @property {function(*, Phaser.GameObjects.GameObject):void} remove - Remove/revert the buff effect from the target.
 */

/**
 * Data object describing a buff to apply.
 * @typedef {Object} BuffData
 * @property {string} type - Buff type key (used to look up BuffLogic).
 * @property {number} duration - Duration in milliseconds for the buff.
 * @property {*} value - Payload / parameters for the buff (shape depends on buff implementation).
 */

/**
 * Registry mapping buff type keys to their logic implementations.
 * Each value must implement the BuffLogic interface.
 * Buff type keys for each item are specified in items-config.json
 * @type {Object.<string, BuffLogic>}
 */
const buffTypeToBuffLogic = {
    movement: movementBuff,
    dash: dashBuff,
    forceField: forceFieldBuff,
    invisibility: invisibilityBuff,
    burning: burningDebuff,
    inmobilized: inmobilizedDebuff,
    poisoned: poisonedDebuff,
    healing: healingBuff,
    power: powerBuff
    // ...
}

/**
 * Component that manages applying and removing timed buffs on a game object.
 * Integrates with the game object's event system to receive 'buffApplied' events.
 * @extends {BaseComponent}
 */
export class BuffManagerComponent extends BaseComponent{
    /**
     * Map of buff info, stores the type, value and timer of each buff currently applied
     * @type {Map<String>}
     */
    #buffs;

    /**
     * Create a BuffManagerComponent.
     * @param {Phaser.GameObjects.GameObject} gameObject - The game object this component is attached to.
     */
    constructor(gameObject, buffs){
        super(gameObject);

        // Maybe we want to do stuff with the timer events later on
        this.#buffs = new Map();

        // Listen to buffApplied events inside the entity
        this.gameObject.on('buffApplied', this.addBuff, this);
        this.gameObject.on('buffRemoved', this.removeBuff, this);
        this.gameObject.on('entityDied', this.clearBuffs, this);
    }

    update(t, dt){
    }

    /**
     * @returns {Array<BuffData>} Returns array of buff datas
     */
    getBuffs(){
        return Array.from(this.#buffs.values());
    }

     /**
     * Apply a buff described by buffData to the attached game object.
     * Makes a deep copy of buffData and uses it.
     * Looks up the corresponding BuffLogic by buffData.type and calls its apply/remove methods.
     * A Phaser TimerEvent is scheduled to call remove after buffData.duration milliseconds.
     *
     * @param {BuffData} buffData - Data describing the buff to apply.
     * @returns {void}
     */
    addBuff(buffData){
        // Make deep copy of buffData
        const buff = structuredClone(buffData);
        if(this.#buffs.has(buff.type)){
            // Get current buff
            this.mergeNewBuff(buff);
        }
        else{
            // Si el bufo no esta repetido
            this.addNewBuff(buff);
        }
    }

    /**
     * Merges an existing buff with a new buff
     * @param {BuffData} buffData The data of the new buff
     * @private
     */
    mergeNewBuff(buffData) {
        const currentBuff = this.#buffs.get(buffData.type);
        // Undo current buff effects
        buffTypeToBuffLogic[buffData.type].remove(currentBuff.value, this.gameObject);
        // Merge both buffs
        currentBuff.timer.elapsed -= buffData.duration;
        if (currentBuff.value < buffData.value) currentBuff.value = buffData.value;
        // Reapply new buffs merged
        buffTypeToBuffLogic[buffData.type].apply(buffData.value, this.gameObject);
    }

    /**
     * Adds a new buff to the current buffs
     * @param {BuffData} buffData The data of the new buff
     * @private
     */
    addNewBuff(buffData) {
        // Apply buff using each buff logic depending on type
        buffData.value.duration = buffData.duration; // Add the duration to the values of the buff
        buffTypeToBuffLogic[buffData.type].apply(buffData.value, this.gameObject);

        const currentBuffsSize = this.#buffs.length;
        // Add timer for buff duration end to remove buff
        const buffTimer = this.gameObject.scene.time.addEvent({
            delay: buffData.duration,
            callback: () => {
                buffTypeToBuffLogic[buffData.type].remove(buffData.value, this.gameObject);
                this.#buffs.delete(buffData.type);
            },
            loop: false,
            repeat: 0
        });

        const appliedBuff = {
            type: buffData.type,
            value: buffData.value,
            timer: buffTimer
        };
        appliedBuff.id = buffData.id;

        // Save buff in buffs array
        this.#buffs.set(appliedBuff.type, appliedBuff);
    }

    /**
     * Removes buff from entity
     * @param {String} buffType Buff to be removed
     */
    removeBuff(buffType){
        const buffToRemove = this.#buffs.get(buffType);
        // If buff is active, remove it
        if(buffToRemove){
            buffToRemove.timer.remove()
            buffTypeToBuffLogic[buffToRemove.type].remove(buffToRemove.value, this.gameObject);
            this.#buffs.delete(buffType);
        }
    }

    /**
     * Clears every buff from entity
     */
    clearBuffs(){
        for(const buff of this.#buffs.keys()){
            this.removeBuff(buff);
        }
    }

    destroy() {
        super.destroy();
        this.clearBuffs();
        this.gameObject.off('buffApplied', this.addBuff, this);
        this.gameObject.off('buffRemoved', this.removeBuff, this);
        this.gameObject.off('entityDied', this.clearBuffs, this);
    }
}