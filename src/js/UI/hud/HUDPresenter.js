import { EventBus } from "../../core/event-bus.js";
import { worldToScreen } from "../../core/world-screen-space.js";
import Colors from "../../../configs/colors-config.js";
import saveDataManager from "../../core/save-data-manager.js";

export class HudPresenter {
    constructor(view, model) {
        this.view = view;
        this.model = model;

        // Health bars
        EventBus.on('hudPlayerInitialized', this.onPlayerInitialized, this);
        EventBus.on('hudEnemyAdded', this.onEnemyAdded, this);
        EventBus.on('hudBossAdded', this.onBossAdded, this);
        EventBus.on('hudPlayerHealthChanged', this.onPlayerHealthChanged, this);
        EventBus.on('hudEnemyHealthChanged', this.onEnemyHealthChanged, this);
        EventBus.on('hudEnemyPositionUpdated', this.onEnemyPositionUpdated, this);
        EventBus.on('hudEnemyRemoved', this.onEnemyRemoved, this);

        // Gold
        EventBus.on('hudPlayerGoldInitialized', this.onPlayerGoldInitialized, this);
        EventBus.on('hudPlayerGoldChanged', this.onPlayerGoldChanged, this);
        EventBus.on('notEnoughGold', this.onNotEnoughGold, this);

        // Abilities
        EventBus.on('hudPlayerEquippedAbility', this.onPlayerEquippedAbility, this);
        EventBus.on('playerAbilityTriggered', this.onPlayerAbilityTriggered, this);

        // Arrows
        EventBus.on('hudPlayerEquippedArrow', this.onPlayerEquippedArrow, this);
        EventBus.on('hudPlayerArrowsSwitched', this.onPlayerArrowsSwitched, this);

        // Missions
        EventBus.on('hudMissionsInitialized', this.onMissionsInitialized, this);
        EventBus.on('hudMissionAdded', this.onMissionAdded, this);
        EventBus.on('hudMissionCompleted', this.onMissionComplete, this);
        EventBus.on('hudMissionRemoved', this.onMissionRemoved, this);
        EventBus.on('missionProgressUpdated', this.onMissionProgressUpdated, this);

        // Minimap
        this.initializedMinimap();
        this.mapWasOpen = true;
        this.view.scene.input.keyboard.on("keydown-M", ()=>{
            this.view.toggleMinimap();
            EventBus.emit("playSound", this.mapWasOpen?"closeMap":"openMap");
            this.mapWasOpen = !this.mapWasOpen;
        })
    }

    initializedMinimap(){
        this.view.createMinimap(this.model.rooms, this.model.paths, this.model.currentRoomID)
    }

    onPlayerInitialized() {
        this.view.createPlayerHealthBar();
        
        this.setInitialPlayerHealthBarValue();
    }

    onBossAdded() {
        this.view.createBossHealthBar();
    }

    onEnemyAdded(enemy) {
        this.view.createEnemyHealthBar(enemy);
    }

    onPlayerHealthChanged() {
        const normalizedHP = this.model.playerCurrentHP / this.model.playerMaxHP;
        const previousNormalizedHP = this.model.playerPreviousHP / this.model.playerMaxHP;

        const barColor = normalizedHP < previousNormalizedHP ?
        Colors.RedHex : Colors.GreenHex;
        this.view.playerHealthBar.setValue(normalizedHP, barColor);

        const isHeal = normalizedHP > previousNormalizedHP;
        const textColor = isHeal ? Colors.Green : Colors.Red;
        const amount = Math.abs(this.model.playerCurrentHP - this.model.playerPreviousHP);

        this.view.createCombatText(400, 250, amount, textColor);
    }

    onPlayerGoldInitialized(data) {
        this.view.createGoldIndicator(data);
    }

    onPlayerGoldChanged(data) {
        this.view.updateGoldIndicator(data.prev, data.new);
    }

    onNotEnoughGold() {
        this.view.shakeGold();
    }


    onEnemyHealthChanged(enemy) {
        const normalizedHP = this.model.enemies.get(enemy).currentHP / this.model.enemies.get(enemy).maxHP;
        const previousNormalizedHP = this.model.enemies.get(enemy).previousHP / this.model.enemies.get(enemy).maxHP;

        const barColor = normalizedHP < previousNormalizedHP ?
        Colors.RedHex : Colors.GreenHex;
        let healthBar = null;
        if (enemy.type == 'enemy') {
            healthBar = this.view.enemyHealthBars.get(enemy);
        }
        else if (enemy.type == 'boss') {
            healthBar = this.view.bossHealthBar;
        }
        healthBar.setValue(normalizedHP, barColor);

        const mainCamera = this.view.scene.cameras.main;
        const screenPos = worldToScreen(enemy.x, enemy.y, mainCamera);

        const isHeal = normalizedHP > previousNormalizedHP;
        const textColor = isHeal ? Colors.Green : Colors.White;
        const amount = Math.abs(this.model.enemies.get(enemy).currentHP - this.model.enemies.get(enemy).previousHP);

        this.view.createCombatText(screenPos.x, screenPos.y, amount, textColor);
    }

    onEnemyPositionUpdated(enemy, x, y) {
        const mainCamera = this.view.scene.cameras.main;
        const screenPos = worldToScreen(x, y, mainCamera);
        
        const enemyHealthBar = this.view.enemyHealthBars.get(enemy);
        if (enemyHealthBar) {
            let barPosX = screenPos.x - enemyHealthBar.width / 2;
            let barPosY = screenPos.y - 40;
            enemyHealthBar.setPosition(barPosX, barPosY);
        }
    }

    onEnemyRemoved(enemy) {
        this.view.deleteEnemyHealthBar(enemy);
    }

    onCameraRotated(rotation) { 
        if (this.view.playerHealthBar) { 
            this.view.playerHealthBar.setRotation(-rotation); 
        } 
        
        for (const bar of this.view.enemyHealthBars.values()) { 
            bar.setRotation(rotation); 
        }
    }

    setInitialPlayerHealthBarValue() {
        this.view.playerHealthBar.setValue(this.model.playerCurrentHP / this.model.playerMaxHP);
    }

    onPlayerEquippedAbility(){
        this.view.createAbilityIndicator(this.model.playerEquippedAbility?.type);
    }

    onPlayerAbilityTriggered(ability){
        this.view.abilityTriggered(ability.coolDown);
    }

    onPlayerEquippedArrow(){
        this.view.createArrowIndicators(this.model.playerEquippedArrow?.texture, this.model.isSpecialArrowEquipped);
    }

    onPlayerArrowsSwitched(){
        this.view.switchArrowIndicators();
    }

    onMissionsInitialized(){
        this.view.createMissionTexts(this.model.activeMissions);
        this.view.createMissionTexts(this.model.completedMissions, true);
    }

    onMissionAdded(){
        this.view.addMissionText(this.model.activeMissions[this.model.activeMissions.length-1]);
    }

    onMissionComplete(i){
        this.view.completeMission(i);
    }

    onMissionRemoved(i){
        this.view.removeMission(i);
    }

    onMissionProgressUpdated(){
        this.view.updateMissionProgress();
    }
}