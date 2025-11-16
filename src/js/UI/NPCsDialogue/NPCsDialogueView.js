import { GameObjects } from "phaser";
import { Button } from "../elements/button.js";
import { TextBox } from "../elements/TextBox.js" 

export default class NPCsDialogueView extends Phaser.GameObjects.Container{
    constructor(scene,presenter){
        super(scene,100,100);
        this.scene = scene;
        this.presenter = presenter;
        this.text = null;
        this.textBox = null;
        this.currentPage = null;
        this.nextPageButton = null;
        scene.add.existing(this);
        this.CreateElements();
    }
    CreateElements(){
        this.CreateBackground();
        this.CreateButtons();
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
    CreateButtons(){
        this.nextPageButton= new Button(this.scene,180,175,"Next");
        this.add(this.nextPageButton);
        this.nextPageButton.addInteraction((btn)=>{
            btn.on("pointerdown",()=>{
                btn.invokeClick();
            });
        });
    }
    CreateBackground(){
    }
    CreatePortrait(NPCportrait){

        //Dimensiones de un portrait: 32 x 48 (escalado x4)
        const upperLeft_x = (32/2)*4
        const upperLeft_y = (48/2)*4
        var portrait =this.scene.add.sprite(upperLeft_x,upperLeft_y,NPCportrait); 
        this.add(portrait);
        portrait.scale = 4
    }
    CreateName(NPCname){
        var name = this.scene.add.text(130,0,NPCname,{fontSize:"20px", color:"#b2b2b2ff", padding: {x:10,y:0},}) 
        this.add(name);
    }
    hideView(){
        this.setVisible(false)
    }
    showView(){
        //TODO mostrar todo el view
    }
}

