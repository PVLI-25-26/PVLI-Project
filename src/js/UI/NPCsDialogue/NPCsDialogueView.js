import { GameObjects } from "phaser";
import { Button } from "../elements/button.js";
import { TextBox } from "../elements/TextBox.js" 
import { EventBus } from "../../core/event-bus.js";

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
        this.buttonPositionX = 200;
        this.buttonPositionY = 175;
        this.interliterate = 30;

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
        this.textBox = new TextBox(this.scene,130,5,this.currentPage,30,400); 
        this.add(this.textBox)
    }
    CreateButtons(button){
        this.numButtons ++;

        var newButton = new Button(this.scene,this.buttonPositionX, this.buttonPositionY + this.interliterate * this.numButtons, button.label)
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
    }
    CreatePortrait(portrait){
        
        //Dimensiones de un portrait: 32 x 48 (escalado x4)
        const upperLeft_x = (32/2)*4
        const upperLeft_y = (48/2)*4
        
        this.portrait = this.scene.make.sprite(
            {x: upperLeft_x, 
             y: upperLeft_y, 
             key: portrait, 
             scale :4});
        
        this.add(this.portrait);
    }
    CreateName(NPCname){
        this.name = this.scene.add.text(130,0,NPCname,{fontSize:"20px", color:"#b2b2b2ff", padding: {x:10,y:0},}) 
        this.add(this.name);
    }
    UpdateName(NPCname){
        this.name.text = NPCname;
    }
    UpdatePortrait(NPCportrait){
        this.portrait.setTexture(NPCportrait);
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

