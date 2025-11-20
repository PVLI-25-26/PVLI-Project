import { EventBus } from "../../core/event-bus";
import { BaseAbility } from "./BaseAbility";

/**
 * Dash ability — short, timed burst that moves the player faster.
 *
 * Emits:
 * - 'playerDash' (number) — emitted on activation with dash speed value.
 * - 'playerDashEnd' () — emitted when dash ends.
 *
 * @extends {BaseAbility}
 */
export class Dash extends BaseAbility {
    /**
     * Dash speed value emitted via EventBus when activated.
     * @type {number}
     * @private
     */
    #dashSpeed;

    /**
     * Create a Dash ability.
     * @param {Phaser.Scene} scene - Phaser scene used for timers and event systems.
     * @param {number} coolDown - Cooldown duration in milliseconds after dash ends.
     * @param {number} duration - Active dash duration in milliseconds.
     * @param {number} dashSpeed - Speed value to emit when dash is activated.
     */
    constructor(scene, coolDown, duration, dashSpeed){
        super(scene, coolDown, duration);
        this.scene = scene;
        //Set intial values
        this.#dashSpeed = dashSpeed;
        this.logger = this.scene.plugins.get('logger');
    }

    /**
     * Called when the ability becomes active.
     * @protected
     * @returns {void}
     */
    onAbilityActivated(){
        this.logger.log('ABILITES', 1, 'Dash activated');
        // (listened to by PlayerController)
        EventBus.emit('playerDash', this.#dashSpeed);
    }

    /**
     * Called when the ability deactivates.
     * @protected
     * @returns {void}
     */
    onAbilityDeactivated(){
        this.logger.log('ABILITES', 1, 'Dash ended');
        // (listened to by PlayerController)
        EventBus.emit('playerDashEnd');
    }
}