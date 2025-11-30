import { Button } from "../elements/button.js";
import { TextBox } from "../elements/TextBox.js" 
import { EventBus } from "../../core/event-bus.js";
import Colors from "../../../configs/color-config.json"

const SCALE = 2;
const TEXT_SPEED = 20;

const PORTRAIT_WIDTH = 32 + 6; // +6 por el borde que viene ya dibujado
const PORTRAIT_HEIGHT = 48 + 6; // +6 por el borde que viene ya dibujado

const TEXTBOX_WIDTH = 150;
const TEXTBOX_HEIGHT = PORTRAIT_HEIGHT + 10;
const TEXTBOX_TEXT_WIDTH = TEXTBOX_WIDTH*SCALE - 10;
const TEXTBOX_TEXT_PADDING = 5*SCALE;
const TEXTBOX_TEXT_FONTSIZE = 10;

const MARGINS = 5*SCALE;

const TOTAL_WIDTH = PORTRAIT_WIDTH*SCALE + TEXTBOX_WIDTH*SCALE + MARGINS - 200;

const PORTRAIT_POS_X = -TOTAL_WIDTH*SCALE/2 + (PORTRAIT_WIDTH/2)*SCALE; // Origen en el medio
const TEXTBOX_POS_X = PORTRAIT_POS_X + (PORTRAIT_WIDTH/2)*SCALE + (TEXTBOX_WIDTH/2)*SCALE + MARGINS; // Origen en el medio

const TEXTBOX_NAME_X = TEXTBOX_POS_X - (TEXTBOX_WIDTH/2)*SCALE;
const TEXTBOX_NAME_Y = -(TEXTBOX_HEIGHT/2)*SCALE;
const TEXTBOX_NAME_PADDING = 5*SCALE;


const TEXTBOX_TEXT_X = TEXTBOX_POS_X - (TEXTBOX_WIDTH/2)*SCALE;
const TEXTBOX_TEXT_Y = -(TEXTBOX_HEIGHT/2)*SCALE + 16; // El 16 ni idea, voy a matar al que hizo este view

const BUTTONS_WIDTH = 48;
const BUTTONS_HEIGHT = 25;

const BUTTONS_POS_X = TEXTBOX_POS_X - (TEXTBOX_WIDTH/2)*SCALE + BUTTONS_WIDTH/SCALE;
const BUTTONS_POS_Y = (TEXTBOX_HEIGHT/2)*SCALE + MARGINS + BUTTONS_HEIGHT/SCALE;
const BUTTON_TEXT_FONTSIZE = TEXTBOX_TEXT_FONTSIZE;
const BUTTON_TEXT_PADDING = TEXTBOX_TEXT_PADDING;

export default class NPCsDialogueView extends Phaser.GameObjects.Container{
    constructor(scene,presenter){
        super(scene);
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
        
        //tweens
        this.portraitTween = null; 

        this.background = null;

        EventBus.on("cameraRotated", this.onCameraRotated,this);
        this.setDepth(1000);

    }
    onCameraRotated(R){
        this.setRotation(-R)
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
        this.textBox = new TextBox(this.scene,TEXTBOX_TEXT_X,TEXTBOX_TEXT_Y,this.currentPage,TEXT_SPEED,TEXTBOX_TEXT_WIDTH, "MicroChat",TEXTBOX_TEXT_FONTSIZE, Colors.White); 
        this.add(this.textBox)
    }
    CreateButtons(button){
        var newButton= new Button(this.scene, BUTTONS_POS_X, BUTTONS_POS_Y + (BUTTONS_HEIGHT*SCALE+MARGINS) * this.numButtons, null, BUTTONS_WIDTH, BUTTONS_HEIGHT,
            {
                text: button.label,
                style: {
                    fontSize: BUTTON_TEXT_FONTSIZE,
                    color: Colors[button.color],
                    fontFamily: 'MicroChat',
                    padding: BUTTON_TEXT_PADDING,
                }
            },
            {
                texture:"UIbackground",
                frame:0,
                leftWidth:3,
                rightWidth:3,
                topHeight:3,
                bottomHeight:0,
                scale: SCALE
            }
        );
        this.add(newButton);
        newButton.addInteraction((btn) => {
            btn.on("pointerdown",()=>{
                btn.invokeClick();
            });
        })

        this.numButtons ++;

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
        this.background = this.scene.add.nineslice(
            TEXTBOX_POS_X, 
            0,
            'UIbackground',
            0,
            TEXTBOX_WIDTH,
            TEXTBOX_HEIGHT,
            3,
            3,
            3,
            3
        );
        this.background.setScale(SCALE);
        this.add(this.background);
    }
    CreatePortrait(portrait){
        this.portrait = this.scene.make.sprite(
            {x: PORTRAIT_POS_X, 
             y: 0, 
             key: portrait,
            });
        this.portrait.setScale(SCALE);
        this.add(this.portrait);
    }
    CreateName(NPCname){
        this.name = this.scene.add.text(TEXTBOX_NAME_X,TEXTBOX_NAME_Y,NPCname,{fontSize:"20px", color:Colors.Red, padding: TEXTBOX_NAME_PADDING,fontFamily:"FableFont"}) 
        this.add(this.name);
    }
    UpdateName(NPCname){
        this.name.text = NPCname;
    }
    UpdatePortrait(NPCportrait){
        this.portrait.setTexture(NPCportrait);
        
        this.portraitTween = this.scene.tweens.add({
        targets: this.portrait,
        scaleX:{from:0, to:SCALE},
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
    setPosition(x,y){
        this.x = x;
        this.y = y;
    }
}

