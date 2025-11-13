export class BaseAbility {
    #isActive;
    #coolDown;
    #duration;

    constructor(scene, coolDown, duration){
        this.scene = scene;
        this.#coolDown = coolDown;
        this.#duration = duration;
        this.#isActive = false;
    }

    onAbilityPressed(){
        if(!this.#isActive) {
            this.#isActive = true;
            this.scene.time.addEvent({
                delay: this.#duration,
                callback: this.abilityEnded,
                callbackScope: this,
                loop: false
            });
            if(this.onAbilityActivated) this.onAbilityActivated();
        }
    }

    abilityEnded(){
        this.scene.time.addEvent({
            delay: this.#coolDown,
            callback: ()=>this.#isActive = false,
            loop: false
        });
        if(this.onAbilityDeactivated) this.onAbilityDeactivated();
    }
}