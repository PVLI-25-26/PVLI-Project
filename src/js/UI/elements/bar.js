import Phaser from "phaser";

/**
 * Reusable Bar UI element.
 * A resusable progress bar (used in health)
 * @class
 * @extends Phaser.GameObjects.Container
 */
export class Bar extends Phaser.GameObjects.Container {
    /**
     * @param {Phaser.Scene} scene - Phaser scene
     * @param {number} x - X position of the container.
     * @param {number} y - Y position of the container.
     * @param {number} width - Width of the bar.
     * @param {number} height - Height of the bar.
     * @param {number} frontColor - Color of the front bar.
     */
    constructor(scene, x, y, width = 200, height = 20, frontColor) {
        super(scene, x, y);

        this.scene = scene;
        this.width = width;
        this.height = height;
        this.value = 1; // normalized value from 0 to 1
        this.attachedTo = null; // { x, y, space: "world" | "screen" }

        // Back bar (used for delayed animation)
        this.backBar = scene.add.rectangle(0, 0, width, height, 0x666666).setOrigin(0, 0.5);
        this.add(this.backBar);

        // Front bar (fill part)
        this.frontBar = scene.add.rectangle(0, 0, width, height, frontColor).setOrigin(0, 0.5);
        this.add(this.frontBar);

        scene.add.existing(this);
    }

    // Universal method to change bars
    _setBarWidth(targetWidth, instant = false, increasing = true) {
        if (increasing) {
            // Increasing: backBar instantly, frontBar smoothly
            this.backBar.width = targetWidth;
            if (instant) {
                this.frontBar.width = targetWidth;
            } else {
                this.scene.tweens.add({
                    targets: this.frontBar,
                    width: targetWidth,
                    duration: 300,
                    ease: 'Power2'
                });
            }
        } else {
            // Decreasing: frontBar instantly, backBar smoothly
            this.frontBar.width = targetWidth;
            if (!instant) {
                this.scene.tweens.add({
                    targets: this.backBar,
                    width: targetWidth,
                    duration: 300,
                    ease: 'Power2'
                });
            }
        }

        this.value = targetWidth / this.width;
    }

    // Sets the color of the back bar
    _setBackBarColor(color) {
        this.backBar.fillColor = color;
    }

    /**
     * Sets the value of the bar.
     * @param {number} value - new normalized value from 0 to 1
     * @param {number} [color] - optional color of the back bar
     */
    setValue(value, color = undefined) {
        value = Phaser.Math.Clamp(value, 0, 1);
        const targetWidth = value * this.width;
        const instant = color === undefined;

        if (color !== undefined) {
            this._setBackBarColor(color);
        }

        if (value > this.value) {
            this._setBarWidth(targetWidth, instant, true);
        } else if (value < this.value) {
            this._setBarWidth(targetWidth, instant, false);
        }
    }
}
