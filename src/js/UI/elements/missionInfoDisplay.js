import Colors from "../../../configs/colors-config";

export class MissionInfoDisplay extends Phaser.GameObjects.Container{
    constructor(scene, x, y, mission, isCompleted){
        super(scene, x, y);

        this.mission = mission;

        this.missionSummary = this.scene.add.text(0, 0, "", {
            fontFamily: 'MicroChat',
            fontSize: 10,
            color: Colors.White
        });

        this.updateProgress();  

        this.add(this.missionSummary);

        this.rect = this.scene.add.rectangle(this.missionSummary.x-this.missionSummary.width, this.missionSummary.y-this.missionSummary.height/2, 0, this.missionSummary.height/4, Colors.GreenHex);
        this.add(this.rect);

        if(isCompleted){
            this.rect.width = this.missionSummary.width;
        }
    }

    completeMission(){
        this.scene.tweens.add({
            targets: this.rect,
            width: this.missionSummary.width,
            duration: 500,
            ease: 'Linear'
        })
    }

    updateProgress(){
        this.missionSummary.text = this.mission.summary;
        this.mission.completeConditions.forEach(cond => {
            switch(cond.op){
                case ">":
                    this.missionSummary.text += ` ${cond.progress||0}/${cond.amount+1}`;
                    break;
                case "<":
                    this.missionSummary.text += ` ${cond.progress||0}/${cond.amount-1}`;
                    break;
                case "=":
                    this.missionSummary.text += ` ${cond.progress||0}/${cond.amount}`;
                    break;
            }
        });
    }

    remove(){
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 500,
            onComplete: ()=>{
                this.destroy(true);
            }
        })
    }
}