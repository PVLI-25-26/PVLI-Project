import { EventBus } from "./event-bus";

var numLockRequests = 0;

export class InputFacade {

    constructor(scene){
        this.input = scene.input;

        this.enablePlayerKeys();
        
        EventBus.on('lockPointer', this.lockPointer, this)

        EventBus.on('releasePointer', this.releasePointer, this)

        EventBus.on('disablePlayerKeys', this.disablePlayerKeys, this);

        EventBus.on('enablePlayerKeys', this.enablePlayerKeys, this);
    }

    lockPointer(){
        if(numLockRequests == 0) this.input.mouse.requestPointerLock();
        numLockRequests++;
    }

    releasePointer(){
        if(numLockRequests == 1) this.input.mouse.releasePointerLock();
        numLockRequests--;
    }

    disablePlayerKeys(){
        for(let key in this.keys){
            this.keys[key].enabled = false;
            this.keys[key].isDown = false;
        }
    }

    resetPointerLockCount(){
        numLockRequests = 0;
    }

    enablePlayerKeys(){
        if(!this.keys){
            this.keys = this.input.keyboard.addKeys({
                up: Phaser.Input.Keyboard.KeyCodes.W,
                down: Phaser.Input.Keyboard.KeyCodes.S,
                left: Phaser.Input.Keyboard.KeyCodes.A,
                right: Phaser.Input.Keyboard.KeyCodes.D,
                rotCamLeft: Phaser.Input.Keyboard.KeyCodes.Q,
                rotCamRight: Phaser.Input.Keyboard.KeyCodes.E,
                ability: Phaser.Input.Keyboard.KeyCodes.SPACE,
                pickItem: Phaser.Input.Keyboard.KeyCodes.F
            });
        }

        for(let key in this.keys){
            this.keys[key].enabled = true;
            this.keys[key].isDown = false;
        }
    }

    getPlayerKeys(){
        return this.keys;
    }
}