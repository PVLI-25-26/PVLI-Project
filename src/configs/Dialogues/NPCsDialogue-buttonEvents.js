import { EventBus } from "../../js/core/event-bus.js";

var events;
export default events  = {
    NEXT_PAGE : () =>{
        EventBus.emit('NextPageDialogue');
    },
    END :() =>{
        EventBus.emit("StopDialogue");
    }
}
