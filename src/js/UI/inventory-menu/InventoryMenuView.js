import { createItemDisplay } from "../../core/factories/item-factory";
import { Button } from "../elements/button";
import { Slider } from "../elements/slider";

const ITEMLIST_DISPLAY_POS = 10000;
const CAMERA_SCROLL_SPEED = 0.7;

const INVENTORY_WIDTH = 500;
const INVENTORY_HEIGHT = 500;

const ITEMLIST_DISPLAY_WIDTH = 300;
const ITEMLIST_DISPLAY_HEIGHT = 400;

const ITEM_DISPLAY_WIDTH = ITEMLIST_DISPLAY_WIDTH;
const ITEM_DISPLAY_HEIGHT = 100;
const ITEM_DISPLAY_MARGIN = 20;

// It's rotated 90 degrees
const SLIDER_WIDTH = INVENTORY_HEIGHT*0.70;
const SLIDER_HEIGHT = 10;

export default class InventoryMenuView {

    constructor(scene) {
        this.scene = scene;
        this.createElements(scene);
    }

    createElements(scene){
        // Create inventory background
        this.inventoryBG = this.scene.add.rectangle(this.scene.scale.width/2, this.scene.scale.height/2, INVENTORY_WIDTH, INVENTORY_HEIGHT, 0x998570, 40).setOrigin(0.5);

        // Create container with all item displays
        this.itemDisplayListContainer = this.scene.add.container(ITEMLIST_DISPLAY_POS, ITEMLIST_DISPLAY_POS);

        // Create camera to scroll through the item displays
        this.createItemListCamera();

        // Create exit button
        this.createExitButton(scene);

        // Create slider
        this.createSlider(scene);
    }

    createItemListCamera() {
        this.itemListCamera = this.scene.cameras.add(this.scene.scale.width / 2 - ITEMLIST_DISPLAY_WIDTH/2, this.scene.scale.height / 2 - ITEMLIST_DISPLAY_HEIGHT/2, ITEMLIST_DISPLAY_WIDTH, ITEMLIST_DISPLAY_HEIGHT, false, 'itemDisplayCamera');
        this.itemListCamera.setScroll(ITEMLIST_DISPLAY_POS, ITEMLIST_DISPLAY_POS);

        // Set min and max scroll
        this.minCamScroll = this.maxCamScroll = this.itemListCamera.scrollY;

        // Update camera scroll when mouse wheel is moved
        this.scene.input.on("wheel", (pointer, gameObject, dx, dy, dz) => {
            let newCamScrollY = this.itemListCamera.scrollY + dy * CAMERA_SCROLL_SPEED;
            newCamScrollY = Math.max(newCamScrollY, this.minCamScroll);
            newCamScrollY = Math.min(newCamScrollY, this.maxCamScroll);
            this.itemListCamera.scrollY = newCamScrollY;
            this.itemListSlider.setValue((newCamScrollY - this.minCamScroll) / (this.maxCamScroll - this.minCamScroll));
        });
    }

    createExitButton(scene) {
        this.exitButton = new Button(scene, this.inventoryBG.x + INVENTORY_WIDTH / 2, this.inventoryBG.y - INVENTORY_HEIGHT / 2, 'X').setOrigin(1, 0);
        this.exitButton.addInteraction((btn) => {
            btn.on("pointerover", () => {
                btn.setColor("#ffffffff");
                btn.invokeHover();
            });
            btn.on("pointerout", () => {
                btn.setColor("#b2b2b2ff");
            });
            btn.on("pointerdown", () => {
                btn.invokeClick();
            });
        });
    }

    createSlider(scene) {
        // Create slider
        this.itemListSlider = new Slider(scene, this.inventoryBG.x + INVENTORY_WIDTH / 2 - 10, this.inventoryBG.y, SLIDER_WIDTH, SLIDER_HEIGHT, 0);
        this.itemListSlider.setAngle(90);

        // Update camera scroll when scroll slider value is updated
        this.itemListSlider.on('slider-changed', (value) => {
            this.itemListCamera.scrollY = this.minCamScroll + (this.maxCamScroll - this.minCamScroll) * value;
        });
    }


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
        this._updateCameraScroll();
    }

    _updateCameraScroll() {
        this.maxCamScroll = this.minCamScroll + this.itemDisplayListContainer.list.length * (ITEM_DISPLAY_HEIGHT + ITEM_DISPLAY_MARGIN) - this.itemListCamera.height;
        this.maxCamScroll = Math.max(this.minCamScroll, this.maxCamScroll);
    }

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
        this._updateCameraScroll();
        //.maxCamScroll = Math.max(this.minCamScroll, this.minCamScroll+this.itemDisplayListContainer.list.length*(ITEM_DISPLAY_HEIGHT+ITEM_DISPLAY_MARGIN)-this.itemListCamera.height);
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

    setPresenter(presenter) {
        this.presenter = presenter;
    }
}