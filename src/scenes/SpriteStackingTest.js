import { SpriteStacking } from "../js/entities/SpriteStacking.js";
import config from "../configs/spritestacking-config.json";

export default class SpriteStackingTest extends Phaser.Scene {
    constructor() {
        super({ key: 'SpriteStackingTest' });
    }

    preload() {
        this.load.image("base", "assets/sprites/SPriteStackingPlaceHolder1.png")
        this.load.image("body", "assets/sprites/SPriteStackingPlaceHolder2.png")
    }


    create() {
        this.cameras.main.setBounds(0,0,1014*2,1024*2);
        //this.cameras.main.centerToBounds();
        this.spriteStacking = new SpriteStacking(this,config,this.cameras.main);
        this.keys = this.input.keyboard.addKeys("W,A,S,D");
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update(time, delta) {
        const cam = this.cameras.main;
        if (this.keys.A.isDown)
        {
            cam.scrollX -= 6;
        }
        else if (this.keys.D.isDown)
        {
            cam.scrollX += 6;
        }
    
        if (this.keys.W.isDown)
        {
            cam.scrollY -= 6;
        }
        else if (this.keys.S.isDown)
        {
            cam.scrollY += 6;
        }
    
        if (this.cursors.left.isDown)
        {
            cam.rotation += 0.05;
        }
        else if (this.cursors.right.isDown)
        {
            cam.rotation -= 0.05;
        }
    }
}

