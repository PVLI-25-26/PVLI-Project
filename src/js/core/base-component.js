/**
 * Base class for GameObject components.
 * Components can add behavior and state to a GameObject using composition.
 * @class BaseComponent
 */
export class BaseComponent {
    /**
     * Creates a component and registers it on the GameObject.
     * @param {Phaser.GameObjects.GameObject} gameObject - The GameObject this component is attached to
     */
    constructor(gameObject) {
        /**
         * The GameObject this component is attached to
         * @type {Phaser.GameObjects.GameObject}
         */
        this.gameObject = gameObject;

        /**
         * Whether the component is enabled
         * @type {boolean}
         */
        this.enabled = true;
        
        // Register the component on the GameObject
        this.register();
    }

    /**
     * Registers the component in the GameObject's component array
     */
    register() {
        if (!this.gameObject.components) {
            this.gameObject.components = [];
        }
        this.gameObject.components.push(this);
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
     * After calling this, update() will no longer be executed.
     */
    destroy() {
        this.enabled = false;
    }
}
