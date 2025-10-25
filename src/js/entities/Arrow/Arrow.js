import { extendWithComponents } from "../../core/component-extension";
import serviceLocator, {SERVICE_KEYS} from "../../core/service-locator";

export class Arrow extends Phaser.GameObjects.Sprite{
    #trajectory;
    #effect;

    constructor(scene){
        super(scene, 0, 0, 'arrow');

        // This should probably be done by the pool
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setActive(false);
        this.setVisible(false);
    }

    shoot(trajectory, effect, oX, oY, tX, tY, power){
        this.x = oX;
        this.y = oY;

        this.#trajectory = trajectory;
        this.#effect = effect;

        // target direction
        this.target = {x: tX-oX, y: tY-oY};
        this.power = power;

        this.setActive(true);
        this.setVisible(true);

        this.#trajectory.shoot(this);
    }

    preUpdate(time, delta){
        this.#trajectory.update(time, delta);
    }
}