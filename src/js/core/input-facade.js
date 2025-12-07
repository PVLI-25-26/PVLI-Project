import { EventBus } from "./event-bus";

/**
 * Counts how many callers requested the pointer to be locked so releases are balanced.
 * @type {number}
 * @private
 */
var numLockRequests = 0;

/**
 * Facade around Phaser input to centralize pointer-lock and player key management.
 */
export class InputFacade {

    /**
     * Create an InputFacade.
     * @param {Phaser.Scene} scene - Scene used to access input and keyboard systems.
     */
    constructor(scene){
        this.input = scene.input;

        // Initially enable player keys
        this.enablePlayerKeys();

        // Subscribe to events
        EventBus.on('lockPointer', this.lockPointer, this)

        EventBus.on('releasePointer', this.releasePointer, this)

        EventBus.on('disablePlayerKeys', this.disablePlayerKeys, this);

        EventBus.on('enablePlayerKeys', this.enablePlayerKeys, this);

        // Checks if pointer isn't locked when it should be (user exited mouse lock with ESC),
        // and locks mouse to correct it, when user clicks on the game.
        this.input.on('pointerdown',()=>{
            if(numLockRequests > 0 && !this.input.mouse.locked)
                this.input.mouse.requestPointerLock();
        }, this);
    }

    /**
     * Request pointer lock. If this is the first requester the browser pointer lock will be requested.
     * Increments the internal lock request counter.
     * @returns {void}
     */
    lockPointer(){
        // Only try locking if mouse hasn't been locked yet
        if(numLockRequests == 0) this.input.mouse.requestPointerLock();
        numLockRequests++;
    }

    /**
     * Release pointer lock. The actual pointer lock is only released when the request counter drops to zero.
     * Decrements the internal lock request counter.
     * @returns {void}
     */
    releasePointer(){
        // Only release pointer if all lock requestes have been solved
        if(numLockRequests == 1) this.input.mouse.releasePointerLock();
        numLockRequests--;
    }

    /**
     * Disable all player control keys managed by this facade.
     * Sets each key's enabled flag to false and clears its isDown state.
     * @returns {void}
     */
    disablePlayerKeys(){
        // Disable every key and set isDown to false (it kept turned on)
        for(let key in this.keys){
            this.keys[key].enabled = false;
            this.keys[key].isDown = false;
        }
    }

    /**
     * Reset the internal pointer lock request counter to zero.
     * Useful when the scene is torn down or when you need to forcibly resynchronize state.
     * @returns {void}
     */
    resetPointerLockCount(){
        numLockRequests = 0;
    }

    /**
     * Keys created:
     * - up: W, down: S, left: A, right: D
     * - rotCamLeft: Q, rotCamRight: E
     * - ability: SPACE
     * - pickItem: F
     *
     * After creation this method ensures keys are enabled and their isDown flag is cleared.
     *
     * @returns {void}
     */
    enablePlayerKeys(){
        // If keys hadn't been created yet, create them
        if(!this.keys){
            this.keys = this.input.keyboard.addKeys({
                up: Phaser.Input.Keyboard.KeyCodes.W,
                down: Phaser.Input.Keyboard.KeyCodes.S,
                left: Phaser.Input.Keyboard.KeyCodes.A,
                right: Phaser.Input.Keyboard.KeyCodes.D,
                rotCamLeft: Phaser.Input.Keyboard.KeyCodes.Q,
                rotCamRight: Phaser.Input.Keyboard.KeyCodes.E,
                ability: Phaser.Input.Keyboard.KeyCodes.SPACE,
                pickItem: Phaser.Input.Keyboard.KeyCodes.F,
                switchArrows: Phaser.Input.Keyboard.KeyCodes.R,
            });
        }

        // Enable every key, but set isDown to false to reset the value
        for(let key in this.keys){
            this.keys[key].enabled = true;
            this.keys[key].isDown = false;
        }
    }

    /**
     * Get the map of player keys managed by this facade.
     * Returns the internal keys object (PlayerKeys).
     * @returns {PlayerKeys}
     */
    getPlayerKeys(){
        return this.keys;
    }
}