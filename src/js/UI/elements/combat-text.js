/**
 * UI damage numbers that appear when an entity is hit
 * 
 * @class
 * @extends Phaser.GameObjects.Text
 */
export class CombatText extends Phaser.GameObjects.Text {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {number} amount - число показанное в тексте
     * @param {boolean} isHeal - true если лечение
     */
    constructor(scene, x, y, amount, color) {
        super(scene, x, y, amount.toString(), {
            fontSize: '18px',
            fontFamily: 'MicroChat',
            color: color,
            stroke: '#000',
            strokeThickness: 2
        });

        this.scene = scene;
        scene.add.existing(this);

        this.setOrigin(0.5);

        this.spawn();
    }

    /**
     * Spawns the number, moving upwards and slowling fading out.
     * Once number isn't visible, it is destroyed automatically;
     */
    spawn() {
        this.scene.tweens.add({
            targets: this,
            y: this.y - 80,   
            alpha: 0,
            duration: 1200,
            ease: 'Power1',
            onComplete: () => {
                // Maybe use true here? - Isasi (IDK maybe you actually reuse it)
                this.destroy();
            }
        });
    }
}
