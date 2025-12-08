import {EventBus} from "./event-bus"
import missionsConfig from "../../configs/Missions/missions-config.json"
import saveDataManager from "./save-data-manager";

class MissionManager{
    enemiesKilled = 0;

    healthFlowersGathered = 0;
    speedVasesGathered = 0;
    damageRocksGathered = 0;
    itemsGathered = 0;
    itemsConsumed = 0;

    damageTaken = 0;
    damageDealt = 0;
    roomsCleared = 0;

    activeMissions = [];
    completedMissions = [];


    constructor(){
        
    }

    subscribeToEvents(scene){
        this.logger = scene.plugins.get('logger');

        EventBus.on("entityDied", this.onEntityDied, this);
        EventBus.on("itemPicked", this.onItemPicked, this);
        EventBus.on("itemConsumed", this.onItemConsumed, this);
        EventBus.on("entityDamaged", this.onEntityDamaged, this);
        EventBus.on("roomCleared", this.onRoomCleared, this);
        EventBus.on("hubReached", this.resetCounters, this);
        EventBus.on("missionRejected", this.onMissionRejected, this);
        EventBus.on("missionAccepted", this.onMissionAccepted, this);

        // reset completed mission to player completed missions
        this.completedMissions = saveDataManager.getData('completedMissions') || [];

        EventBus.emit('missionsInitialized', {activeMissions: this.activeMissions, completedMissions: this.completedMissions});
    }

    onMissionRejected(){
        // Pop last added mission (missions are activated when NPCs request for a random missions to manager, however if player rejects the mission last added mission is removed)
        this.activeMissions.pop();
        this.logger.log('MISSION', 0, `Mission rejected: ${JSON.stringify(this.activeMissions)}`);
    }

    onMissionAccepted(){
        EventBus.emit('missionAdded', this.activeMissions[this.activeMissions.length-1]);
    }

    onEntityDied(entity){
        if(entity.type == 'enemy'){
            this.enemiesKilled++;
            this.logger.log('MISSION', 0, `Enemies Killed: ${this.enemiesKilled}`);
            this.onCounterModified();
        }
    }

    onEntityDamaged(data){
        if(data.entity.type == 'enemy'){
            this.damageDealt += data.amount;
            this.logger.log('MISSION', 0, `Damage dealt: ${this.damageDealt}`);
            this.onCounterModified();
        }
        else if(data.entity.type == 'player'){
            this.damageTaken += data.amount;
            this.logger.log('MISSION', 0, `Damage taken: ${this.damageTaken}`);
            this.onCounterModified();
        }
    }

    onItemPicked(actor, reciever){
        switch(reciever.key.type){
            case "health-flower":
                this.healthFlowersGathered++;
                this.logger.log('MISSION', 0, `Health flowers gathered: ${this.healthFlowersGathered}`);
                break;
            case "speed-vase":
                this.speedVasesGathered++;
                this.logger.log('MISSION', 0, `Speed vases gathered: ${this.speedVasesGathered}`);
                break;
            case "damage-rock":
                this.damageRocksGathered++;
                this.logger.log('MISSION', 0, `Damage rocks gathered: ${this.damageRocksGathered}`);
                break;
        }
        this.itemsGathered++;
        this.logger.log('MISSION', 0, `Items gathered: ${this.itemsGathered}`);
        this.onCounterModified();
    }

    onItemConsumed(item){
        this.itemsConsumed++;
        this.logger.log('MISSION', 0, `Items consumed: ${this.itemsConsumed}`);
        this.onCounterModified();
    }

    onRoomCleared(){
        this.roomsCleared++;
        this.logger.log('MISSION', 0, `Rooms cleared: ${this.roomsCleared}`);
        this.onCounterModified();
    }

    onCounterModified(){
        // When a counter is modified, check complete conditions of every active mission
        for(let i = 0; i < this.activeMissions.length; i++){
            const mission = this.activeMissions[i];
            let isMissionComplete = true;
            this.logger.log('MISSION', 0, `Checking conditions: ${mission.missionStartDialogue}`);
            // Check every complete condition
            for(let j = 0; j < mission.completeConditions.length && isMissionComplete; j++){
                // Set mission progress
                mission.completeConditions[j].progress = this[mission.completeConditions[j].property];
                // Check property depending on operator specified
                switch(mission.completeConditions[j].op){
                    case ">":
                        isMissionComplete = mission.completeConditions[j].progress > mission.completeConditions[j].amount;
                        break;
                    case "=":
                        isMissionComplete = mission.completeConditions[j].progress == mission.completeConditions[j].amount;
                        break;
                    case "<":
                        isMissionComplete = mission.completeConditions[j].progress < mission.completeConditions[j].amount;
                        break;
                }
                this.logger.log('MISSION', 0, `${mission.completeConditions[j].progress} ${mission.completeConditions[j].op} ${mission.completeConditions[j].amount}`);
            }
            // If mission cumplimented all conditions, move to completed missions
            if(isMissionComplete){
                EventBus.emit('missionCompleted', i);
                // Remove mission from active missions
                this.activeMissions.splice(i, 1);
                // Add to completed missions
                this.completedMissions.push(mission);
                saveDataManager.setData('completedMissions', this.completedMissions);
                
                this.logger.log('MISSION', 0, `Mission completed: ${mission.missionClaimDialogue}`);
                this.logger.log('MISSION', 0, `Completed missions: ${JSON.stringify(this.completedMissions)}`);
            }
        }
        // Notify missionProgress has been updated
        EventBus.emit('missionProgressUpdated');
    }

    resetCounters(){
        // clear counters
        this.enemiesKilled = 0;

        this.healthFlowersGathered = 0;
        this.speedVasesGathered = 0;
        this.damageRocksGathered = 0;
        this.itemsGathered = 0;
        this.itemsConsumed = 0;

        this.damageTaken = 0;
        this.damageDealt = 0;
        this.roomsCleared = 0;

        // All active missions that haven't been completed are erased
        this.activeMissions = [];
    }

    getMissionDialogue(){
        // If there is a completed mission unclaimed, return completed mission dialogue so that the player may claim it
        if(this.completedMissions.length != 0){
            EventBus.emit('missionRemoved', this.completedMissions.length-1);
            const dialogue = this.completedMissions.pop().missionClaimDialogue;
            saveDataManager.setData('completedMissions', this.completedMissions);
            saveDataManager.saveCurrentData(); // IDK if i should do this here
            this.logger.log('MISSION', 0, `Mission claimed: ${dialogue}`);
            this.logger.log('MISSION', 0, `Missions completed: ${JSON.stringify(this.completedMissions)}`);
            return {isNewMission: false, dialogue: dialogue};
        }
        else if(missionsConfig.length != 0){
            const mission =  missionsConfig[Math.floor(Math.random()* missionsConfig.length)];
            this.activeMissions.push(mission);
            this.logger.log('MISSION', 0, `Mission started: ${mission.missionStartDialogue}`);
            this.logger.log('MISSION', 0, `Missions active: ${JSON.stringify(this.activeMissions)}`);
            return {isNewMission: true, dialogue: mission.missionStartDialogue};
        }
    }

}

export default new MissionManager();