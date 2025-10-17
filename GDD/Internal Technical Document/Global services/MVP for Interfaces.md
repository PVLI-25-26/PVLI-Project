The **MVP (Model–View–Presenter)** pattern is used to separate visual interface logic from game logic and data state.  
This makes UI code:
- modular and easy to extend,
- independent of Phaser scene specifics,
- testable and reusable.
  
## General Structure

Each UI module (e.g., Main Menu, Settings, Pause Menu) consists of three classes:

| Layer         | Responsibility                                                                                                                              | Example             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| **Model**     | Stores and modifies data without knowing about the visual representation. Can emit global events through `EventBus`.                        | `MainMenuModel`     |
| **View**      | Handles rendering, user input, and visual updates using Phaser objects. Emits UI events (`pointer`, `slider-changed`, `button-clicked`).    | `MainMenuView`      |
| **Presenter** | Connects View and Model. Subscribes to UI events, updates data in the Model, and synchronizes the View. Does not depend on Phaser directly. | `MainMenuPresenter` |
## Interaction Principles

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

## Guidelines for New Screens
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


## Recommended File Structure

```
ui/
  └── main-menu/     
	  ├── main-menu-model.js      
	  ├── main-menu-view.js      
	  ├── main-menu-presenter.js
```