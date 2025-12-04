import { HudModel } from "../js/UI/hud/HUDModel.js";
import { HudView } from "../js/UI/hud/HUDView.js";
import { HudPresenter } from "../js/UI/hud/HUDPresenter.js";

export default class HUDScene extends Phaser.Scene {
    constructor() {
        super("HUDScene");
    }

    create() {
        const model = new HudModel();
        const view = new HudView(this);  
        const presenter = new HudPresenter(view, model);
    }
}
