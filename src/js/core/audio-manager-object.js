import {EventBus} from "./event-bus.js"


export default class AudioManager{
	constructor(){
		this.onCombat = false;
		this.onHUB = false;
		EventBus.on("hubReached",()=>{
			EventBus.emit("playMusic","HUBMusic");
			this.onHUB = true;
		});
		EventBus.on("hubReset",()=>{
			EventBus.emit("stopMusic","HUBMusic");
			this.onHUB = false;
		})
		EventBus.on("PlayCombatMusic",()=>{
			if (!this.onCombat){
				this.onCombat = true;
				EventBus.emit("playMusic","CombatMusic");
			}
		})
		EventBus.on("roomCleared",()=>{
			if (!this.onHUB){
				EventBus.emit("stopMusic","CombatMusic");
				this.onCombat = false;
			}
		})
	}
}
