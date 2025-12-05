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

    spawn() {
        this.scene.tweens.add({
            targets: this,
            y: this.y - 80,   
            alpha: 0,
            duration: 1200,
            ease: 'Power1',
            onComplete: () => {
                this.destroy();
            }
        });
    }
}
