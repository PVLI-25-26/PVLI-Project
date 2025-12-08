import MainMenuView from "../UI/main-menu/MainMenuView";
import { EventBus } from "./event-bus";

class SaveDataManager {
    // Currently selected save file
    currentSave;
    // Data of currently active save file. Is modified during the game and saved later.
    saveData;
    constructor(){
        this.currentSave = localStorage.getItem("currentSaveFile") || 0;
        this.loadCurrentData();
        document.getElementById('docpicker').addEventListener('change',(event)=>{ this.onDocumentPickerClick(event)});
    }

    setData(key, data){
        this.saveData[key] = data;
    }

    getData(key){
        return this.saveData[key];
    }

    changeCurrentSave(newCurrentSave, savePrevious){
        if(savePrevious){
            this.storeCurrentSaveFile();
        }
        this.currentSave = newCurrentSave;
        this.loadCurrentData();
    }

    loadCurrentData(){
        this.saveData = JSON.parse(localStorage.getItem(this.currentSave)) || {};
    }

    deleteData(toDelete){

        localStorage.removeItem(toDelete);

    }

    saveCurrentData(){
        localStorage.setItem(this.currentSave, JSON.stringify(this.saveData));
        localStorage.setItem("currentSaveFile", this.currentSave);
    }
    saveDataDocument(toSave){
        this.currentSave = toSave;
        const a = document.createElement("a");
        const file = new Blob([JSON.stringify(this.saveData)], { type: "text/plain" });
        a.href = URL.createObjectURL(file);
        a.download = "GameSaveFile.json";
        a.click();        
    }
    async loadDataDocument(toLoad){

        this.currentSave = toLoad;

        docpicker.click();
    }
    
   

    onDocumentPickerClick(event) {
  
        const file = event.target.files[0]; // Obtiene el primer archivo seleccionado

        if (file) {
            const reader = new FileReader(); // Crea una instancia de FileReader


            // 1. Leer como texto (para .txt, .csv, etc.)
            reader.readAsText(file); // Inicia la lectura como texto

            reader.onload =  (e)=> {
                const content = e.target.result; // El contenido del archivo

                localStorage.setItem(this.currentSave, content) || {};

                EventBus.emit("DataLoaded", this.currentSave);

                event.target.value ='';

            };
        }
    }
}
 export default new SaveDataManager();

