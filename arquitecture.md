# Arquitecture

# Table of contents
- [UML](#codebase-UML-diagram)
- [Internal documentation](#internal-documents-for-client-code)
    1. [Global services](#global-services)
       - [Component Based Arquitecture](#component-based-gameobject-arquitecture)
       - [Loading screen UI](#loading-screen-ui)
       - [Logger](#logger)
       - [MVP for interfaces](#mvp-for-interfaces)
       - [Sound Facade](#sound-facade)
    2. [Other](#pool)
        - [Pool](#pool)
        - [Sprite stacking](#sprite-stacking)
    3. [Dungeon editor](#dungeon-editor)

# Codebase UML diagram
The UML is designed in Figma, and then rendered as a pdf to have a file with infinite zoom.
[CodeUML](GDD/Internal%20Technical%20Document/PVLI%2025-26%20UML.pdf)

# Internal documents for client code
This section will contain all the documentation made outside of comments, that explains how to use certain services or code we developed.

## Global services
### Component-Based GameObject Arquitecture
Our game uses a **component-based architecture** for [GameObjects](https://docs.phaser.io/phaser/concepts/gameobjects) in Phaser. This allows flexible composition of behavior and state, separating logic into reusable components rather than monolithic classes. Each GameObject can have multiple components, such as movement, input control, AI, or custom behaviors.

[Components](https://docs.phaser.io/phaser-editor/scene-editor/user-components) follow **composition over inheritance**:

- GameObjects extend Phaser classes (e.g., [Phaser.GameObjects.Sprite](https://docs.phaser.io/api-documentation/class/gameobjects-sprite) or [Phaser.GameObjects.Shader](https://docs.phaser.io/api-documentation/class/gameobjects-shader)) and are enhanced with components.
 
- Components encapsulate specific behavior and state.

- Some components require the presence of other components on the GameObject. For example, any controller component requires a `MovementComponent`.

---

#### Creating a GameObject

1. **Create a new class**, extending a Phaser GameObject.
2. **Extend it with the component system** using `extendWithComponents(this)` for custom behavior.

3. **Add the GameObject to the scene**
- Use `scene.add.existing(this)` to add it visually.
- Use `scene.physics.add.existing(this)` to add a physics body (collider).
- Apply any additional configuration directly in the constructor if needed.

 1. **Add necessary components** in a separate method, e.g., `addComponents()`.
 2. **Instantiate the object** on the scene.

#### Example

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


#### Custom Components
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

### Loading screen UI
If a scene needs to load many assets, this service can be used to overlay a loading screen while loading the assets.

#### How to use
To use this service, import the `showLoaderUI` function from `src/js/UI/LoaderUI.js`. Once imported, simply call the function before loading your assets, and pass the scene as a parameter.

Example:
``` Javascript
preload() {
        showLoaderUI(this);
        // Load all assets
        // this.load.image(...);
        // ...
    }
```

This will:
1. Fade-in the loading screen.
2. Update the UI with the progress being made.
3. Fade-out and destroy all of the UI elements in the loading screen.

### Logger
The logger must be used when **sending messages to the console** for any use case.
The use of the logger is important to **maintain clean and organized console messages** while developing. Without it, thousands of messages could be logging to the console, making it impossible to debug or read important information.

The logger can be access as a global plugin in the Plugin Manager. To get a reference to the logger, use:
``` javascript
// <this> is a scene
this.plugins.get('logger');
```

#### How to setup
**Each developer must have their own logger configuration**, the file is ignored in the `.gitignore`. This file must be found in: `src/configs/logger-config.json`. This JSON has two properties: `modules` and `level`.
The `modules` property is an array of `Strings`, each `String` being the active modules of the logger.
The `level` property is a `Number` between `[0 - 3]` which refers to the active log level. Look at [[#Log levels]].

Example of `src/configs/logger-config.json`:
``` JSON
{
    "modules": ["NOTHING"],
    "level": 0
}
```

#### How to use
The logger has only one method:
``` javascript
log( moduleKey, logLevel, message )
```
`String`:`moduleKey` -- Specifies the module where the message belongs.
`LOG_LEVELS`:`logLevel` -- Specifies the level of the message being sent.
`String`:`message` -- The message being logged.

Only messages with the same `moduleKey` as one of the enabled modules will be logged.
Also, only messages with the higher or equal log level than the current [[#Log levels]] will be logged.

To specify the different possible log levels, you must import `LOG_LEVELS` from `src/js/core/logger.js`. The `LOG_LEVELS` object is used as an enum to avoid incorrectly typing the level. You may also use the values from 0 to 3.

#### Log levels
Log levels are used to filter log messages by importance. There are 5 levels of importance:
```
DEBUG (0) < INFO (1) < WARNING (2) < ERROR (3)
```

#### Example
``` Javascript
// let logger = [Get logger from plugin manager]
logger.log('HUB', LOG_LEVELS.INFO, 'Equipment bought succesfully.');
```
Output
```
13:13:54 [HUB] [INFO]: Equipment bought succesfully.
```


### MVP for Interfaces
The **MVP (Model–View–Presenter)** pattern is used to separate visual interface logic from game logic and data state.  
This makes UI code:
- modular and easy to extend,
- independent of Phaser scene specifics,
- testable and reusable.
  
#### General Structure

Each UI module (e.g., Main Menu, Settings, Pause Menu) consists of three classes:

| Layer         | Responsibility                                                                                                                              | Example             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| **Model**     | Stores and modifies data without knowing about the visual representation. Can emit global events through `EventBus`.                        | `MainMenuModel`     |
| **View**      | Handles rendering, user input, and visual updates using Phaser objects. Emits UI events (`pointer`, `slider-changed`, `button-clicked`).    | `MainMenuView`      |
| **Presenter** | Connects View and Model. Subscribes to UI events, updates data in the Model, and synchronizes the View. Does not depend on Phaser directly. | `MainMenuPresenter` |
#### Interaction Principles

1. **View → Presenter**  
User actions (clicks, drags, hovers) generate events that the Presenter listens to:

```js
this.view.musicSlider.on("slider-changed", (value) => {     this.model.setMusicVolume(value); });
```

2. **Presenter → Model**  
The Presenter updates data in the Model without touching visual components:

```js
this.model.setSFXVolume(value);
```

3. **Model → EventBus (and external systems)**  
The Model notifies other game systems (sound, save data, analytics) via `EventBus`:

```js
EventBus.emit('musicVolumeChanged', this.musicVolume);
```

4. **Presenter → View**
The Presenter initializes the View using data from the Model and can also request the View to update or redraw specific UI elements when the data changes.

```js
this.view.musicSlider.setValue(this.model.musicVolume);
```

#### Guidelines for New Screens
When adding a new UI screen or menu:

1. Create three classes: `XxxModel`, `XxxView`, `XxxPresenter`.
   
2. Initialize them in the scene:
```js
const model = new SettingsModel(); 
const view = new SettingsView(this); 
const presenter = new SettingsPresenter(view, model);
```

3. Better use `EventBus` for all external interactions (e.g, audio control).

4. Avoid placing gameplay logic in the View.

5. The Presenter is the **only** class that directly connects the View and Model.
   
6. Any type of custom UI element (controller) should be implemented as a separate class with its own encapsulated logic — similar to how the slider and button components are structured.


#### Recommended File Structure

```
ui/
  └── main-menu/     
	  ├── main-menu-model.js      
	  ├── main-menu-view.js      
	  ├── main-menu-presenter.js
```

### Sound Facade
The **SoundSceneFacade** acts as a single entry point (facade) for all sound-related operations within a Phaser scene.  
It hides the complexity of sound management — playback, volume control, and scene cleanup — behind a unified interface, making the codebase cleaner and easier to maintain.
#### Core Responsibilities
- Centralizes sound and music management per scene.
- Listens to global `EventBus` events (`playSound`, `playMusic`, `stopMusic`, etc.).
- Updates volumes dynamically when receiving `musicVolumeChanged` or `sfxVolumeChanged`.
- Automatically stops sounds and unsubscribes from events when the scene is destroyed.
#### Typical Usage

##### Initialize the Facade in a Scene
```js
this.sound_facade = new SoundSceneFacade(this, audioConfig);
```

The facade automatically subscribes to all relevant `EventBus` events upon creation.

##### Play Sounds or Music from Anywhere
Because it listens to `EventBus`, any system (e.g., presenter, gameplay logic, or other scenes) can trigger sound actions globally:

```js
import { EventBus } from "../core/event-bus.js";
EventBus.emit("playSound", "click");  
EventBus.emit("playMusic", "mainMenuMusic");  
EventBus.emit("stopMusic");
```

No direct reference to the scene or `SoundSceneFacade` instance is needed.

##### Cleanup
When the scene is destroyed, the facade automatically:

- Unsubscribes from `EventBus` events,
- Stops all sounds,

You don’t need to call `destroy()` manually unless you dispose of it early.

## Pool
>The **object pool pattern** is a software [creational design pattern](https://en.wikipedia.org/wiki/Creational_pattern "Creational pattern") that uses a set of initialized [objects](https://en.wikipedia.org/wiki/Object_\(computer_science\) "Object (computer science)") kept ready to use – a "[pool](https://en.wikipedia.org/wiki/Pool_\(computer_science\) "Pool (computer science)")" – rather than allocating and destroying them on demand. A client of the pool will request an object from the pool and perform operations on the returned object. When the client has finished, it returns the object to the pool rather than [destroying it](https://en.wikipedia.org/wiki/Object_destruction "Object destruction"); this can be done manually or automatically.
>
> -- <cite>Wikipedia</cite>

If you need to use a pool for game objects, you can create one by using the generic Pool class in `\src\js\core\pool.js`.

### Creating a Pool
The constructor of `Pool` expects the `scene` where the objects within the pool will live. The pool also requires a `size` and function `builder` which will be used create all the game objects inside the pool.
You may want your objects to have some custom logic before spawning or releasing them. You can do so by passing `onRelease` and `onSpawn` to the constructor. This functions will be called when the object is released or spawned, receiving the object as a parameter.

### Using Pool
Using pool is extremely simple, you just need to call `spawn()` when you need a new instance from the pool. If all objects are spawned, the pool will return the oldest object.

Once you don't need the object any more, you can call `release()` to return the object to the pool.

### Example
``` JavaScript
// Initialize object pool
	this.#arrowPool = new Pool(
		gameObject.scene, // scene
		5, // pool size
		()=>{return new Arrow(gameObject.scene);}, // builder
		(entity)=>{entity.scene.tweens.add({ // onRelease
			targets: entity,
			alpha: 0,
			duration: 200,
			onComplete: (tween)=>{
				tween.remove();
				entity.setVisible(false);
				entity.alpha = 1;
			},
		}); },
		// null - onSpawn
	);
// ...
this.#arrowPool.spawn();
```

## Sprite Stacking
Sprite Stackign is an object that, given an array of images already loaded in Phaser, renders the stacked images in the scene.
### Configuration Object

#### Parameters
 - x:  The x position.
 - y: The y position.
 - textures: An array of texture keys already loaded into Phaser. If billboard mode is enabled, it will only read the first texture.
 - verticalOffset:  The vertical offset between sprites. Ignored if BillBoard is true.
 - scale: scale of the sprite.

Example SpriteStacking:
``` json
{
	"BillBoard": false,
	"x": 500,
	"y": 500,
	"textures": ["base", "body","body","base"],
	"verticalOffset":2,
	"scale" : 4
}
```

### Example
#### Parameters
```javascript
this.spriteStacking = new SpriteStacking(scene, x, y, spriteStackConfig, physicsConfig, camera);
```
- Scene: The scene where you want to create the object.
- x: x coordinate to spawn in scene
- y: y coordinate to spawn in scene
- spriteStackConfig: The object configuration file.
- physicsConfig: MatterJS physics config to apply
- camera: Main camera of the scene.

# Dungeon editor
Editing rooms comfortably is key for designers, as it allows for fast iteration on ideas and balancing.  A room editor should be capable of making any possible room in the game and export it in a way that the game can load it. 
Making our own editor would take a lot of work and time, which we don't have. For that reason, we use [Tiled](https://www.mapeditor.org) as our map editor, with some work a rounds in special cases.

## How to create a room
Rooms are structured in special **layers for each type of distinct object** in a scene. Currently, there are 6 layers that the user can work with: *Obstacles*, *Items*, *Enemies*, *Enemy Routes*, *NPCs* and *Scattering*. 

>[!Failure]
>Each object must belong to their corresponding layer, otherwise, the **game will crash** trying to load the scene.

> [!TIP] Copy the Empty Map to save time!
To speed up room creation, an EmptyMap-config.json can be copied to make different rooms. It comes with the basic layers and the grid size already set up to get to work quickly.

> [!warning] Don't modify the Empty Map!
> Please make sure you don't modify the empty map. :)
### How to define world borders
To define a rooms **world borders**, go to the **World Borders** layer. Now you add any **rectangle** you want to define *colliders* the player will not be able to cross.
You can make any shape as long as the rectangles are always axis aligned. (Rotations in Tiled are very weird with rectangles so I didn't take rotations into account when parsing the JSON)
Example:
![img](GDD/Game%20Design%20Document/Images/Pasted%20image%2020251208133053.png)

### How to add obstacles to a room
#### Adding Sprite Stacks
To add a **sprite stack** to a room, go to the **Obstacles** layer. Now you can open the `Templates` folder and drag the `SpriteStackTemplate.tx` template to the map.

There you go, you have a **sprite stack** ready, you just need to specify the *identifier* of the sprite stack to make sure the game knows what obstacle you are trying to instance. Enter the *identifier* in the `Class` property of the object created. You can enter multiple *identifiers* separated by **spaces** to spawn any of the entities randomly.

*identifiers* of sprite stacks are defined in their `JSON` file at `src/configs/obstacles-config.json`.![img](GDD/Game%20Design%20Document/Images/Screenshot%20from%202025-11-24%2022-56-50.png)
>[!warning] Careful rotating rectangles!
>For some weird reason, the rotation of objects in Tiled doesn't work well. As you can see in the image above, a rectangle is intersecting almost completely with others. This is not actually true in the scene as rotating objects in Tiled makes them move in the x, y coordinates (but they don't actually move in the world). 
>This means that If you rotate an object in tiled, it's position will be shifted weirdly.
#### Adding Billboards
To add a **billboard** to a room, go to the **Obstacles** layer. Now you can open the `Templates` folder and drag the `BillboardTemplate.tx` template to the map.

Now you just need to specify the *identifier* of the **billboard** to make sure the game knows what obstacle you are trying to instance. Enter the *identifier* in the `Class` property of the object created. You can enter multiple *identifiers* separated by **spaces** to spawn any of the entities randomly.

*identifiers* of billboards are defined in their `JSON` file at `src/configs/obstacles-config.json`.
![img](GDD/Game%20Design%20Document/Images/Screenshot%20from%202025-11-24%2023-04-04.png)
### How to add items to a room
To add an **item** to a room, go to the **Items** layer. Now you can open the `Templates` folder and drag the `ItemTemplate.tx` template to the map.

Now you just need to specify the *identifier* of the **item** to make sure the game knows what item you are trying to instance. Enter the *identifier* in the `Class` property of the object created.
*identifiers* of item are defined in their `JSON` files at the `src/configs/Items`/ folder. You can enter multiple *identifiers* separated by **spaces** to spawn any of the entities randomly.
![img](GDD/Game%20Design%20Document/Images/Screenshot%20from%202025-11-24%2023-08-41.png)

### How to add enemies to a room
#### Adding the enemy
To add an **enemy** to a room, go to the **Enemies** layer. Now you can open the `Templates` folder and drag the `EnemyTemplate.tx` template to the map.

As you can see, its *custom properties* will already be populated with a `state` and a `PatrolRoute`. This properties will be explained in the following section.

Now you just need to specify the *identifier* of the **Enemy** to make sure the game knows what item enemy are trying to instance. Enter the *identifier* in the `Class` property of the object created. You can enter multiple *identifiers* separated by **spaces** to spawn any of the entities randomly.
*identifiers* of item are defined in their `JSON` file at `src/configs/Enemies/<enemy>-config.json`.
![img](GDD/Game%20Design%20Document/Images/Screenshot%20from%202025-11-24%2023-14-58.png)

#### Adding a patrol route
To create a **patrol route**, go to the **Enemy Routes** layer. Now you can add a *polygon* with the **polygon tool** in the map. Each point of the polygon represents the points of the enemy routes.
Now, for each enemy, you may select the route you want it to follow in the `PatrolRoute` property.
>[!warning] Patrol routes can only be polygons.

![img](GDD/Game%20Design%20Document/Images/Pasted%20image%2020251125093917.png)

### How to add NPCs
To add a **NPC** to a room, go to the **NPCs** layer. Now you can open the `Templates` folder and drag the `NPCTemplate.tx` template to the map.

Now you just need to specify the *identifier* of the **NPC** to make sure the game knows what item you are trying to instance. Enter the *identifier* in the `Class` property of the object created. You can enter multiple *identifiers* separated by **spaces** to spawn any of the entities randomly.
*identifiers* of item are defined in their `JSON` files at the `src/configs/NPCs/` folder.
![img](GDD/Game%20Design%20Document/Images/Pasted%20image%2020251130001709.png)

### How to add scattering areas
To add a **scattering area** to a room, go to the **Scattering** layer. Now you can open the `Templates` folder and drag the `ScatteringTemplate.tx` template to the map.
Now you just need to specify the *identifier* of the **obstacles instanced in the area** to make sure the game knows what obstacle you want the area to spawn. Enter the *identifier* in the `Class` property of the object created.

You can specify **multiple identifiers** separated by spaces, to spawn randomly different types of objects. For example: `Class: tree1 tree2 tree3` will spawn randomly the obstacles `tree1`, `tree2` and `tree3` in the area.

*identifiers* of obstacles are defined in their `JSON` file at `src/configs/obstacles-config.json`.

You can also specify **how many objects you want to spawn in the area** with the custom property `fill`. A value of 100 means that 100 objects associated with the identifier in `class` will be spawned inside the area of the rectangle.
![img](GDD/Game%20Design%20Document/Images/Screenshot%20from%202025-11-24%2023-18-44.png)
>[!TIP] Hide or lock the Scattering layer!
>Areas in the Scattering layer will often overlap other objects in the scene. To avoid them from moving unintentionally, lock them or hide them away in the Layers menu.
>I also recommend highlighting the current layer in the preferences.

## How to create a dungeon
A dungeon is composed of connected rooms. It can be thought of as a graph. Specifying the dungeon by hand in a `JSON` file would work fine, but it would be tiring, slow and prone to error. For that reason we made the engine read a Tiled map as a dungeon. 
Nonetheless, several rules must be followed to make sure the engine can read the dungeon properly.

### Expected path of the dungeon
The game expects a `dungeon.json` in the following path: `src/configs/Dungeon/dungeon.json`.
>[!failure] The game will not start if this file isn't found!

#### Instancing a room in the dungeon
Rooms can be reused multiple times in the same dungeon. This means that you can design one room but use it any number of times in the dungeon, and they will be "different" rooms.
To add a **room instance** to the dungeon, go to the **Dungeon** layer. Now you can open the `Templates` folder and drag the `RoomTemplate.tx` template to the map.

In the `class` property, you must specify the **file name of the room** you want to instance. The engine will look for this file in the following path: `public/assets/rooms/rooms/<name-of-room>`. So if you specify in the `class` property: `exit-config.json`, it will try to load:`public/assets/rooms/rooms/exit-config.json`.
![img](GDD/Game%20Design%20Document/Images/ScreenshotRoomEditor.png)
#### Connecting rooms
Rooms only make sense if they are connected to other rooms. To connect rooms to other rooms, add a new **Custom property** of type `Connection`. You can add as many connections as you want to one scene, but they all must be connected to another scene.
The `Connection` property will allow you to specify the following properties:
- **scene** *(Object)* - The scene you want to connect this scene to.
- **spawnX** *(int)* - The x coordinate where the player will spawn in the *other room* when using the connection.
- **spawnY** *(int)* - The y coordinate where the player will spawn in the *other room* when using the connection.
- **x** *(int)* - The x coordinate of the connection in the *current room*.
- **y** *(int)* - The y coordinate of the connection in the *current room*.
![img](GDD/Game%20Design%20Document/Images/Screenshot%20from%202025-11-24%2023-44-02.png)