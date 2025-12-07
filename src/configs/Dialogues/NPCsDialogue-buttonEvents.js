import { EventBus } from "../../js/core/event-bus.js";
import FireArrow from "../Arrows/fire-arrow.json"
import GrassArrow from "../Arrows/grass-arrow.json"
import GasArrow from "../Arrows/gass-arrow.json"


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
	ACCEPT_MISSION: ()=>{
		// Missions are accepted automatically
		EventBus.emit("StopDialogue");
	},
	REJECT_MISSION: ()=>{
		EventBus.emit("missionRejected");
		EventBus.emit("StopDialogue");
	},
	REJECT_REWARD: ()=>{
		EventBus.emit("StopDialogue");
	},
	RECIEVE_50COINS: ()=>{
		EventBus.emit("addGold", 50);
		EventBus.emit("StopDialogue");
	}
}

