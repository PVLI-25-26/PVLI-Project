import Phaser from "phaser";


export class TextBox extends Phaser.GameObjects.Text{
    constructor(scene,x,y,text,speed, boxWidth,font, size, color){
        super(scene,x,y,"",{
            fontSize:size,
            color:color,
            padding: {x:10,y:20},
            wordWrap:{width:boxWidth},
            
        });
        this.setFontFamily(font);
        scene.add.existing(this);
        this.boxText = text;
        this.speed = speed;
        this.progressiveText();
        
    }
    progressiveText(){
        // TODO: cambiar para que no de el salto de linea con la mitad de la palabra
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