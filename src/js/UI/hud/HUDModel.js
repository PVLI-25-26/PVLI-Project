import { EventBus } from "../../core/event-bus.js";
import Phaser from "phaser";

export class HudModel {
    constructor() {
        this.playerMaxHP;
        this.playerCurrentHP;
        this.playerPreviousHP; // used for bar animation color (damage/heal)
        this.playerGold = 0;
        this.enemies = new Map(); // enemy => { x, y, maxHP, currentHP, previousHP }

        EventBus.on('playerHealthInitialized', this.onPlayerHealthInitialized, this);
        EventBus.on('enemyHealthInitialized', this.onEnemyInitialized, this);
        EventBus.on('playerGoldChanged', this.onPlayerGoldChanged, this);
        EventBus.on('playerGoldInitialized', this.onPlayerGoldInitialized, this);
        EventBus.on('entityMoved', this.onEntityMoved, this);
        EventBus.on('entityDamaged', this.onEntityDamaged, this);
        EventBus.on('entityHealed', this.onEntityHealed, this);
        EventBus.on('entityDied', (entity) => this.onEntityDied(entity), this);
    }

    // data = { maxHP }
    onPlayerHealthInitialized(data) {
        this.playerMaxHP = data.maxHP;
        this.playerCurrentHP = data.maxHP;
        this.playerPreviousHP = data.maxHP;
        EventBus.emit('hudPlayerInitialized');
    }

    // data = { enemy, maxHP }
    onEnemyInitialized(data) {
        this.enemies.set(data.enemy, { x: data.enemy.x, y: data.enemy.y, maxHP: data.maxHP, currentHP: data.maxHP });
        EventBus.emit('hudEnemyAdded', data.enemy);
    }

    // data = Gold amount
    onPlayerGoldInitialized(data){
        this.playerGold = data;
        EventBus.emit('hudPlayerGoldInitialized', data);
    }

    // data = Gold amount
    onPlayerGoldChanged(data){
        console.log(`${this.playerGold} => ${data}`);
        EventBus.emit('hudPlayerGoldChanged', {prev: this.playerGold, new: data});
        this.playerGold = data;
    }

    // data = { entity, x, y }
    onEntityMoved(data) {
        if (data.entity.type == 'enemy' && this.enemies.has(data.entity)) {
            this.enemies.get(data.entity).x = data.x;
            this.enemies.get(data.entity).y = data.y;
            EventBus.emit('hudEnemyPositionUpdated', data.entity, data.x, data.y);
        }
        else if (data.entity.type == 'player') {
            EventBus.emit('hudPlayerPositionUpdated', data.x, data.y);
        }
    }

    // data = { entity, amount, currentHP }
    onEntityDamaged(data) {
        const entity = data.entity;
        if (entity.type == 'player') {
            this.setPlayerHealth(this.playerCurrentHP - data.amount);
        }
        if (entity.type == 'enemy') {
            this.setEnemyHealth(entity, this.enemies.get(entity).currentHP - data.amount);
        }
    }

    // TODO: still not used anywhere
    onEntityHealed(data) {
        if (data.entity.type == 'player') {
            this.setPlayerHealth(this.playerCurrentHP + data.amount);
            return;
        }
        if (data.entity.type == 'enemy') {
            this.setEnemyHealth(data.entity, this.enemies.get(data.entity).currentHP + data.amount);
        }
    }

    onEntityDied(entity) {
        if (entity.type == 'enemy' && this.enemies.has(entity)) {
            this.enemies.delete(entity);
            EventBus.emit('hudEnemyRemoved', entity);
        }
    }

    
    setEnemyHealth(enemy, value) {
        if (!this.enemies.has(enemy)) return;
        const enemyData = this.enemies.get(enemy);
        enemyData.previousHP = enemyData.currentHP;
        enemyData.currentHP = Phaser.Math.Clamp(value, 0, enemyData.maxHP);
        EventBus.emit('hudEnemyHealthChanged', enemy);
    }

    setPlayerHealth(value) {
        this.playerPreviousHP = this.playerCurrentHP;
        this.playerCurrentHP = Phaser.Math.Clamp(value, 0, this.playerMaxHP);
        EventBus.emit('hudPlayerHealthChanged');
    }
}

