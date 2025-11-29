import { EventBus} from "../../core/event-bus.js";

export default class NPCsDialoguePresenter{
    constructor(view, model){
        this.view = view;
        this.model = model;
        this.lastPage = false;
        //this.view.setPresenter(this);
        
        EventBus.on('StartDialogue',(id,x,y)=>{this.showDialogue(id,x,y)}); 
        EventBus.on('StopDialogue',()=>{this.hideDialogue()});
        EventBus.on('NextPageDialogue',()=>{ 
            if (!this.lastPage){
                this.model.currentDialogue.currentPage += 1;
                this.setCurrentPage();
                this.view.UpdateText();
                if (this.model.currentDialogue.currentPage >= this.model.currentDialogue.dialogue.length-1){
                    this.lastPage = true;
                }
            }
            
        });
    }
    
    showDialogue(id,x,y){
        EventBus.emit('releasePointer');
        EventBus.emit('disablePlayerKeys');
        this.view.setPosition(x,y)
        this.view.showView();
        this.getDialogue(id);
        this.setCurrentPage();
        this.view.UpdateText();
        this.view.UpdateName(this.model.currentDialogue.npcName);
        this.view.UpdatePortrait(this.model.currentDialogue.npcName);
        this.createButtons();
    }
    
    getDialogue(name){
        this.model.currentDialogue = {
            npcName : this.model.dialogues[name].npcName,
            dialogue : this.model.dialogues[name].dialogue,
            currentPage : 0,
            speed : this.model.dialogues[name].speed,
            userOptions : this.model.dialogues[name].userOptions,
        }
    }
    createButtons(){
        for (let i = 0; i<this.model.currentDialogue.userOptions.length; i++){
            let option = this.model.currentDialogue.userOptions[i];
            let newOption = this.view.CreateButtons(option);
            
            if (this.model.events[option.event]!= null){
                newOption.on("button-clicked",()=>{
                    this.model.events[option.event]();
                });
            }
        }
    }
    setCurrentPage(){
        this.view.currentPage = this.model.currentDialogue.dialogue[this.model.currentDialogue.currentPage];
    }
    hideDialogue(){
        this.view.hideView();
        this.lastPage = false;
        EventBus.emit('enablePlayerKeys');
    }
}

