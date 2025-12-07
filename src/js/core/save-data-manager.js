
class SaveDataManager {
    // Currently selected save file
    currentSave;
    // Data of currently active save file. Is modified during the game and saved later.
    saveData;
    constructor(){
        this.currentSave = localStorage.getItem("currentSaveFile") || 0;
        this.loadCurrentData();
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
        localStorage.removeItem("currentSaveFile");
    }

    saveCurrentData(){
        localStorage.setItem(this.currentSave, JSON.stringify(this.saveData));
        localStorage.setItem("currentSaveFile", this.currentSave);
    }
}

export default new SaveDataManager();