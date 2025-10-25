/**
     * Configuration object passed to the SpriteStacking object.
     * @class
     * @param {Phaser.Scene} scene - The scene this SpriteStacking object belongs to
     * @param {config} config - SpriteStacking configuration object
     * @param {Array} config.texture - An array of load images passed by key 
     * @param {Object} camera- Reference to camera 
     * @param {number} config.x - X position
     * @param {number} config.y - Y position
     * @param {number} config.verticalOffset - Sprite stacking vertical offset in pixels
     * @param {number} scale - Scale of the sprite
     * @param {boolean} config.BillBoard - Sets the billBoard mode on
     *
*/
export class SpriteStacking extends Phaser.GameObjects.Sprite{
    /**
     * Configuration object passed to the Sprite Stacking object
     * @type {Object}
     */
    config;
    camera;
    verticalOffset;
    sprites = [];
    scale;
    billBoard;

    constructor(scene, config, camera){
        super(scene,config.x,config.y);

        var sprites = [];
        var scale = scale;
        this.camera = camera;
        this.config = config;   

        scene.add.existing(this);
        
        this.billBoard = config.BillBoard;
        this.scale = config.scale;  
        this.verticalOffset = config.verticalOffset;

        if (!this.billBoard){
            for (let i = 0; i< config.textures.length; i++ ){
                let sprite = scene.add.image(config.x,config.y - this.verticalOffset * i, config.textures[i]).setOrigin(0.5);
                sprite.scale = this.scale;    
                this.sprites.push(sprite);
            }   
        }
        else {
            let sprite = scene.add.image(config.x,config.y,config.textures[0]).setOrigin(0.5);
            sprite.scale = this.scale;
            this.sprites.push(sprite);
        }
        
    }
    
    preUpdate(time, delta){
        super.preUpdate(time,delta);
        if (this.billBoard){
            this.sprites[0].rotation = -this.camera.rotation;
        }
        else{
            // Calculates the camera rotation.
            let cameraX = -Math.sin(this.camera.rotation);
            let cameraY = -Math.cos(this.camera.rotation);
            
            // Corrects the sprite stacking position according to the camera angle and vertical offset
            for (let i = 0; i<this.sprites.length; i ++){
                this.sprites[i].x = this.sprites[0].x + cameraX * i *this.verticalOffset;
                this.sprites[i].y = this.sprites[0].y + cameraY * i *this.verticalOffset;
            }
        }
        
    }
}