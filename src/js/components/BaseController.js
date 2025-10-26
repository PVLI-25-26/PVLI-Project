import { BaseComponent } from "../core/base-component.js";
import { MovementComponent } from "./Movement.js";
import { Logger } from '../core/logger.js';

/**
 * Base class for controller components.
 * Requires a MovementComponent to be attached to the same GameObject.
 *
 * @class
 * @category Components
 * @extends BaseComponent
 * @param {Phaser.GameObjects.GameObject} gameObject - The GameObject this controller is attached to.
 */
export class BaseControllerComponent extends BaseComponent {
    /**
     * Reference to the MovementComponent on the same GameObject.
     * @type {MovementComponent|null}
     */
    movementComponent;

    constructor(gameObject) {
        super(gameObject);

        this.movementComponent = this.findMovementComponent();

        if (!this.movementComponent) {
            const logger = this.gameObject.scene.plugins.get('logger');
            logger.log(
                'COMPONENTS',
                Logger.LOG_LEVELS.ERROR,
                `Requires a MovementComponent on GameObject: ${this.gameObject.constructor.name}`
            );
        }
    }

    /**
     * Finds a MovementComponent attached to the same GameObject.
     * @returns {MovementComponent|null} The found MovementComponent, or null if not found.
     */
    findMovementComponent() {
        return this.getComponent(MovementComponent);
    }

    /**
     * Cleans up the component, disabling it.
     * Calls the parent destroy method.
     * @returns {void}
     */
    destroy() {
        super.destroy();
    }
}
