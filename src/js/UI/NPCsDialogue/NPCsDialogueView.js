import { GameObjects } from "phaser";
import { Button } from "../elements/button.js";
import { TextBox } from "../elements/TextBox.js" 
import { EventBus } from "../../core/event-bus.js";
import Colors from "../../../configs/color-config.json"

export default class NPCsDialogueView extends Phaser.GameObjects.Container{
    constructor(scene,presenter){
        super(scene,100,100);
        this.scene = scene;
        this.presenter = presenter;
        this.text = null;
        this.textBox = null;
        this.currentPage = null;
        this.nextPageButton = null;
        this.name = null;
        this.portrait = null;
        scene.add.existing(this);
        this.CreateElements();

        this.buttons = [];
        this.numButtons = 0;
        this.buttonPositionX =  113;
        this.buttonPositionY =  120;
        this.interliterate = 30;
        
        //tweens
        this.portraitTween = null; 

        this.background = null


        this.ANCHOR_X = 0;
        this.ANCHOR_Y = 0; 

    }
    CreateElements(){
        this.CreateBackground();
        //this.CreateButtons();
        this.CreateName("default");
        this.CreatePortrait("PortraitTest")
        this.hideView();
    }
    UpdateText(){
        if (this.textBox != null){
            this.textBox.boxText = "";
            this.textBox.text= "";
            this.remove(this.textBox);
        }
        this.textBox = new TextBox(this.scene,90,7,this.currentPage,30,300, "MicroChat",10, Colors.White); 
        this.add(this.textBox)
    }
    CreateButtons(button){
        this.numButtons ++;

        var buttonBackground = this.scene.make.sprite({
            x: this.buttonPositionX, 
            y: this.buttonPositionY + this.interliterate * this.numButtons,
            key: "UIdialogueButton",
            scale: 2
        });
        this.add(buttonBackground);
        this.buttons.push(buttonBackground);

        let color;
        switch (button.color){
            case "DarkBrown":
                color = Colors.DarkBrown;
                break;
            case "LightBrown":
                color = Colors.LightBrown;
                break;
            case "Green":
                color = Colors.Green;
                break;
            case "Orange":
                color = Colors.Orange;
                break;
            case "Red":
                color = Colors.Red;
                break;
            default:
                color = Colors.White;
                break;
        }
        var newButton = new Button(this.scene,this.buttonPositionX, this.buttonPositionY + this.interliterate * this.numButtons, button.label, "MicroChat", color,"10px")
        this.add(newButton);
        newButton.addInteraction((btn) => {
            btn.on("pointerdown",()=>{
                btn.invokeClick();
            });
        })
        this.buttons.push(newButton);
        return newButton;
    }
    EraseButtons(){
        for (let i = 0; i < this.buttons.length; i++){
            let button = this.buttons[i];
            this.remove(button);
            button.destroy();
        }
        this.buttons = [];
        this.numButtons = 0;
    }
    CreateBackground(){

        const upperLeft_x = (164/2)*2 + 39 *2 + 5;
        const upperLeft_y = (63/2)*2
        

        this.background = this.scene.make.sprite({
            x: upperLeft_x,
            y: upperLeft_y,
            key: "UIdialoguePortraitBackground",
            scale:2
        });
        this.add(this.background);
    }
    CreatePortrait(portrait){
        
        //Dimensiones de un portrait: 32 x 48 (escalado x4)
        const upperLeft_x = (39/2)*2
        const upperLeft_y = (63/2)*2
        
        this.portrait = this.scene.make.sprite(
            {x: upperLeft_x, 
             y: upperLeft_y, 
             key: portrait, 
             scale :{x: 2, y: 2},
            });
        
        this.add(this.portrait);

        
       
    }
    CreateName(NPCname){
        this.name = this.scene.add.text(90,3,NPCname,{fontSize:"20px", color:Colors.Red, padding: {x:10,y:0},fontFamily:"FableFont"}) 
        this.add(this.name);
    }
    UpdateName(NPCname){
        this.name.text = NPCname;
    }
    UpdatePortrait(NPCportrait){
        this.portrait.setTexture(NPCportrait);
        
        this.portraitTween = this.scene.tweens.add({
        targets: this.portrait,
        scaleX:{from:0, to:2},
        ease:'Sine.easeOut',
        duration: 100
        })
    }
    hideView(){
        this.setVisible(false);
        if (this.buttons != undefined)
            this.EraseButtons();
        EventBus.emit("dialogueFinished")
    }
    showView(){
       this.setVisible(true);
    }
}

