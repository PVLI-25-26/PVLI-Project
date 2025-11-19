import { EventBus } from "../../js/core/event-bus.js";

var events;
export default events  = {
    Event1 : ()=>{
        console.log("hola mundo");
    },
    Event2 : () =>{
        console.log("hola (no) mundo¡¡");
        EventBus.emit('StopDialogue');
        EventBus.emit('StartDialogue',"npcName2")
    },
    NEXT_PAGE : () =>{
        EventBus.emit('NextPageDialogue')
    },
    END :() =>{
        EventBus.emit("StopDialogue");
    }
}
