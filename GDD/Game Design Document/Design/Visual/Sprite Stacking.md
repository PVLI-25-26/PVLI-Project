---
dg-publish: true
---
**Sprite Stacking**  – is a rendering technique that simulates a three-dimensional look using two-dimensional sprites. It creates the illusion of depth by layering multiple 2D images (sprites) on top of each other with a small offset along the Z or Y axis.
## How it works
Each sprite layer represents a “slice” of an object (for example, a part of a tower, tree, or rock). During rendering, all these slices are positioned at equal intervals on top of each other. As the viewing angle or lighting changes, the stacked layers create the impression that the object has real depth.
![[SpriteStackingExample.gif]]
## Implementation in Our Project
In our case, the technique is implemented using custom shaders integrated into the Phaser rendering pipeline.  
Phaser allows us to attach custom shaders to specific game entities, providing flexibility in controlling the visual style and effects.