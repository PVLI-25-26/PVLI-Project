>The **object pool pattern** is a software [creational design pattern](https://en.wikipedia.org/wiki/Creational_pattern "Creational pattern") that uses a set of initialized [objects](https://en.wikipedia.org/wiki/Object_\(computer_science\) "Object (computer science)") kept ready to use – a "[pool](https://en.wikipedia.org/wiki/Pool_\(computer_science\) "Pool (computer science)")" – rather than allocating and destroying them on demand. A client of the pool will request an object from the pool and perform operations on the returned object. When the client has finished, it returns the object to the pool rather than [destroying it](https://en.wikipedia.org/wiki/Object_destruction "Object destruction"); this can be done manually or automatically.
>
> -- <cite>Wikipedia</cite>

If you need to use a pool for game objects, you can create one by using the generic Pool class in `\src\js\core\pool.js`.

## Creating a Pool
The constructor of `Pool` expects the `scene` where the objects within the pool will live. The pool also requires a `size` and function `builder` which will be used create all the game objects inside the pool.
You may want your objects to have some custom logic before spawning or releasing them. You can do so by passing `onRelease` and `onSpawn` to the constructor. This functions will be called when the object is released or spawned, receiving the object as a parameter.

## Using Pool
Using pool is extremely simple, you just need to call `spawn()` when you need a new instance from the pool. If all objects are spawned, the pool will return the oldest object.

Once you don't need the object any more, you can call `release()` to return the object to the pool.

## Example
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
