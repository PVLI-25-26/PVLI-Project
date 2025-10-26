/**
 * Configuration for player control keys (WASD).
 * @param {Phaser.Scene} scene
 * @returns {Phaser.Types.Input.Keyboard.CursorKeys}
 */
export default function createPlayerKeys(scene) {
    return scene.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        rotCamLeft: Phaser.Input.Keyboard.KeyCodes.LEFT,
        rotCamRight: Phaser.Input.Keyboard.KeyCodes.RIGHT
    });
}
