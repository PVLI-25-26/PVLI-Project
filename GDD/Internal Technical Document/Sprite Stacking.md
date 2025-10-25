
Sprite Stackign is an object that, given an array of images already loaded in Phaser, renders the stacked images in the scene.
## Configuration

### Parameters
 - BiillBoard: Sets billboard mode on. If enabled, the sprite will always be oriented vertically facing the camera..
 - x:  The x position.
 - y: The y position.
 - textures: An array of texture keys already loaded into Phaser. If billboard mode is enabled, it will only read the first texture.
 - verticalOffset:  The vertical offset between sprites. Ignored if BillBoard is true.
 - scale: scale of the sprite.
 
Example billboard:
``` json
{
	"BillBoard": true,
	"x": 500,
	"y": 500,
	"textures": ["base"],
	"verticalOffset":2,
	"scale" : 4
}
```
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

## Example
### Parameters
```javascript
this.spriteStacking = new SpriteStacking(scene,configFile,camera);
```
- Scene: The scene where you want to create the object.
- configFile: The object configuration file.
- camera: Main camera of the scene.