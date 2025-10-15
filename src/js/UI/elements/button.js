import Phaser from "phaser";

/**
 * A simple interactive text-based button component.
 * Displays a label and emits events when hovered or clicked.
 *
 * @class
 * @category UI
 * @extends Phaser.GameObjects.Text
 * @param {Phaser.Scene} scene - The scene this button belongs to.
 * @param {number} x - The x-coordinate of the button's position.
 * @param {number} y - The y-coordinate of the button's position.
 * @param {string} text - The text displayed on the button.
 * @param {Function} callback - Function to call when the button is clicked.
 *
 * @example
 * const startButton = new Button(this, 400, 300, "Start Game", () => {
 *     console.log("Button clicked!");
 * }).on("button-clicked", () => console.log("Custom event fired!"));
 */
export class Button extends Phaser.GameObjects.Text {
    constructor(scene, x, y, text, callback) {
        super(scene, x, y, text, {
            fontSize: "32px",
            color: "#b2b2b2ff",
            padding: { x: 20, y: 10 },
        });

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
    }

    /**
     * Adds custom interaction setup logic to the button.
     * Allows adding event listeners or animations externally.
     *
     * @param {Function} setupFunction - A function that receives this button instance.
     * @returns {Button} The current button instance for method chaining.
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
     * @fires Button#button-clicked
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
     * @fires Button#button-hovered
     * @returns {void}
     */
    invokeHover() {
        this.emit("button-hovered", this);
    }
}

/**
 * Fired when the button is clicked.
 * @event Button#button-clicked
 * @type {Button}
 */

/**
 * Fired when the pointer hovers over the button.
 * @event Button#button-hovered
 * @type {Button}
 */
