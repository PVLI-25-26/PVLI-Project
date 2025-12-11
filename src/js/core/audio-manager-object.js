import {EventBus} from "./event-bus.js"


export default class AudioManager{
	constructor(scene){
		this.scene = scene;
		this.onCombat = false;
		this.onHUB = false;
		this.playerWalking = false;
		this.rnd = new Phaser.Math.RandomDataGenerator();
		this.timer;
		
		this.steps = ["Steps1", "Steps2", "Steps3", "Steps4"];

		//TODO: quitar console.log
		//FIX: la música del hub se inicia mal, se inicia en el main menu y no se inicia al cargar partida en el hub
		EventBus.on("hubReached",()=>{
			console.log("hubreached")
			EventBus.emit("playMusic","HUBMusic");
			this.onHUB = true;
		});
		EventBus.on("hubReset",()=>{
			console.log("hubreset")
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
		EventBus.on("PlayerWalking",()=>{
			if (!this.playerWalking){
				let randomSound = this.rnd.between(0,3);
				EventBus.emit("playSound",this.steps[randomSound]);
				this.playerWalking = true;
				this.timer = this.scene.time.addEvent({delay: 500, loop:true, callback:()=>{
					let randomSound = this.rnd.between(0,3);
					EventBus.emit("playSound",this.steps[randomSound]);
				}})
			}
		});
		EventBus.on("StepsFinished",()=>{
			this.timer?.remove();
			this.playerWalking = false;
		});
	}

}
