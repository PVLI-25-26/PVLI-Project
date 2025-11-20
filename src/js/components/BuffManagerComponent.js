import { BaseComponent } from "../core/base-component";
import { movementBuff } from "./Buffs/MovementBuff";

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
    // health: healthBuff (example)
    // ...
}

/**
 * Component that manages applying and removing timed buffs on a game object.
 * Integrates with the game object's event system to receive 'buffApplied' events.
 * @extends {BaseComponent}
 */
export class BuffManagerComponent extends BaseComponent{
    /**
     * Create a BuffManagerComponent.
     * @param {Phaser.GameObjects.GameObject} gameObject - The game object this component is attached to.
     */
    constructor(gameObject){
        super(gameObject);

        // Maybe we want to do stuff with the timer events later on
        //this.buffs = [];

        // Listen to buffApplied events inside the entity
        this.gameObject.on('buffApplied', this.addBuff, this);
    }
    update(t, dt){
        // Update UI stuff?
    }

     /**
     * Apply a buff described by buffData to the attached game object.
     * Looks up the corresponding BuffLogic by buffData.type and calls its apply/remove methods.
     * A Phaser TimerEvent is scheduled to call remove after buffData.duration milliseconds.
     *
     * @param {BuffData} buffData - Data describing the buff to apply.
     * @returns {void}
     */
    addBuff(buffData){
        // Apply buff using each buff logic depending on type
        buffTypeToBuffLogic[buffData.type].apply(buffData.value, this.gameObject)

        // Add timer for buff duration end to remove buff
        const buff = this.gameObject.scene.time.addEvent({
                        delay: buffData.duration,
                        callback: ()=>{
                            buffTypeToBuffLogic[buffData.type].remove(buffData.value, this.gameObject)
                        },
                        loop: false,
                        repeat: 0
                    });

        // Save buff in buffs array
        //this.buffs.push(buff);
    }
}