import { EventBus } from "../core/event-bus";

/**
     * Configuration object passed to the SpriteStacking object.
     * @class
     * @extends Phaser.GameObjects.Sprite
     * @param {Phaser.Scene} scene - The scene this SpriteStacking object belongs to
     * @param {config} config - SpriteStacking configuration object
     * @param {Array} config.texture - An array of load images passed by key 
     * @param {Phaser.Cameras.Scene2D.Camera} camera- Reference to camera 
     * @param {number} config.x - X position
     * @param {number} config.y - Y position
     * @param {number} config.verticalOffset - Sprite stacking vertical offset in pixels
     * @param {number} scale - Scale of the sprite
     * @param {boolean} config.BillBoard - Sets the billBoard mode on
     *
*/
export class SpriteStacking extends Phaser.GameObjects.Sprite{
    /**
     * @type {Object} Configuration object passed to the Sprite Stacking object
     */
    config;
    /**
     * @type {Phaser.Cameras.Scene2D.Camera} Reference to camera being used
     */
    camera;
    /**
     * @type {number} Displacement applied per sprite in the stack
     */
    verticalOffset;
    /**
     * @type {Array} Array of sprites that compose the stacking
     */
    sprites = [];
    /**
     * @type {number} Scale applied to each sprite in the stack
     */
    scale;
    /**
     * @type {boolean} BillBoard mode flag
     */
    billBoard;
    /**
     * @type {number} Cosine of the camera rotation (saved for performance)
     */
    #cameraCosR;
    /**
     * @type {number} Sine of the camera rotation (saved for performance)
     */
    #cameraSinR;

    /**
     * Creates a new instance of SpriteStacking and adds it to the scene.
     * @param {Phaser.Scene} scene Scene in which the SpriteStacking is to be instanced
     * @param {Object} config Configuration object for the SpriteStacking
     * @param {Phaser.Camera} camera Camera being used in the scene
     */
    constructor(scene, config, camera){
        super(scene,config.x,config.y);

        // sets initial values
        this.camera = camera;
        this.#cameraCosR = 1;
        this.#cameraSinR = 0;
        this.config = config;   
        this.scale = config.scale;

        // adds self to scene
        scene.add.existing(this);
        
        // initializes stacking parameters
        this.billBoard = config.BillBoard;
        this.scale = config.scale;  
        this.verticalOffset = config.verticalOffset;

        // If not in billBoard mode, creates a sprite for each texture in the array
        if (!this.billBoard){
            for (let i = 0; i< config.frameCount; i++ ){
                // Creates each sprite displaced by the vertical offset
                const sprite = scene.add.image(config.x,config.y - this.verticalOffset * i, config.textures, i).setOrigin(0.5);
                sprite.scale = this.scale;
                // Stores sprite in the array  
                this.sprites.push(sprite);
            }   
        }
        else {
            // In billBoard mode, only one sprite is created (the first in the array)
            const sprite = scene.add.image(config.x,config.y,config.textures[0]).setOrigin(0.5);
            sprite.scale = this.scale;
            this.sprites.push(sprite);
        }
        
        // Subscribes to camera rotation events to update sprite stacking positions
        EventBus.on('cameraRotated', this.onCameraRotated, this);
    }

    /**
     * Updates sprite stacking positions upon camera rotation.
     * @param {number} R Rotation of the camera in radians
     * @param {number} cosR Cosine of -R
     * @param {number} sinR Sine of -R
     */
    onCameraRotated(R, cosR, sinR){
        // If in billBoard mode, only rotates first sprite to face the camera
        if (this.billBoard){
            this.sprites[0].rotation = -R;
        }
        // Updates the spritestacking offsets according to camera rotation
        else{
            // Corrects the sprite stacking position according to the camera angle and vertical offset
            for (let i = 0; i<this.sprites.length; i ++){
                this.sprites[i].x = this.sprites[0].x + sinR * i *this.verticalOffset;
                this.sprites[i].y = this.sprites[0].y - cosR * i *this.verticalOffset;
            }
        }

        // Saves sine and cosine for depth calculation in preUpdate
        this.#cameraCosR = cosR;
        this.#cameraSinR = sinR;

        // Updates depth of sprites in the stack
        this.updateDepth(cosR,sinR);
    }
    
    preUpdate(time, delta){
        super.preUpdate(time,delta);

        // FOR PERFORMANCE IMPROVEMENTS - MAYBE SUBSCRIBE TO DATA CHANGES TO UPDATE DEPTH AND POSITION (instead of in every frame like here)

        // Updates position of all sprites in the stack
        // Would be ideal to store the array of sprites in a container so that updating
        //      the position of the sprite stack can made manually by Phaser.
        const translationX = this.x - this.sprites[0].x;
        const translationY = this.y - this.sprites[0].y;
        for (let i = 0; i<this.sprites.length; i ++){
            this.sprites[i].x += translationX;
            this.sprites[i].y += translationY;
        }

        // Updates depth of sprites in the stack
        this.updateDepth(this.#cameraCosR,this.#cameraSinR);
    }

    /**
     * Updates depth of sprites in the stack based on their position and camera rotation.
     * @param {number} cosR Cosine of -camera rotation 
     * @param {*} sinR Sine of -camera rotation
     */
    updateDepth(cosR, sinR){
        // If in billBoard mode, only updates depth of first sprite
        if (this.billBoard){
            this.sprites[0].setDepth(this.y*cosR-this.x*sinR);
        }
        // TODO: TEST IF THIS WORKS PROPERLY I THINK IT MIGHT BE WRONG
        // ALSO I DONT THINK WE NEED TO UPDATE DEPTH OF ALL SPRITES IN THE STACK?
        else{
            // Updates depth of all sprites in the stack
            for (let i = 0; i<this.sprites.length; i ++){
                // The reason for '+ Number.MIN_VALUE' is that the sprite stack must internally be depth sorted
                //      in opposite order of all other sprites, however as a group they must be sorted like the rest
                //      of sprites in the game. Therefore, we adjust their depth by the smallest value possible so 
                //      so that internally they are sorted contrary to other sprites but they will be depth sorted
                //      correctly as a group.
                this.sprites[i].setDepth((this.y*cosR-this.x*sinR) + Number.MIN_VALUE*i);
            }
        }
    }
}