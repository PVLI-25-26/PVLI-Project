import { createItemDisplay } from "../../core/factories/item-factory";
import { Button } from "../elements/button";
import { Slider } from "../elements/slider";
import Colors from "../../../configs/colors-config.js"

// Far away position of item displays and camera that shows them in inventory
// Keep large to ensure the items and camera rendering them are outside the visible area
const ITEMLIST_DISPLAY_POS = 10000;
// Speed at which the camera scrolls through items
const CAMERA_SCROLL_SPEED = 0.7;

const INVENTORY_WIDTH = 500;
const INVENTORY_HEIGHT = 600;

const ITEMLIST_DISPLAY_WIDTH = 380;
const ITEMLIST_DISPLAY_HEIGHT = 500;

const ITEM_DISPLAY_WIDTH = ITEMLIST_DISPLAY_WIDTH;
const ITEM_DISPLAY_HEIGHT = 150;
// Space between each Item display
const ITEM_DISPLAY_MARGIN = 20;

// It's rotated 90 degrees (width goes in y axis, and height in x)
const SLIDER_WIDTH = INVENTORY_HEIGHT*0.70;
const SLIDER_HEIGHT = 10;

const INVENTORY_TITLE_COLOR = Colors.White; 
const INVENTORY_TITLE_FONTSIZE = 20;
const INVENTORY_TITLE_FONTFAMILY = 'FableFont';

const INVENTORY_TIP_COLOR = Colors.White; 
const INVENTORY_TIP_FONTSIZE = 10;
const INVENTORY_TIP_FONTFAMILY = 'MicroChat';

/**
 * View class for the inventory menu UI.
 *
 * @class InventoryMenuView
 */
export default class InventoryMenuView {

    /**
     * Create an InventoryMenuView.
     * @param {Phaser.Scene} scene - The Phaser scene used to create UI elements.
     */
    constructor(scene) {
        this.scene = scene;
        // Add elements to scene
        this.createElements(scene);
    }

    /**
     * Create static UI elements and containers.
     * @private
     * @param {Phaser.Scene} scene
     * @returns {void}
     */
    createElements(scene){
        // Create inventory background
        this.inventoryBG = this.scene.add.nineslice(this.scene.scale.width/2, this.scene.scale.height/2, 'UIbackground', 0, INVENTORY_WIDTH, INVENTORY_HEIGHT, 4, 4, 4, 4).setOrigin(0.5);
        this.inventoryBG.setScale(2);
        this.inventoryBG.width /= 2;
        this.inventoryBG.height /= 2;

        this.inventoryTitle = this.scene.add.text(this.inventoryBG.x, this.inventoryBG.y-(this.inventoryBG.height)+25, 'INVENTORY', {
            color: INVENTORY_TITLE_COLOR, 
            fontSize: INVENTORY_TITLE_FONTSIZE,
            fontFamily: INVENTORY_TITLE_FONTFAMILY,
            padding: {x: 0, y: 10}
        }).setOrigin(0.5);

        this.inventoryTip = this.scene.add.text(this.inventoryBG.x, this.inventoryBG.y+(this.inventoryBG.height)-25, 'Hold click on an item to consume it.', {
            color: INVENTORY_TIP_COLOR, 
            fontSize: INVENTORY_TIP_FONTSIZE,
            fontFamily: INVENTORY_TIP_FONTFAMILY,
            padding: {x: 0, y: 10}
        }).setOrigin(0.5);

        // Create container with all item displays
        this.itemDisplayListContainer = this.scene.add.container(ITEMLIST_DISPLAY_POS, ITEMLIST_DISPLAY_POS);

        // Create camera to scroll through the item displays
        this.createItemListCamera();

        // Create exit button
        this.createExitButton(scene);

        // Create slider
        this.createSlider(scene);
    }

     /**
     * Create a dedicated camera that views the itemDisplayListContainer and wire mouse wheel scrolling.
     * @private
     * @returns {void}
     */
    createItemListCamera() {
        this.itemListCamera = this.scene.cameras.add(this.scene.scale.width / 2 - ITEMLIST_DISPLAY_WIDTH/2, this.scene.scale.height / 2 - ITEMLIST_DISPLAY_HEIGHT/2, ITEMLIST_DISPLAY_WIDTH, ITEMLIST_DISPLAY_HEIGHT, false, 'itemDisplayCamera');
        this.itemListCamera.setScroll(ITEMLIST_DISPLAY_POS, ITEMLIST_DISPLAY_POS);

        // Set min and max scroll
        this.minCamScroll = this.maxCamScroll = this.itemListCamera.scrollY;

        // Update camera scroll when mouse wheel is moved
        this.scene.input.on("wheel", (pointer, gameObject, dx, dy, dz) => {
            // Calculate new cam scroll
            let newCamScrollY = this.itemListCamera.scrollY + dy * CAMERA_SCROLL_SPEED;
            // Clamp cam scroll
            newCamScrollY = Phaser.Math.Clamp(newCamScrollY, this.minCamScroll, this.maxCamScroll);
            // Apply new scroll
            this.itemListCamera.scrollY = newCamScrollY;
            // Update slider UI scroll
            this.itemListSlider.setValue((newCamScrollY - this.minCamScroll) / (this.maxCamScroll - this.minCamScroll));
        });
    }

