The **SoundSceneFacade** acts as a single entry point (facade) for all sound-related operations within a Phaser scene.  
It hides the complexity of sound management — playback, volume control, and scene cleanup — behind a unified interface, making the codebase cleaner and easier to maintain.
## Core Responsibilities
- Centralizes sound and music management per scene.
- Listens to global `EventBus` events (`playSound`, `playMusic`, `stopMusic`, etc.).
- Updates volumes dynamically when receiving `musicVolumeChanged` or `sfxVolumeChanged`.
- Automatically stops sounds and unsubscribes from events when the scene is destroyed.
## Typical Usage

### Initialize the Facade in a Scene
```js
this.sound_facade = new SoundSceneFacade(this, audioConfig);
```

The facade automatically subscribes to all relevant `EventBus` events upon creation.

### Play Sounds or Music from Anywhere
Because it listens to `EventBus`, any system (e.g., presenter, gameplay logic, or other scenes) can trigger sound actions globally:

```js
import { EventBus } from "../core/event-bus.js";
EventBus.emit("playSound", "click");  
EventBus.emit("playMusic", "mainMenuMusic");  
EventBus.emit("stopMusic");
```

No direct reference to the scene or `SoundSceneFacade` instance is needed.

### Cleanup
When the scene is destroyed, the facade automatically:

- Unsubscribes from `EventBus` events,
- Stops all sounds,

You don’t need to call `destroy()` manually unless you dispose of it early.