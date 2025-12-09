import {EventBus} from "./event-bus.js"


export default class AudioManager{
	constructor(){
		this.onCombat = false;
		EventBus.on("hubReached",()=>{
			console.log("StartHUBMusic")
			EventBus.emit("playMusic","HUBMusic");
		});
		EventBus.on("hubReset",()=>{
			console.log("StopHUBMusic")
			EventBus.emit("stopMusic","HUBMusic");
		})
		EventBus.on("PlayCombatMusic",()=>{
			if (!this.onCombat){
				this.onCombat = true;
				console.log("startCombatMusic")
				EventBus.emit("playMusic","CombatMusic");
			}
		})
		//FIX: StopMusic para cualquier música
		//FIX: Elemental emite start music siempre, aun cuando está muerto. 
		EventBus.on("roomCleared",()=>{
			console.log("stopCombatMusic")
			EventBus.emit("stopMusic","CombatMusic");
			this.onCombat = false;
		})
	}
}