    /**
     * Create and wire the exit button interactions.
     * @private
     * @param {Phaser.Scene} scene
     * @returns {void}
     */
    createExitButton(scene) {
        this.exitButton = new Button(this.scene, 
            this.inventoryBG.x + INVENTORY_WIDTH / 2 - 50, 
            this.inventoryBG.y - INVENTORY_HEIGHT / 2, 
            null, 50, 50,
            {
                text: 'X',
                style: {
                    fontSize: 20,
                    color: Colors.White,
                    fontFamily: 'FableFont',
                    padding: { x: 20, y: 10 },
                }
            }
        );
        // Wire button interactions with visual changes
        this.exitButton.addInteraction((btn) => {
            btn.on("pointerover", () => {
                btn.buttonText.setColor(Colors.Red);
                btn.invokeHover();
            });
            btn.on("pointerout", () => {
                btn.buttonText.setColor(Colors.White);
            });
            btn.on("pointerdown", () => {
                btn.invokeClick();
            });
        });
    }

    /**
     * Create the vertical slider used to scroll the item list and wire slider change events to camera scroll.
     * @private
     * @param {Phaser.Scene} scene
     * @returns {void}
     */
    createSlider(scene) {
        // Create slider
        this.itemListSlider = new Slider(scene, this.inventoryBG.x + INVENTORY_WIDTH / 2 - 30, this.inventoryBG.y, SLIDER_WIDTH, SLIDER_HEIGHT, 0);
        this.itemListSlider.setAngle(90);

        // Update camera scroll when scroll slider value is updated
        this.itemListSlider.on('slider-changed', (value) => {
            this.itemListCamera.scrollY = this.minCamScroll + (this.maxCamScroll - this.minCamScroll) * value;
        });
    }

    /**
     * Reset and populate the inventory list with the provided items.
     *
     * @param {Array<ItemDisplayData>} itemKeys - Array of data used to create each item display.
     * @returns {void}
     */
    resetInventoryList(itemKeys){
        // Remove all previous elements
        this.itemDisplayListContainer.removeAll(true);

        // Fill list with new displays using the give keys
        for(let i = 0; i < itemKeys.length; i++){
            const itemDisplay = createItemDisplay(this.scene, 0, i*(ITEM_DISPLAY_HEIGHT+ITEM_DISPLAY_MARGIN), ITEM_DISPLAY_WIDTH, ITEM_DISPLAY_HEIGHT, itemKeys[i])
            itemDisplay.on('itemConsumed', ()=>this.removeItem(itemDisplay));
            this.itemDisplayListContainer.add(itemDisplay);
        }

        // Update camera scroll
        this.updateCameraScroll();
    }

    /**
     * Recalculate min/max camera scroll values based on current list length and camera height.
     * @private
     * @returns {void}
     */
    updateCameraScroll() {
        // Calculate new maximum camera scroll depending how many items are displayed, how tall they are, and how much the camera shows
        this.maxCamScroll = this.minCamScroll + this.itemDisplayListContainer.list.length * (ITEM_DISPLAY_HEIGHT + ITEM_DISPLAY_MARGIN) - this.itemListCamera.height;
        // Clamp maximum scroll to be greater than minimum
        this.maxCamScroll = Math.max(this.minCamScroll, this.maxCamScroll);
    }

    /**
     * Remove an item display from the list, emit the itemConsumed event (with index) and animate remaining items and camera.
     * @param {Phaser.GameObjects.Container} itemDisplay - The item display instance to remove.
     * @returns {void}
     */
    removeItem(itemDisplay){
        const idx = this.itemDisplayListContainer.getIndex(itemDisplay);

        // Update model
        this.itemDisplayListContainer.emit('itemConsumed', idx);

        // Remove item
        this.itemDisplayListContainer.remove(itemDisplay, true);
        
        // Move other displays up with tween
        this.itemDisplaysToMove = this.itemDisplayListContainer.list.slice(idx);
        this.scene.tweens.add({
            targets: this.itemDisplaysToMove,
            y: `-=${(ITEM_DISPLAY_HEIGHT+ITEM_DISPLAY_MARGIN)}`,
            ease: 'Cubic',
            duration: 100,
            repeat: 0,
            onComplete: (tween)=>{
                tween.remove();
            }
        })

        // Update camera scroll
        this.updateCameraScroll();
        // Move camera up to not exceed maximum camera scroll
        let newCamScrollY = Math.max(this.itemListCamera.scrollY - (ITEM_DISPLAY_HEIGHT+ITEM_DISPLAY_MARGIN), this.minCamScroll)
        this.scene.tweens.add({
            targets: this.itemListCamera,
            scrollY: newCamScrollY,
            ease: 'Cubic',
            duration: 100,
            repeat: 0,
            onComplete: (tween)=>{
                tween.remove();
            }
        })
    }

    /**
     * Bind a presenter to the view.
     * @param {Object} presenter - Presenter instance that handles view actions.
     * @returns {void}
     */
    setPresenter(presenter) {
        this.presenter = presenter;
    }
}