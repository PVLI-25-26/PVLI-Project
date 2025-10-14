Our game uses a **component-based architecture** for [GameObjects](https://docs.phaser.io/phaser/concepts/gameobjects) in Phaser. This allows flexible composition of behavior and state, separating logic into reusable components rather than monolithic classes. Each GameObject can have multiple components, such as movement, input control, AI, or custom behaviors.

[Components](https://docs.phaser.io/phaser-editor/scene-editor/user-components) follow **composition over inheritance**:

- GameObjects extend Phaser classes (e.g., [Phaser.GameObjects.Sprite](https://docs.phaser.io/api-documentation/class/gameobjects-sprite) or [Phaser.GameObjects.Shader](https://docs.phaser.io/api-documentation/class/gameobjects-shader)) and are enhanced with components.
 
- Components encapsulate specific behavior and state.

- Some components require the presence of other components on the GameObject. For example, any controller component requires a `MovementComponent`.

---

## Creating a GameObject

1. **Create a new class**, extending a Phaser GameObject.
2. **Extend it with the component system** using `extendWithComponents(this)` for custom behavior.

3. **Add the GameObject to the scene**
- Use `scene.add.existing(this)` to add it visually.
- Use `scene.physics.add.existing(this)` to add a physics body (collider).
- Apply any additional configuration directly in the constructor if needed.

 1. **Add necessary components** in a separate method, e.g., `addComponents()`.
 2. **Instantiate the object** on the scene.

## Example

```js
import { extendWithComponents } from "../core/component-extension.js";
import { MovementComponent } from "../components/Movement.js";
import { PlayerControllerComponent } from "../components/PlayerController.js";


export class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, config) {
        super(scene, config.x, config.y, config.texture, config.frame);
        this.config = config;
        
        // Extend Game Object with custom components
        extendWithComponents(this);

        scene.add.existing(this); // Add to scene (visually)
        scene.physics.add.existing(this); // Add physics (collider)

        // Configure physics body size and offset (Optionally)
        if (config.width && config.height) {
            this.body.setSize(config.width, config.height);
        }
        if (config.offsetX || config.offsetY) {
            this.body.setOffset(config.offsetX || 0, config.offsetY || 0);
        }
        
        this.addComponents();
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
```

```js
import playerConfig from "../configs/player-config.json";
import { Player } from '../js/entities/Player.js';

export default class GameplayScene extends Phaser.Scene {

    constructor() {
        super({ key: 'GameplayScene' });
    }

    preload() {}

    create() {
        this.player = new Player(this, playerConfig);
    }

    update(time, delta) {}
}
```


## Custom Components
Phaser’s [User Components](https://docs.phaser.io/phaser-editor/scene-editor/user-components) provide a simple way to attach behavior to a GameObject, but each component usually stores a direct reference on the object (e.g., `gameObject.horizontalMove = this`) and must be updated manually in the scene’s `update()` method. Dependencies between components are not managed automatically, and multiple components require custom bookkeeping for initialization and updates.

Our **component system extension** improves on this by:

1. Attaching **multiple components** to a single GameObject in a unified `gameObject.components` array.

2. Automatically registering components and providing `addComponent()` and `getComponent()` methods.

3. Automatically calling `update()` on all enabled components each frame via the scene’s `update` event.

4. Handling **component lifecycle**, including cleanup when the GameObject is destroyed.

5. Allowing **controlled dependencies** between components (e.g., a controller component can require a `MovementComponent`).

In short, our system adds **automatic updates, lifecycle management, and dependency support**, making components reusable, composable, and safer to work with compared to Phaser’s basic User Components.

```js
export class BaseComponent {
    gameObject;

    enabled = true;

    constructor(gameObject) {
        this.gameObject = gameObject;

        // Register the component on the GameObject
        this.register();
    }

    register() {
        if (!this.gameObject.components) {
            /** @type {BaseComponent[]} */
            this.gameObject.components = [];
        }

        this.gameObject.components.push(this);

        return this;
    }

    getComponent(ComponentClass) {
        return this.gameObject.components?.find(c => c instanceof ComponentClass)
         || null;
    }

    destroy() {
        this.enabled = false;
    }
}
```

```js
import { BaseComponent } from './base-component.js';

export function extendWithComponents(gameObject) {
    gameObject.components = [];

    gameObject.addComponent = function(component) {
        this.components.push(component);
        return component;
    };
    
    gameObject.getComponent = function(ComponentClass) {
        return this.components.find(c => c instanceof ComponentClass) || null;
    };

    gameObject.updateComponents = function(time, delta) {
        this.components.forEach(c => {
            if (c.enabled) c.update(time, delta);
        });
    };

    if (gameObject.scene) {
        gameObject.scene.events.on('update', 
        gameObject.updateComponents, gameObject);

        gameObject.once('destroy', () => {
            gameObject.scene.events.off('update', 
            gameObject.updateComponents, gameObject);
            
            gameObject.components.forEach(c => c.destroy());
            gameObject.components = [];
        });
    }

    return gameObject;
}
```