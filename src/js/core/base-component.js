/**
 * Base component for ECS-like architecture.
 * @class BaseComponent
 * @property {Phaser.GameObjects.GameObject} entity - Reference to the Phaser object that owns this component
 */
export default class BaseComponent {
    /**
     * Creates a new BaseComponent attached to a Phaser entity.
     * @param {Phaser.GameObjects.GameObject} entity - The Phaser object this component is attached to
     */
    constructor(entity) {
        /**
         * Reference to the Phaser object that owns this component
         * @type {Phaser.GameObjects.GameObject}
         */
        this.entity = entity;
    }

    /**
     * Update method called every frame.
     * Should be overridden in child classes.
     * @param {number} delta - Time elapsed since last frame in milliseconds
     * @memberof BaseComponent
     */
    update(delta) {}
}
