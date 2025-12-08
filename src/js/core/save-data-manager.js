
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

        const reader = new FileReader(); //crea el Reader
        reader.onload = function(e) //escucha el evento de que el archivo ha sido leído 
        {  
            let content = e.target.result;
        //aquí haces lo que quieras con el contenido del archivo

        localStorage.setItem(toLoad, JSON.stringify(this.saveData));
        };

    }
}

export default new SaveDataManager();