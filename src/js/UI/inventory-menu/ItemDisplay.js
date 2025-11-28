import Colors from "../../../configs/color-config.json"

// Vertical margin for the image inside the item
const IMG_MARGIN_VER = 20;
// Horizontal margin for the image inside the item
const IMG_MARGIN_HOR = 20;

// For item name and description
// Distance between item image and item title and description
const ITEM_TEXT_MARGIN_HOR = 20;

// Font size and color used in item title
const ITEM_TITLE_FONTSIZE = '20px';
const ITEM_TITLE_COLOR = Colors.Red;
const ITEM_TITLE_FONTFAMILY = 'FableFont';

// Font size and color used in item description
const ITEM_DESC_FONTSIZE = '9px';
const ITEM_DESC_COLOR = Colors.White;
const ITEM_DESC_FONTFAMILY = 'MicroChat';

// Speed at which the progress bar is increased or decreased when player holds click
// NOTE: Progres bar goes from values 0 - 1
const ITEM_CONSUMPTION_SPEED = 0.001;
const ITEM_DECONSUMPTION_SPEED = 0.0007;

/**
 * Visual container that represents a single inventory item in the InventoryMenu.
 *
 * @extends {Phaser.GameObjects.Container}
 */
export class ItemDisplay extends Phaser.GameObjects.Container{
    /**
     * Create an ItemDisplay.
     * @param {Phaser.Scene} scene - Scene used to create the display objects.
     * @param {number} x - X position for the container.
     * @param {number} y - Y position for the container.
     * @param {ItemDisplayData} itemData - Data used to populate the display.
     * @param {number} [width=300] - Width of the display area.
     * @param {number} [height=100] - Height of the display area.
     */
    constructor(scene, x, y, itemData, width = 300, height = 100){
        super(scene, x, y);

        // Create display background
        this.itemBG = this.scene.add.nineslice(0, 0, 'UIbackground', 0, width/2, height/2, 3,3,3,3 ).setOrigin(0);
        this.itemBG.setScale(2);

        // Create background progress bar for consuming items
        this.itemProgress = this.scene.add.rectangle(this.itemBG.leftWidth*this.itemBG.scale, this.itemBG.topHeight*this.itemBG.scale, 0, (height/2)-6, parseInt(Colors.LightBrown.slice(1), 16)).setOrigin(0);
        this.itemProgress.setScale(2);

        // reset progress bar values
        this.consumeProgress = 0;
        this.isBeingPressed = false;
        // Create item image and set its size depending on space available
        this.itemIMG = this.scene.add.image(IMG_MARGIN_HOR, height/2, itemData.image, itemData.frame).setOrigin(0, 0.5);
        this.itemIMG.displayWidth = this.itemIMG.width = height-IMG_MARGIN_VER*2;
        this.itemIMG.displayHeight = this.itemIMG.height =  height-IMG_MARGIN_VER*2;

        // Set item title text
        this.itemTITLE = this.scene.add.text(this.itemIMG.x+this.itemIMG.width+ITEM_TEXT_MARGIN_HOR, this.itemIMG.y-this.itemIMG.height/2, itemData.name, {
            color: ITEM_TITLE_COLOR, 
            fontSize: ITEM_TITLE_FONTSIZE,
            fontFamily: ITEM_TITLE_FONTFAMILY
        }).setOrigin(0);

        // Set item description text
        this.itemDESC = this.scene.add.text(this.itemIMG.x+this.itemIMG.width+ITEM_TEXT_MARGIN_HOR, this.itemTITLE.y+this.itemTITLE.height, itemData.description, {
            color: ITEM_DESC_COLOR, 
            fontSize: ITEM_DESC_FONTSIZE,
            fontFamily: ITEM_DESC_FONTFAMILY
        }).setOrigin(0);  
        this.itemDESC.setWordWrapWidth(width-this.itemDESC.x-ITEM_TEXT_MARGIN_HOR)
        
        // Make container interactive to detect pointer presses
        this.setInteractive(
            new Phaser.Geom.Rectangle(0, 0, width, height),
            Phaser.Geom.Rectangle.Contains
        );

        // Add all items to container
        this.add([this.itemBG, this.itemProgress, this.itemIMG, this.itemTITLE, this.itemDESC]);
        
        // Add container to scene
        this.scene.add.existing(this);

        // Check for pointer input to update UI
        this.on('pointerdown', ()=>{this.isBeingPressed = true;});
        this.on('pointerup', ()=>this.isBeingPressed = false);
        this.on('pointerout', ()=>this.isBeingPressed = false);
    }

    preUpdate(t, dt){
        // Increase or decrease progress bar
        if(this.isBeingPressed){
            this.consumeProgress += ITEM_CONSUMPTION_SPEED * dt;
            this.consumeProgress = Math.min(1, this.consumeProgress);
            this.itemProgress.width = this.consumeProgress * (this.itemBG.width-this.itemBG.rightWidth*2);
        }
        else{
            this.consumeProgress -= ITEM_DECONSUMPTION_SPEED * dt;
            this.consumeProgress = Math.max(0, this.consumeProgress);
            this.itemProgress.width = this.consumeProgress * (this.itemBG.width-this.itemBG.rightWidth*2);
        }

        // If progress bar is complete, consume item
        if(this.consumeProgress == 1) this.itemConsumed();
    }

    /**
     * Called when the item is fully consumed.
     * Emits the 'itemConsumed' event and fades the display out.
     *
     * @returns {void}
     */
    itemConsumed(){
        // Tween to remove item. When complete, disables item and notifies presenter to update model
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