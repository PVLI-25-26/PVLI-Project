import { BaseComponent } from "../core/base-component.js";
import { MovementComponent } from "./Movement.js";
import serviceLocator, { SERVICE_KEYS } from '../core/service-locator.js';
import { LOG_LEVELS } from '../core/logger.js';

/**
 * Base class for controller components.
 * Handles automatic linking to a MovementComponent if present.
 * @extends BaseComponent
 */
export class BaseControllerComponent extends BaseComponent {
    /**
     * Creates a new controller component.
     * @param {Phaser.GameObjects.GameObject} gameObject - The GameObject this controller is attached to.
     */
    constructor(gameObject) {
        super(gameObject);

        /**
         * Reference to the MovementComponent on the same GameObject.
         * @type {MovementComponent|null}
         */
        this.movementComponent = this.findMovementComponent();

        if (!this.movementComponent) {
            const logger = serviceLocator.getService(SERVICE_KEYS.LOGGER);
            logger.log(
                'COMPONENTS',
                LOG_LEVELS.ERROR,
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
     */
    destroy() {
        super.destroy();
    }
}
