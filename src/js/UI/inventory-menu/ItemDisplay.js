const IMG_MARGIN_VER = 20;
const IMG_MARGIN_HOR = 10;

// For item name and description
const ITEM_TEXT_MARGIN_HOR = 10;

const ITEM_NAME_FONTSIZE = '20px';
const ITEM_NAME_COLOR = '#0';

const ITEM_DESC_FONTSIZE = '12px';
const ITEM_DESC_COLOR = '#4f4f4f';

const ITEM_CONSUMPTION_SPEED = 0.001;
const ITEM_DECONSUMPTION_SPEED = 0.0007;

export class ItemDisplay extends Phaser.GameObjects.Container{
    constructor(scene, x, y, itemData, width = 300, height = 100){
        super(scene, x, y);

        this.itemBG = this.scene.add.rectangle(0, 0, width, height, 0xFFFFFF).setOrigin(0);

        this.itemProgress = this.scene.add.rectangle(0, 0, 0, height, 0x0).setOrigin(0).setAlpha(0.2);

        this.itemIMG = this.scene.add.image(IMG_MARGIN_HOR, height/2, itemData.image).setOrigin(0, 0.5);
        this.itemIMG.displayWidth = this.itemIMG.width = height-IMG_MARGIN_VER*2;
        this.itemIMG.displayHeight = this.itemIMG.height =  height-IMG_MARGIN_VER*2;

        this.itemTXT = this.scene.add.text(this.itemIMG.x+this.itemIMG.width+ITEM_TEXT_MARGIN_HOR, this.itemIMG.y-this.itemIMG.height/2, itemData.name, {
            color: ITEM_NAME_COLOR, 
            fontSize: ITEM_NAME_FONTSIZE
        }).setOrigin(0);

        this.itemDESC = this.scene.add.text(this.itemIMG.x+this.itemIMG.width+ITEM_TEXT_MARGIN_HOR, this.itemIMG.y, itemData.description, {
            color: ITEM_DESC_COLOR, 
            fontSize: ITEM_DESC_FONTSIZE,
        }).setOrigin(0);  
        this.itemDESC.setWordWrapWidth(width-this.itemDESC.x-ITEM_TEXT_MARGIN_HOR)
        
        this.consumeProgress = 0;
        this.isBeingPressed = false;

        this.setInteractive(
            new Phaser.Geom.Rectangle(0, 0, width, height),
            Phaser.Geom.Rectangle.Contains
        );

        this.add([this.itemBG, this.itemProgress, this.itemIMG, this.itemTXT, this.itemDESC]);
        
        this.scene.add.existing(this);

        this.on('pointerdown', ()=>{this.isBeingPressed = true;});
        this.on('pointerup', ()=>this.isBeingPressed = false);
        this.on('pointerout', ()=>this.isBeingPressed = false);
    }

    preUpdate(t, dt){

        if(this.isBeingPressed){
            this.consumeProgress += ITEM_CONSUMPTION_SPEED * dt;
            this.consumeProgress = Math.min(1, this.consumeProgress);
            this.itemProgress.width = this.consumeProgress * this.itemBG.width;
        }
        else{
            this.consumeProgress -= ITEM_DECONSUMPTION_SPEED * dt;
            this.consumeProgress = Math.max(0, this.consumeProgress);
            this.itemProgress.width = this.consumeProgress * this.itemBG.width;
        }

        if(this.consumeProgress == 1) this.itemConsumed();
    }

    itemConsumed(){
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            ease: 'Linear',
            duration: 50,
            repeat: 0,
            onComplete: (tween)=>{
                tween.remove();
                this.setActive(false);
                this.setVisible(false);
                this.emit('itemConsumed');
            }
        })
    }
}