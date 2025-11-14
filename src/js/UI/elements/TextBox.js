import Phaser from "phaser";


export class TextBox extends Phaser.GameObjects.Text{
    constructor(scene,x,y,text,speed, boxWidth){
        super(scene,x,y,"",{
            fontSize:"14px",
            color:"#b2b2b2ff",
            padding: {x:10,y:20},
            wordWrap:{width:boxWidth},
        });
        scene.add.existing(this);
        this.boxText = text;
        this.speed = speed;
        this.progressiveText();
        
    }
    progressiveText(){
        var currentChar = 0;
        this.timer = this.scene.time.addEvent({
            delay: this.speed,
            repeat: this.boxText.length,
            callback: ()=>{
                this.appendText(this.boxText[currentChar],false);
                currentChar ++;
            }
        })
        
    }
}