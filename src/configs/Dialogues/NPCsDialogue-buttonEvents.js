import { EventBus } from "../../js/core/event-bus.js";
import FireArrow from "../Arrows/fire-arrow.json"
import GrassArrow from "../Arrows/grass-arrow.json"
import GasArrow from "../Arrows/gass-arrow.json"
import dashAbility from "../Abilities/dash-config.json"
import forceField from "../Abilities/forcefield-config.json"
import MediumTrajectory from "../Trajectories/medium-trajectory.json"


var events;
/**
 * Events for dialogue options. Dialogues specify the key of the button that should show when opened.
 * When the button is clicked, this functions are called.
 */
export default events  = {
	/**
	 * Goes to the next page in the dialogues array
	 */
    NEXT_PAGE : () =>{
        EventBus.emit('NextPageDialogue');
    },
	/**
	 * Exits the dialogue
	 */
    END :() =>{
        EventBus.emit("StopDialogue");
    },


	/**
	 * Tries to buy a fire arrow and stop the dialogue
	 */
	BUY_FIRE_ARROW : () =>{
		EventBus.emit("arrowBought",FireArrow);
		EventBus.emit("StopDialogue");
	},
	/**
	 * Tries to buy a grass arrow and stop the dialogue
	 */
	BUY_GRASS_ARROW : () =>{
		EventBus.emit("arrowBought",GrassArrow);
		EventBus.emit("StopDialogue");
	},
	/**
	 * Tries to buy a gas arrow and stop the dialogue
	 */
	BUY_GAS_ARROW : () =>{
		EventBus.emit("arrowBought", GasArrow);
		EventBus.emit("StopDialogue");
	},

	
	/**
	 * Tries to buy a medium trajectory and stop the dialogue
	 */
	BUY_MEDIUM_TRAJECTORY : () =>{
		EventBus.emit("trajectoryBought", MediumTrajectory);
		EventBus.emit("StopDialogue");
	},

	/**
	 * Tries to buy a dash and stop the dialogue
	 */
	BUY_DASH : () =>{
		EventBus.emit("abilityBought", dashAbility);
		EventBus.emit("StopDialogue");
	},
	/**
	 * Tries to buy a force field and stop the dialogue
	 */
	BUY_FORCEFIELD : () =>{
		EventBus.emit("abilityBought", forceField);
		EventBus.emit("StopDialogue");
	},


	/**
	 * Equip fire arrow and stop the dialogue
	 */
	EQUIP_FIRE_ARROW : () =>{
		EventBus.emit('arrowEquipped', FireArrow);
		EventBus.emit("StopDialogue");
	},
	/**
	 * Equip grass arrow and stop the dialogue
	 */
	EQUIP_GRASS_ARROW : () =>{
		EventBus.emit('arrowEquipped', GrassArrow);
		EventBus.emit("StopDialogue");
	},
	/**
	 * Equip gas arrow and stop the dialogue
	 */
	EQUIP_GAS_ARROW : () =>{
		EventBus.emit('arrowEquipped', GasArrow);
		EventBus.emit("StopDialogue");
	},

	/**
	 * Equip dash and stop the dialogue
	 */
	EQUIP_DASH : () =>{
		EventBus.emit('abilityEquipped', dashAbility);
		EventBus.emit("StopDialogue");
	},
	/**
	 * Equip forcefield and stop the dialogue
	 */
	EQUIP_FORCEFIELD : () =>{
		EventBus.emit('abilityEquipped', forceField);
		EventBus.emit("StopDialogue");
	},

	/**
	 * Accept mission from NPC
	 */
	ACCEPT_MISSION: ()=>{
		EventBus.emit("missionAccepted");
		EventBus.emit("StopDialogue");
	},
	/**
	 * Reject mission from NPC
	 */
	REJECT_MISSION: ()=>{
		EventBus.emit("missionRejected");
		EventBus.emit("StopDialogue");
	},
	/**
	 * Reject reward from completed mission from NPC
	 */
	REJECT_REWARD: ()=>{
		EventBus.emit("StopDialogue");
	},


	/**
	 * Add 25 coins
	 */
	RECIEVE_25COINS: ()=>{
		EventBus.emit("addGold", 25);
		EventBus.emit("StopDialogue");
	},
	/**
	 * Add 50 coins
	 */
	RECIEVE_50COINS: ()=>{
		EventBus.emit("addGold", 50);
		EventBus.emit("StopDialogue");
	},
	/**
	 * Add 75 coins
	 */
	RECIEVE_75COINS: ()=>{
		EventBus.emit("addGold", 75);
		EventBus.emit("StopDialogue");
	},
	/**
	 * Add 100 coins
	 */
	RECIEVE_100COINS: ()=>{
		EventBus.emit("addGold", 100);
		EventBus.emit("StopDialogue");
	},
	/**
	 * Add 150 coins
	 */
	RECIEVE_150COINS: ()=>{
		EventBus.emit("addGold", 150);
		EventBus.emit("StopDialogue");
	},
	/**
	 * Add 200 coins
	 */
	RECIEVE_200COINS: ()=>{
		EventBus.emit("addGold", 200);
		EventBus.emit("StopDialogue");
	}
}

