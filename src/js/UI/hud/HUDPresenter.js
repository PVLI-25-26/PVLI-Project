import { EventBus } from "../../core/event-bus.js";

export class HudPresenter {
    constructor(view, model) {
        this.view = view;
        this.model = model;

        EventBus.on('hudPlayerInitialized', this.onPlayerInitialized, this);
        EventBus.on('hudEnemyAdded', this.onEnemyAdded, this);
        EventBus.on('hudPlayerHealthChanged', this.onPlayerHealthChanged, this);
        EventBus.on('hudEnemyHealthChanged', this.onEnemyHealthChanged, this);
        EventBus.on('hudEnemyPositionUpdated', this.onEnemyPositionUpdated, this);
    }

    onPlayerInitialized() {
        this.view.createPlayerHealthBar();
        this.setInitialHealthBarValue();
    }

    onEnemyAdded(enemy) {
        this.view.createEnemyHealthBar(enemy);
    }

    onPlayerHealthChanged() {
        const normalizedHP = this.model.playerCurrentHP / this.model.playerMaxHP;
        const previousNormalizedHP = this.model.playerPreviousHP / this.model.playerMaxHP;

        const color = normalizedHP < previousNormalizedHP ?
        0xff5555 : 0x55ff55;
        this.view.playerHealthBar.setValue(normalizedHP, color);
    }

    onEnemyHealthChanged(enemy) {
        const normalizedHP = this.model.enemies.get(enemy).currentHP / this.model.enemies.get(enemy).maxHP;
        const previousNormalizedHP = this.model.enemies.get(enemy).previousHP / this.model.enemies.get(enemy).maxHP;

        const color = normalizedHP < previousNormalizedHP ?
        0xff5555 : 0x55ff55;
        this.view.enemyHealthBars.get(enemy).setValue(normalizedHP, color);
    }

    onEnemyPositionUpdated(enemy, x, y) {
        const enemyHealthBar = this.view.enemyHealthBars.get(enemy);
        if (enemyHealthBar) {
            x -= enemyHealthBar.width / 2;
            y -= 20; // TODO: change magic number to dependency on enemy sprite size
            enemyHealthBar.setPosition(x, y);
        }
    }

    setInitialHealthBarValue() {
        this.view.playerHealthBar.setValue(this.model.playerCurrentHP / this.model.playerMaxHP);
    }
}