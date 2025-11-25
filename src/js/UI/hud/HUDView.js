import { Bar } from "../elements/bar.js";  

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
        this.playerHealthBar.setScrollFactor(0);
    }

    createEnemyHealthBar(enemy) {
        const x = enemy.x - 50;
        const y = enemy.y - 40;
        const enemyHealthBar = new Bar(this.scene, x, y, 100, 10, 0xc20000);
        this.enemyHealthBars.set(enemy, enemyHealthBar);
    }
}
