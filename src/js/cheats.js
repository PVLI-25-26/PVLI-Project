import { EventBus } from "./core/event-bus.js";
import fireArrow from "../configs/Arrows/fire-arrow.json";
import grassArrow from "../configs/Arrows/grass-arrow.json";
import gasArrow from "../configs/Arrows/gass-arrow.json";
import dashAbility from "../configs/Abilities/dash-config.json";
import forcefieldAbility from "../configs/Abilities/forcefield-config.json";
import shortTrajectory from "../configs/Trajectories/short-trajectory.json";
import mediumTrajectory from "../configs/Trajectories/medium-trajectory.json";
import largeTrajectory from "../configs/Trajectories/large-trajectory.json";
import dungeonConfig from "../configs/Dungeon/dungeon.json";
import { getTiledMapLayer } from "../js/core/tiled-parser.js";

// GOLD CHEATS
window.ag = function(amount){
    EventBus.emit("addGold", amount);
}

window.rg = function(amount){
    EventBus.emit("removeGold", amount);
}

// EQUIPMENT CHEATS
const arrows = {
    fire: fireArrow,
    grass: grassArrow,
    gas: gasArrow
}

const trajectories = {
    short: shortTrajectory,
    medium: mediumTrajectory,
    large: largeTrajectory
}

window.garrw = function(type){
    EventBus.emit('arrowEquipped', arrows[type]);
}

window.gtrj = function(type){
    EventBus.emit('trajectoryEquipped', trajectories[type]);
}

const abilities = {
    dash: dashAbility,
    forcefield: forcefieldAbility
}
window.gabty = function(type){
    EventBus.emit('abilityEquipped', abilities[type]);
}


// TOGGLE DEBUG
window.dbg = function(){
    EventBus.emit('toggleDebug');
}


// TELEPORT CHEATS
const dungeon = getTiledMapLayer(dungeonConfig, "Dungeon");
const roomNameToID = {};
dungeon.forEach((room)=>{
    roomNameToID[room.name] = room.id;
})

window.tp = function(id, x=0, y=0){
    if(typeof id == "number"){
        EventBus.emit('changeRoom', {sceneName: id, playerSpawn: {x: x, y: y}});
    }
    else if(typeof id == "string"){
        EventBus.emit('changeRoom', {sceneName: roomNameToID[id], playerSpawn: {x: x, y: y}});
    }
	EventBus.emit("playSound", "exitPortal")
}

// SHOW ALL ROOM NAMES
window.rooms = function(){
    dungeon.forEach((room)=>{
        console.log(`Name: ${room.name} => ${room.id}`);
    })
}


// SPAWN STUFF
window.obst = function(key, x, y, r){
    EventBus.emit("spawnObstacle", {type: key, x: x, y: y, rotation: r});
}

window.item = function(key, x, y){
    EventBus.emit("spawnItem", {type: key, x: x, y: y});
}

window.enmy = function(key, x, y){
    EventBus.emit("spawnEnemy", {type: key, x: x, y: y});
}
