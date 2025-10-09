import BaseComponent from "../core/base-component.js";


/**
 * Base class for all controller components.
 * @class BaseController
 * @extends BaseComponent
 * @property {Movement} movement - Reference to the Movement component
 */
export default class BaseController extends BaseComponent {
    /**
     * @param {Phaser.GameObjects.GameObject} entity - The entity this controller is attached to
     * @param {import("./Movement.js").default} movement - Reference to the Movement component
     */
    constructor(entity, movement) {
        super(entity);
        this.movement = movement;
    }

    /**
     * Called every frame. Should be overridden by subclasses.
     * @param {number} delta - Time elapsed since last frame in milliseconds
     */
    update(delta) {}
}
