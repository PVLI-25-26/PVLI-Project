import { Bar } from "../elements/bar.js";  
import { CombatText } from "../elements/combat-text.js";
import Colors from "../../../configs/colors-config.js";

export class HudView {
    constructor(scene) {
        this.scene = scene;
        this.playerHealthBar = null;
        this.goldSprite = null;
        this.goldText = null;
        this.enemyHealthBars = new Map();
    }
// To DO:
/*
- indicador de flechas como objeto encopsulado(cajita de flecha)
*/
    setPresenter(presenter) {
        this.presenter = presenter;
    }

    createPlayerHealthBar() {
        const x = 50;
        const y = 40;

        this.playerHealthBar = new Bar(this.scene, x, y, 300, 25, Colors.RedHex);
        this.scene.hudLayer.add(this.playerHealthBar);
        this.playerHealthBar.setScrollFactor(0);
    }

    createEnemyHealthBar(enemy) {
        const x = enemy.x - 50;
        const y = enemy.y - 40;
        const enemyHealthBar = new Bar(this.scene, x, y, 100, 10, Colors.RedHex);
        this.enemyHealthBars.set(enemy, enemyHealthBar);
        enemyHealthBar.setScrollFactor(0);
        this.scene.hudLayer.add(enemyHealthBar);
    }

    createCombatText(x, y, amount, isHeal = false) {
        const combatText = new CombatText(this.scene, x, y, amount, isHeal);
        combatText.setScrollFactor(0);
        this.scene.hudLayer.add(combatText);
    }

    deleteEnemyHealthBar(enemy) {
        if (this.enemyHealthBars.has(enemy)) {
            this.enemyHealthBars.get(enemy).destroy();
            this.enemyHealthBars.delete(enemy);
        }
    }   

    createGoldIndicator(gold){
        const x = this.scene.cameras.main.width - 50;
        const y = 45;

        // Create Gold Sprite icon
        this.goldSprite = this.scene.add.image(x, y, 'gold', 0).setOrigin(1).setScale(2);
        this.scene.hudLayer.add(this.goldSprite);
        this.goldSprite.setScrollFactor(0);

        // Set item gold value text
        this.goldText = this.scene.add.text(this.goldSprite.x-this.goldSprite.width-10, this.goldSprite.y, gold, {
            color: Colors.Orange,
            fontSize: 10,
            fontFamily: 'MicroChat'
        }).setOrigin(1,1);
        this.scene.hudLayer.add(this.goldText);
        this.goldText.setScrollFactor(0);
    }

    updateGoldIndicator(prevValue, newValue){
        const prevGoldText = prevValue;
        this.scene.tweens.addCounter({
            targets: this.goldText,
            text: newValue,
            duration: 1000,
            ease: 'Cubic.easeInOut',
            onUpdate: (tween, target, key, current, prev, param)=>{
                this.goldText.setText((Number(prevGoldText) + Math.round(current*(Number(newValue)-Number(prevGoldText)))));
            },
            onComplete: (tween)=>{
                tween.destroy(true);
                this.goldText.setText(newValue);
            }
        });
        
        const addedGold = Number(newValue)-Number(prevGoldText);
        const addedGoldIndicator = this.scene.add.text(this.goldText.x, this.goldText.y+this.goldText.height, 
            (addedGold<=0?"":"+") + addedGold, 
        {
            color: Colors.Orange,
            fontSize: 10,
            fontFamily: 'MicroChat'
        }).setOrigin(1,1);
        this.scene.hudLayer.add(addedGoldIndicator);
        addedGoldIndicator.setScrollFactor(0);

        this.scene.tweens.add({
            targets: addedGoldIndicator,
            y: '+=20',
            duration: 700,
            yoyo: true,
            ease: 'Power2',
        });
        this.scene.tweens.add({
            targets: addedGoldIndicator,
            delay: 1000,
            alpha: 0,
            duration: 400,
            ease: 'Power2',
            onComplete: (tween)=>{
                tween.destroy;
                addedGoldIndicator.destroy(true);
            }
        });
    }
}