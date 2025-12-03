import { EventBus } from "../../js/core/event-bus.js";
import FireArrow from "../../configs/Arrows/fire-arrow.json"
import GrassArrow from "../../configs/Arrows/grass-arrow.json"
import GasArrow from "../../configs/Arrows/gass-arrow.json"


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
	}
}

