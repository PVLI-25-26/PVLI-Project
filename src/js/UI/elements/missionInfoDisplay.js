import Colors from "../../../configs/colors-config";

/**
 * Visual representation of a mission entry showing summary and progress.
 *
 * Displays mission summary text, a progress suffix computed from the mission's
 * completeConditions and a green strike rectangle used to mark completion.
 *
 * @extends Phaser.GameObjects.Container
 */
export class MissionInfoDisplay extends Phaser.GameObjects.Container{
    /**
     * Create a MissionInfoDisplay.
     *
     * @param {Phaser.Scene} scene - Scene to which this display will be added.
     * @param {number} x - X position of the container.
     * @param {number} y - Y position of the container.
     * @param {Object} mission - Mission object containing summary and completeConditions.
     * @param {boolean} isCompleted - If true, the mission is rendered as already completed.
     */
    constructor(scene, x, y, mission, isCompleted){
        super(scene, x, y);

        this.mission = mission;

        // Create mission summary text
        this.missionSummary = this.scene.add.text(0, 0, "", {
            fontFamily: 'MicroChat',
            fontSize: 10,
            color: Colors.White
        });

        // Update mission text depending on progress
        this.updateProgress();  

        // Add text to container
        this.add(this.missionSummary);

        // Create rectangle to cross mission when complete
        this.rect = this.scene.add.rectangle(this.missionSummary.x-this.missionSummary.width, this.missionSummary.y-this.missionSummary.height/2, 0, this.missionSummary.height/4, Colors.GreenHex);
        this.add(this.rect);

        // If mission is complete set width of rectangle to cross mission text
        if(isCompleted){
            this.rect.width = this.missionSummary.width;
        }
    }

    /**
     * Animate and mark the mission as completed by expanding the strike rectangle.
     *
     * @returns {void}
     */
    completeMission(){
        // Cross mission text with rectangle
        this.scene.tweens.add({
            targets: this.rect,
            width: this.missionSummary.width,
            duration: 500,
            ease: 'Linear'
        })
    }

    /**
     * Update the missionSummary text to include current progress for each completion condition.
     * The function appends "progress/target" fragments according to each condition's operator.
     *
     * @returns {void}
     */
    updateProgress(){
        // set mission text depending on progress and operator used
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

    /**
     * Fade out and destroy this display instance.
     *
     * @returns {void}
     */
    remove(){
        // Destroy object after fading out
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