import MainMenuView from "../UI/main-menu/MainMenuView";
import { EventBus } from "./event-bus";

/**
 * Manager for save data stored in localStorage and exported/imported via file dialogs.
 *
 */
class SaveDataManager {
    /**
     * Currently selected save file key (string or numeric key stored in localStorage).
     * @type {string|number}
     */
    currentSave;
    /**
     * Data of currently active save file. Modified during the game and persisted with saveCurrentData().
     * @type {Object}
     */
    saveData;
    /**
     * Create a SaveDataManager and initialize the currently selected save and its data.
     * Also wires the document picker change event to load files selected by the user.
     */
    constructor(){
        this.currentSave = localStorage.getItem("currentSaveFile") || 0;
        this.loadCurrentData();
        document.getElementById('docpicker').addEventListener('change',(event)=>{ this.onDocumentPickerClick(event)});
    }

    /**
     * Set a key/value pair in the currently loaded saveData object.
     *
     * @param {string} key - Property name to set in saveData.
     * @param {*} data - Value to store under the specified key.
     * @returns {void}
     */
    setData(key, data){
        this.saveData[key] = data;
    }

    /**
     * Get a value from the currently loaded saveData object.
     *
     * @param {string} key - Property name to retrieve from saveData.
     * @returns {*} The stored value, or undefined if the key does not exist.
     */
    getData(key){
        return this.saveData[key];
    }

    /**
     * Change the current save slot. Optionally persists the previous slot before switching.
     *
     * @param {string|number} newCurrentSave - New save slot key to select.
     * @param {boolean} savePrevious - If true, store the current saveData to localStorage before switching.
     * @returns {void}
     */
    changeCurrentSave(newCurrentSave, savePrevious){
        if(savePrevious){
            this.storeCurrentSaveFile();
        }
        this.currentSave = newCurrentSave;
        this.loadCurrentData();
    }

    /**
     * Load the data for the currently selected save slot from localStorage into memory.
     * If no data exists for the slot, initializes saveData as an empty object.
     *
     * @returns {void}
     */
    loadCurrentData(){
        this.saveData = JSON.parse(localStorage.getItem(this.currentSave)) || {};
    }

    /**
     * Delete a saved slot from localStorage.
     *
     * @param {string|number} toDelete - The localStorage key (save slot) to remove.
     * @returns {void}
     */
    deleteData(toDelete){

        localStorage.removeItem(toDelete);

    }

    /**
     * Persist the current in-memory saveData to localStorage under the currentSave key
     * and update the "currentSaveFile" pointer.
     *
     * @returns {void}
     */
    saveCurrentData(){
        localStorage.setItem(this.currentSave, JSON.stringify(this.saveData));
        localStorage.setItem("currentSaveFile", this.currentSave);
    }
    /**
     * Trigger a file download containing the JSON representation of the current save data.
     *
     * @param {string|number} toSave - Slot/key to use as the current save key for the exported file.
     * @returns {void}
     */
    saveDataDocument(toSave){
        this.currentSave = toSave;
        const a = document.createElement("a");
        const file = new Blob([JSON.stringify(this.saveData)], { type: "text/plain" });
        a.href = URL.createObjectURL(file);
        a.download = "GameSaveFile.json";
        a.click();        
    }
    /**
     * Prepare to load a save from an external file by setting the target save slot and
     * programmatically opening the document picker (assumes an element with id 'docpicker').
     *
     * @param {string|number} toLoad - Save slot/key that the loaded file's contents should be stored under.
     * @returns {void}
     */
    async loadDataDocument(toLoad){

        this.currentSave = toLoad;

        docpicker.click();
    }
    
   
    /**
     * Handler for the document picker change event. Reads the selected file as text and stores its contents
     * into localStorage under the currentSave key. Emits a "DataLoaded" event on success.
     *
     * @param {Event} event - Change event from an <input type="file" id="docpicker"> element.
     * @returns {void}
     */
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

