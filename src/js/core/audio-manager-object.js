import {EventBus} from "./event-bus.js"


export default class AudioManager{
	constructor(){
		this.onCombat = false;
		EventBus.on("hubReached",()=>{
			EventBus.emit("playMusic","HUBMusic");
		});
		EventBus.on("PlayCombatMusic",()=>{
			if (!this.onCombat){
				this.onCombat = true;
				EventBus.emit("playMusic","CombatMusic");
			}
		})
		EventBus.on("StopCombatMusic",()=>{
			EventBus.emit("stopMusic","CombatMusic");
			this.onCombat = false;
		})
	}
}
