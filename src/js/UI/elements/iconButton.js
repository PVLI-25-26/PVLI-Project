import Phaser from "phaser";

/**
 * A simple interactive text-based button component.
 * Displays a label and emits events when hovered or clicked.
 *
 * @class
 * @category UI
 * @extends Phaser.GameObjects.Image
 * @param {Phaser.Scene} scene - The scene this button belongs to.
 * @param {number} x - The x-coordinate of the button's position.
 * @param {number} y - The y-coordinate of the button's position.
 * @param {image} image - The image displayed on the button.
 * @param {number} scale - scale of the image
 * @param {Function} callback - Function to call when the button is clicked.
 *
 * @example
 * const startButton = new Button(this, 400, 300, "Start Game", () => {
 *     console.log("Button clicked!");
 * }).on("button-clicked", () => console.log("Custom event fired!"));
 */
export class IconButton extends Phaser.GameObjects.Image {
    constructor(scene, x, y, image,scale, callback) {
        super(scene, x, y, image);

        /**
         * Reference to the Phaser scene this button belongs to.
         * @type {Phaser.Scene}
         */
        this.scene = scene;

        /**
         * Function to execute when the button is clicked.
         * @type {Function}
         */
        this.callback = callback;

        scene.add.existing(this);

        this.setInteractive({ useHandCursor: true });
        this.setOrigin(0.5);
        this.setScale(scale)
    }

    /**
     * Adds custom interaction setup logic to the button.
     * Allows adding event listeners or animations externally.
     *
     * @param {Function} setupFunction - A function that receives this button instance.
     * @returns {IconButton} The current button instance for method chaining.
     *
     * @example
     * button.addInteraction((btn) => {
     *     btn.on("pointerdown", () => btn.invokeClick());
     *     btn.on("pointerover", () => btn.invokeHover());
     * });
     */
    addInteraction(setupFunction) {
        if (typeof setupFunction === "function") {
            setupFunction(this);
        }
        return this; 
    }

    /**
     * Triggers the button click behavior.
     * Emits a `button-clicked` event and calls the provided callback.
     *
     * @fires ButtonIcon#button-clicked
     * @returns {void}
     */
    invokeClick() {
        this.emit("button-clicked", this);
        if (typeof this.callback === "function") {
            this.callback(this);
        }
    }

    /**
     * Triggers the button hover behavior.
     * Emits a `button-hovered` event.
     *
     * @fires ButtonIcon#button-hovered
     * @returns {void}
     */
    invokeHover() {
        this.emit("button-hovered", this);
    }
}

/**
 * Fired when the button is clicked.
 * @event ButtonIcon#button-clicked
 * @type {IconButton}
 */

/**
 * Fired when the pointer hovers over the button.
 * @event ButtonIcon#button-hovered
 * @type {IconButton}
 */
