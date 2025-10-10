import { withComponents } from "../core/component-extension.js";
import { MovementComponent } from "../components/Movement.js";
import { PlayerControllerComponent } from "../components/PlayerController.js";

export class Player extends Phaser.GameObjects.Sprite {
    /**
     * @param {Phaser.Scene} scene
     * @param {Object} config - Player configuration object
     * @param {string} config.texture - Sprite texture key
     * @param {number} config.frame - Frame index
     * @param {number} config.x - Initial X position
     * @param {number} config.y - Initial Y position
     * @param {number} config.speed - Movement speed
     */
    constructor(scene, config) {
        super(scene, config.x, config.y, config.texture, config.frame);
        this.config = config;

        withComponents(this); // add component system to this GameObject
        scene.physics.add.existing(this);
        this.addComponents(); // add components defined in method
    }

    addComponents() {
        // Add MovementComponent
        const movement = new MovementComponent(this, this.config.speed || 200);
        this.addComponent(movement);

        // Add PlayerControllerComponent
        const controller = new PlayerControllerComponent(this);
        this.addComponent(controller);
    }


    preUpdate(time, delta) {
        super.preUpdate(time, delta);
    }
}

// ----------------- Factory registration -----------------
Phaser.GameObjects.GameObjectFactory.register('player', function(config) {
    const player = new Player(this.scene, config);
    return this.displayList.add(player);
});
