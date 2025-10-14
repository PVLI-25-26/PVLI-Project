/**
 * Base class for GameObject components.
 * Components can add behavior and state to a GameObject using composition.
 *
 * @class
 * @category Core
 * @param {Phaser.GameObjects.GameObject} gameObject - The GameObject this component is attached to
 */
export class BaseComponent {
    /**
     * The GameObject this component is attached to
     * @type {Phaser.GameObjects.GameObject}
     */
    gameObject;

    /**
     * Whether the component is enabled
     * @type {boolean}
     */
    enabled = true;

    constructor(gameObject) {
        this.gameObject = gameObject;

        // Register the component on the GameObject
        this.register();
    }

    /**
     * Registers the component in the GameObject's component array.
     * Initializes the array if it doesn't exist.
     * @returns {BaseComponent} The registered component
     */
    register() {
        if (!this.gameObject.components) {
            /** @type {BaseComponent[]} */
            this.gameObject.components = [];
        }
        this.gameObject.components.push(this);
        return this;
    }

    /**
     * Get a component by class type.
     * @param {Function} ComponentClass - The constructor of the component to search for
     * @returns {BaseComponent|null} The found component, or null if not found
     */
    getComponent(ComponentClass) {
        return this.gameObject.components?.find(c => c instanceof ComponentClass) || null;
    }

    /**
     * Deactivates the component.
     * After calling this, the component will be considered disabled and update() should not be executed.
     * @returns {void}
     */
    destroy() {
        this.enabled = false;
    }
}
