import { EventBus } from "../../js/core/event-bus.js";
import FireArrow from "../Arrows/fire-arrow.json"
import GrassArrow from "../Arrows/grass-arrow.json"
import GasArrow from "../Arrows/gass-arrow.json"
import dashAbility from "../Abilities/dash-config.json"
import forceField from "../Abilities/forcefield-config.json"


var events;
export default events  = {
    NEXT_PAGE : () =>{
        EventBus.emit('NextPageDialogue');
    },
    END :() =>{
        EventBus.emit("StopDialogue");
    },


	BUY_FIRE_ARROW : () =>{
		EventBus.emit("arrowBought",FireArrow);
		EventBus.emit("StopDialogue");
	},
	BUY_GRASS_ARROW : () =>{
		EventBus.emit("arrowBought",GrassArrow);
		EventBus.emit("StopDialogue");
	},
	BUY_GAS_ARROW : () =>{
		EventBus.emit("arrowBought", GasArrow);
		EventBus.emit("StopDialogue");
	},


	EQUIP_FIRE_ARROW : () =>{
		EventBus.emit('arrowEquipped', FireArrow);
		EventBus.emit("StopDialogue");
	},
	EQUIP_GRASS_ARROW : () =>{
		EventBus.emit('arrowEquipped', GrassArrow);
		EventBus.emit("StopDialogue");
	},
	EQUIP_GAS_ARROW : () =>{
		EventBus.emit('arrowEquipped', GasArrow);
		EventBus.emit("StopDialogue");
	},

	EQUIP_DASH : () =>{
		EventBus.emit('abilityEquipped', dashAbility);
		EventBus.emit("StopDialogue");
	},
	EQUIP_FORCEFIELD : () =>{
		EventBus.emit('abilityEquipped', forceField);
		EventBus.emit("StopDialogue");
	},

	ACCEPT_MISSION: ()=>{
		EventBus.emit("missionAccepted");
		EventBus.emit("StopDialogue");
	},
	REJECT_MISSION: ()=>{
		EventBus.emit("missionRejected");
		EventBus.emit("StopDialogue");
	},
	REJECT_REWARD: ()=>{
		EventBus.emit("StopDialogue");
	},


	RECIEVE_25COINS: ()=>{
		EventBus.emit("addGold", 25);
		EventBus.emit("StopDialogue");
	},
	RECIEVE_50COINS: ()=>{
		EventBus.emit("addGold", 50);
		EventBus.emit("StopDialogue");
	},
	RECIEVE_75COINS: ()=>{
		EventBus.emit("addGold", 75);
		EventBus.emit("StopDialogue");
	},
	RECIEVE_100COINS: ()=>{
		EventBus.emit("addGold", 100);
		EventBus.emit("StopDialogue");
	},
	RECIEVE_150COINS: ()=>{
		EventBus.emit("addGold", 150);
		EventBus.emit("StopDialogue");
	},
	RECIEVE_200COINS: ()=>{
		EventBus.emit("addGold", 200);
		EventBus.emit("StopDialogue");
	}
}

