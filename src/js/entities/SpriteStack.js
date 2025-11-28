import { EventBus } from "../core/event-bus";

/**
     * Configuration object passed to the SpriteStacking object.
     * @class
     * @extends Phaser.Physics.Matter.Sprite
     * @param {Phaser.Scene} scene - The scene this SpriteStacking object belongs to
     * @param {config} config - SpriteStacking configuration object
     * @param {Array} config.texture - An array of load images passed by key 
     * @param {Phaser.Cameras.Scene2D.Camera} camera- Reference to camera 
     * @param {number} config.x - X position
     * @param {number} config.y - Y position
     * @param {number} config.verticalOffset - Sprite stacking vertical offset in pixels
     * @param {number} scale - Scale of the sprite
     *
*/



export class SpriteStack extends Phaser.GameObjects.Sprite{
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
     * @param {Object} spriteStackConfig Configuration object for the SpriteStacking
     * @param {Phaser.Camera} camera Camera being used in the scene
     */
    constructor(scene, x, y, spriteStackConfig, physicsConfig, camera){
        super(scene, x, y);

        // If a physics configuration is provided, set it
        if(physicsConfig){
            scene.matter.add.gameObject(this, physicsConfig);
        }

        // sets initial values
        this.camera = camera;
        this.#cameraCosR = 1;
        this.#cameraSinR = 0;
        this.config = spriteStackConfig;  
        this.setOrigin(0.5); 
        if (this.config.offsetX || this.config.offsetY) {
            this.body.position.x += this.config.offsetX;
            this.body.position.y += this.config.offsetY;
            this.body.positionPrev.x += this.config.offsetX;
            this.body.positionPrev.y += this.config.offsetY;
        }
        
        // initializes stacking parameters 
        this.verticalOffset = spriteStackConfig.verticalOffset;
        
        for (let i = 0; i< spriteStackConfig.frameCount; i++ ){
            // Creates each sprite displaced by the vertical offset
            let sprite = this.scene.add.image(x, y - this.verticalOffset * i, spriteStackConfig.textures, i).setOrigin(0.5);
            sprite.scale = spriteStackConfig.scale;
            // Stores sprite in the array  
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
        // Updates the spritestacking offsets according to camera rotation
        // Corrects the sprite stacking position according to the camera angle and vertical offset
        for (let i = 0; i<this.sprites.length; i ++){
            this.sprites[i].x = this.sprites[0].x + sinR * i *this.verticalOffset;
            this.sprites[i].y = this.sprites[0].y - cosR * i *this.verticalOffset;
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
        // the position of the sprite stack can made manually by Phaser.
        const translationX = this.x - this.sprites[0].x;
        const translationY = this.y - this.sprites[0].y;
        for (let i = 0; i<this.sprites.length; i ++){
            this.sprites[i].x += translationX;
            this.sprites[i].y += translationY;
            this.sprites[i].rotation = this.rotation;
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
        // TODO: TEST IF THIS WORKS PROPERLY I THINK IT MIGHT BE WRONG
        // ALSO I DONT THINK WE NEED TO UPDATE DEPTH OF ALL SPRITES IN THE STACK?
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