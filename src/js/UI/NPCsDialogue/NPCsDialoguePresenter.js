import { EventBus} from "../../core/event-bus.js";

export default class NPCsDialoguePresenter{
    constructor(view, model){
        this.view = view;
        this.model = model;
        //this.view.setPresenter(this);

        this.view.CreateButtons();
        this.subscribeToViewEvents();

    }
    
    showDialogue(id){
        this.getDialogue(id);
        this.setCurrentPage();
        this.view.UpdateText();
        this.view.CreatePortrait(this.model.currentDialogue.npcName);
        this.view.CreateName(this.model.currentDialogue.npcName);
     
    }

    subscribeToViewEvents(){
        this.view.nextPageButton.on("button-clicked",()=>{
            if (this.model.currentDialogue.currentPage >= this.model.currentDialogue.dialogue.length - 1){
                this.hideDialogue();
            }
            else{
                this.model.currentDialogue.currentPage += 1;
                this.setCurrentPage();
                this.view.UpdateText();
            }
        });
    }
    getDialogue(name){
        this.model.currentDialogue = {
            npcName : this.model.dialogues[name].npcName,
            dialogue : this.model.dialogues[name].dialogue,
            currentPage : 0,
            userOptions : this.model.dialogues[name].userOptions,
            speed : this.model.dialogues[name].userOptions

        }
    }

    setCurrentPage(){
        this.view.currentPage = this.model.currentDialogue.dialogue[this.model.currentDialogue.currentPage];
    }
    hideDialogue(){
        this.view.hideView();
    }
}

