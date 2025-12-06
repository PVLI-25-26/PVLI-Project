import { Bar } from "../elements/bar.js";  
import { CombatText } from "../elements/combat-text.js";

export class HudView {
    constructor(scene) {
        this.scene = scene;
        this.playerHealthBar = null;
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

        this.playerHealthBar = new Bar(this.scene, x, y, 300, 25, 0xc20000);
        this.scene.hudLayer.add(this.playerHealthBar);
        this.playerHealthBar.setScrollFactor(0);
        this.scene.hudLayer.add(this.playerHealthBar);
    }

    createEnemyHealthBar(enemy) {
        const x = enemy.x - 50;
        const y = enemy.y - 40;
        const enemyHealthBar = new Bar(this.scene, x, y, 100, 10, 0xc20000);
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
}