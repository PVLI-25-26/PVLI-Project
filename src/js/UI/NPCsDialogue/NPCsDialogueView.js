import { Button } from "../elements/button.js";
import { TextBox } from "../elements/TextBox.js" 

export default class NPCsDialogueView{
    constructor(scene,presenter){
        this.scene = scene;
        this.presenter = presenter;
        this.text = null;
        this.currentPage = null;
    }
    UpdateText(){
        this.text = new TextBox(this.scene,0,0,this.currentPage,30,400);
        //this.text.progressiveText();
    }
}

