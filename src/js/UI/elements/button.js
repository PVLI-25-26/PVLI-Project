import Phaser from "phaser";

/**
 * A simple interactive text-based button component.
 * Displays a label and emits events when hovered or clicked.
 *
 * @class
 * @category UI
 * @extends Phaser.GameObjects.Image
 *
 * @param {Phaser.Scene} scene - The scene this button belongs to.
 * @param {number} x - The x-coordinate of the button's position.
 * @param {number} y - The y-coordinate of the button's position.
 * @param {Function} callback - Function to call when the button is invoked/clicked.
 * @param {number} width - Logical width used to layout children and interaction area.
 * @param {number} height - Logical height used to layout children and interaction area.
 * @param {Object|null} [textSettings=null] - Optional text settings. If provided a label will be created.
 * @param {string} textSettings.text - The label string.
 * @param {Object} textSettings.style - Phaser text style config passed to scene.add.text.
 * @param {Object|null} [ninesliceSettings=null] - Optional nine-slice background settings. If provided a nineslice is created.
 * @param {string} ninesliceSettings.texture - Texture key for the nineslice.
 * @param {string|number} [ninesliceSettings.frame] - Optional frame for the nineslice texture.
 * @param {number} ninesliceSettings.leftWidth - Nine-slice left slice width.
 * @param {number} ninesliceSettings.rightWidth - Nine-slice right slice width.
 * @param {number} ninesliceSettings.topHeight - Nine-slice top slice height.
 * @param {number} ninesliceSettings.bottomHeight - Nine-slice bottom slice height.
 * @param {number} [ninesliceSettings.scale=1] - Scale applied to the nineslice when computing interaction area.
 *
 * @example
 * const startButton = new Button(this, 400, 300, "Start Game", () => {
 *     console.log("Button clicked!");
 * }).on("button-clicked", () => console.log("Custom event fired!"));
 */
export class Button extends Phaser.GameObjects.Container {
    constructor(scene, x, y, callback, width, height,
        textSettings = null, ninesliceSettings = null) {
        super(scene, x, y);

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

        // Make button background if settings provided
        if(ninesliceSettings){
            this.buttonNineslice = this.scene.add.nineslice(
                width/2,
                height/2,
                ninesliceSettings.texture,
                ninesliceSettings.frame,
                width,
                height,
                ninesliceSettings.leftWidth,
                ninesliceSettings.rightWidth,
                ninesliceSettings.topHeight,
                ninesliceSettings.bottomHeight
            ).setOrigin(0.5);
            this.buttonNineslice.setScale(ninesliceSettings.scale);
            this.add(this.buttonNineslice);
        }
        // Make button text if settings provided
        if(textSettings){
            this.buttonText = this.scene.add.text(
                width/2,
                height/2,
                textSettings.text,
                textSettings.style
            ).setOrigin(0.5);
            this.add(this.buttonText);
        }

        // If the button has nineslice, make the nineslice the interact area, otherwise, use width and height given
        let interactRect;
        if(ninesliceSettings){
            // Has to move the area manually because ninslice origin is 0.5
            interactRect = new Phaser.Geom.Rectangle(this.buttonNineslice.x-width*this.buttonNineslice.scale/2, this.buttonNineslice.y-height*this.buttonNineslice.scale/2, width*this.buttonNineslice.scale, height*this.buttonNineslice.scale);
            // Debug rect
            // this.add(this.scene.add.rectangle(this.buttonNineslice.x-width*this.buttonNineslice.scale/2, this.buttonNineslice.y-height*this.buttonNineslice.scale/2, width*this.buttonNineslice.scale, height*this.buttonNineslice.scale, 0, 0.5).setOrigin(0))
        }
        else{
            interactRect = new Phaser.Geom.Rectangle(0, 0, width, height)
            // Debug rect
            // this.add(this.scene.add.rectangle(0, 0, width, height, 0, 0.5).setOrigin(0))
        }

        this.setInteractive(
            interactRect,
            Phaser.Geom.Rectangle.Contains
        );

        this.scene.add.existing(this);
    }

    //Change text

    
    /**
     * Adds custom interaction setup logic to the button.
     * Allows adding event listeners or animations externally.
     *
     * @param {Function} setupFunction - A function that receives this button instance.
     * @returns {ButtonIcon} The current button instance for method chaining.
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
 * @type {ButtonIcon}
 */

/**
 * Fired when the pointer hovers over the button.
 * @event ButtonIcon#button-hovered
 * @type {ButtonIcon}
 */
