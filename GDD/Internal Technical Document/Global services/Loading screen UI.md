If a scene needs to load many assets, this service can be used to overlay a loading screen while loading the assets.

## How to use
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