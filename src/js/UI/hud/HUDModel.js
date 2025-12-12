import dungeonConfig from "../../../configs/Dungeon/dungeon.json";
import { EventBus } from "../../core/event-bus.js";
import Phaser from "phaser";
import { getCustomTiledProperty, getTiledMapLayer } from "../../core/tiled-parser.js";
import saveDataManager from "../../core/save-data-manager.js";

export class HudModel {
    constructor(scene) {
        this.scene = scene;

        this.playerMaxHP;
        this.playerCurrentHP;
        this.playerPreviousHP; // used for bar animation color (damage/heal)
        this.playerGold = 0;
        this.playerEquippedAbility = null;
        this.playerEquippedArrow = null;
        this.isSpecialArrowEquipped;
        this.activeMissions = [];
        this.completedMissions = [];
        this.enemies = new Map(); // enemy => { x, y, maxHP, currentHP, previousHP }

        // Health bars
        EventBus.on('playerHealthInitialized', this.onPlayerHealthInitialized, this);
        EventBus.on('enemyHealthInitialized', this.onEnemyInitialized, this);
        EventBus.on('bossHealthInitialized', this.onBossInitialized, this);
        EventBus.on('entityMoved', this.onEntityMoved, this);
        EventBus.on('entityDamaged', this.onEntityDamaged, this);
        EventBus.on('entityHealed', this.onEntityHealed, this);
        EventBus.on('entityDied', this.onEntityDied, this);

        // Gold
        EventBus.on('playerGoldChanged', this.onPlayerGoldChanged, this);
        EventBus.on('playerGoldInitialized', this.onPlayerGoldInitialized, this);

        // Abilities
        EventBus.on('abilityEquipped', this.onPlayerAbilityEquipped, this);

        // Arrows
        EventBus.on('arrowEquipped', this.onPlayerArrowEquipped, this);
        EventBus.on('playerArrowsSwitched', this.onPlayerArrowsSwitched, this);
        this.isSpecialArrowEquipped = saveDataManager.getData("isSpecialArrowActive");

        // Missions
        EventBus.on('missionsInitialized', this.onMissionsInitialized, this);
        EventBus.on('missionAccepted', this.onMissionAccepted, this);
        EventBus.on('missionCompleted', this.onMissionCompleted, this);
        EventBus.on('missionRemoved', this.onMissionRemoved, this);

        // Minimap
        this.rooms = new Map();
        this.paths = [];
        this.currentRoomID;
        this.loadMiniMapData();
    }

    loadMiniMapData(){
        const dungeonGenerator = this.scene.plugins.get("dungeon");
        this.currentRoomID = dungeonGenerator.currentRoomKey;
        const dungeonMap = getTiledMapLayer(dungeonConfig, "Dungeon");
        let hubID;
        dungeonMap.forEach((room)=>{
            if(room.name == "Hub") hubID = room.id;
            this.rooms.set(room.id, {name: room.name, x: room.x, y: room.y});
            room.properties?.forEach((connection)=>{
                if(connection.value.scene != hubID){
                    this.paths.push({from: room.id, to: connection.value.scene});
                }
            })
        })
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

    // data = { enemy, maxHP }
    onBossInitialized(data) {
        this.enemies.set(data.enemy, { x: data.enemy.x, y: data.enemy.y, maxHP: data.maxHP, currentHP: data.maxHP });
        EventBus.emit('hudBossAdded', data.enemy);
    }

    // data = Gold amount
    onPlayerGoldInitialized(data){
        this.playerGold = data;
        EventBus.emit('hudPlayerGoldInitialized', data);
    }

    // data = Gold amount
    onPlayerGoldChanged(data){
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
        if ((entity.type == 'enemy' || entity.type == 'boss') && this.enemies.has(entity)) {
            this.setEnemyHealth(entity, this.enemies.get(entity).currentHP - data.amount);
        }
    }

    onEntityHealed(data) {
        if (data.entity.type == 'player') {
            this.setPlayerHealth(this.playerCurrentHP + data.amount);
            return;
        }
        if ((data.entity.type == 'enemy' || data.entity.type == 'boss') && this.enemies.has(data.entity)) {
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

    onPlayerAbilityEquipped(ability){
        this.playerEquippedAbility = ability;
        EventBus.emit('hudPlayerEquippedAbility');
    }

    onPlayerArrowEquipped(arrow){
        this.playerEquippedArrow = arrow;
        EventBus.emit('hudPlayerEquippedArrow');
    }

    onPlayerArrowsSwitched(){
        this.isSpecialArrowEquipped = !this.isSpecialArrowEquipped;
        EventBus.emit('hudPlayerArrowsSwitched');
    }

    onMissionsInitialized(data){
        this.activeMissions = data.activeMissions;
        this.completedMissions = data.completedMissions;
        EventBus.emit('hudMissionsInitialized');
    }

    onMissionAccepted(mission){
        EventBus.emit('hudMissionAdded');
    }

    onMissionCompleted(i){
        EventBus.emit('hudMissionCompleted', i);
    }

    onMissionRemoved(i){
        EventBus.emit('hudMissionRemoved', i);
    }
}

