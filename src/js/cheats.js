import { EventBus } from "./core/event-bus.js";
import fireArrow from "../configs/Arrows/fire-arrow.json";
import grassArrow from "../configs/Arrows/grass-arrow.json";
import gasArrow from "../configs/Arrows/gass-arrow.json";
import dashAbility from "../configs/Abilities/dash-config.json";
import forcefieldAbility from "../configs/Abilities/forcefield-config.json";
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
window.garrw = function(type){
    EventBus.emit('arrowEquipped', arrows[type]);
}

const abilities = {
    dash: dashAbility,
    forcefield: forcefieldAbility
}
window.gabty = function(type){
    EventBus.emit('abilityEquipped', abilities[type]);
}


// TOGGLE DEBUG
window.dbgTog = function(){
    EventBus.emit('toggleDebug');
}


// TELEPORT CHEATS
const dungeon = getTiledMapLayer(dungeonConfig, "Dungeon");
const roomNameToID = {};
dungeon.forEach((room)=>{
    roomNameToID[room.name] = room.id;
})

window.tp = function(id){
    if(typeof id == "number"){
        EventBus.emit('changeRoom', id);
    }
    else if(typeof id == "string"){
        EventBus.emit('changeRoom', roomNameToID[id]);
    }
}

// SHOW ALL ROOM NAMES
window.rooms = function(){
    dungeon.forEach((room)=>{
        console.log(`Name: ${room.name} => ${room.id}`);
    })
}