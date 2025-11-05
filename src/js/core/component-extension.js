import { BaseComponent } from './base-component.js';

/**
 * Adds a component system to any Phaser GameObject, allowing to attach multiple components,
 * automatically update them each frame, and clean them up on destroy.
 * 
 * This mixin extends the GameObject with:
 * - `components` array
 * - `addComponent(component)` method
 * - `getComponent(ComponentClass)` method
 * - `updateComponents(time, delta)` method
 * 
 * It also subscribes to the scene's 'update' event and automatically unsubscribes and destroys
 * components when the GameObject is destroyed.
 * 
 * @param {Phaser.GameObjects.GameObject} gameObject - The GameObject to extend with component functionality.
 * @returns {Phaser.GameObjects.GameObject} The same GameObject with component system added.
 */
export function extendWithComponents(gameObject) {
    /**
     * Array of attached components. 
     * @type {BaseComponent[]}
     */
    gameObject.components = [];

    /**
     * Adds a component to this GameObject.
     * @param {BaseComponent} component - The component instance to attach.
     * @returns {BaseComponent} The added component.
     */
    gameObject.addComponent = function(component) {
        this.components.push(component);
        return component;
    };

    /**
     * Retrieves the first component of the specified class attached to this GameObject.
     * @param {Function} ComponentClass - The class/type of the component to retrieve.
     * @returns {BaseComponent|null} The found component or null if not found.
     */
    gameObject.getComponent = function(ComponentClass) {
        return this.components.find(c => c instanceof ComponentClass) || null;
    };

    /**
     * Calls `update` on all enabled components attached to this GameObject.
     * @param {number} time - Current time.
     * @param {number} delta - Time elapsed since last frame in ms.
     */
    gameObject.updateComponents = function(time, delta) {
        this.components.forEach(c => {
            if (c.enabled && c.gameObject.active) c.update(time, delta);
        });
    };

    // --- Auto subscribe to scene update ---
    if (gameObject.scene) {
        gameObject.scene.events.on('update', gameObject.updateComponents, gameObject);

        // Auto cleanup on destroy
        gameObject.once('destroy', () => {
            gameObject.scene.events.off('update', gameObject.updateComponents, gameObject);
            gameObject.components.forEach(c => c.destroy());
            gameObject.components = [];
        });
    }

    return gameObject;
}
