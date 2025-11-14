import { EventBus} from "../../core/event-bus.js";

export default class NPCsDialoguePresenter{
    constructor(view, model){
        this.view = view;
        this.model = model;
        //this.view.setPresenter(this);

        this.subscribeToViewEvents();
        this.setCurrentPage();
        this.view.UpdateText();
    }
    subscribeToViewEvents(){

    }
    setCurrentPage(){
        this.view.currentPage = this.model.dialogue[this.model.currentPage];
        
    }
}

