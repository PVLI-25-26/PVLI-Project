// Pool de objetos sacada del ejemplo PhaserV y modificada

/**
 * Generic simple pool, with a maximum size and always reuses game objects.
 * Always leaves 1 inactive in case a nice tween to despawn is wanted.
 * @class Pool
 */
export default class Pool {
	/**
	 * @type {Phaser.Scene} The scene where the group is added
	 */
	#scene;

	/**
	 * @type {Phaser.GameObjects.Group} The group used internally as a pool
	 */
	#group;

	/**
	 * @type {Function} A function that the pool will use to create objects when necessary
	 */
	#builder;

	/**
	 * Recieves the entity as a parameter
	 * @type {Function} A function called when an entity is released back to the pool
	 */
	#onRelease;

	/**
	 * Recieves the entity as a parameter
	 * @type {Function} A function called when an entity is spawned from the pool
	 */
	#onSpawn;

	/**
	 * Creates a pool with a maximum size. When all objects are active, the last used active object is used
	 * Objects are created with the constructor function passed.
	 * @param {Scene} scene - scene in which the objects live
	 * @param {Function} builder - function called which must return the objects that populate the pool
	 * @param {Number} poolSize - size of the pool
	 * @param {Function} onRelease - function to call on an object when it is released. Recieves object as parameter.
	 * @param {Function} onSpawn - function to call on an object when it spawns. Recieves object as parameter.
	 */
	constructor (scene, poolSize, builder, onRelease = null, onSpawn = null) {
		this.#group = scene.add.group();
		this.#scene = scene;
        this.#builder = builder;
        for(let i = 0; i < poolSize; i++) this.#group.add(this.#builder());
		this.#onRelease = onRelease;
		this.#onSpawn = onSpawn;
        this.logger = scene.plugins.get('logger');
		this.logger.log('POOL', 1, `Pool created: ${this.#group}`);
	}
	
	/**
	 * Get an object from the pool
	 * @returns A previously inactive object or the last used object
	 */
	spawn () {
		let entity = this.#group.getFirstDead();
		this.logger.log('POOL', 1, `Used objects: ${this.#group.countActive(false)}/${this.#group.getLength()}\n`);
		if(this.#group.countActive(false) == 1){
			const element = this.#group.getFirstAlive()
			this.release(element);
			this.#group.remove(element);
			this.#group.add(element);
		}
		
		// Cuando ya hemos conseguido la entidad de alguna forma la reutilizamos
		if (entity) {
            this.logger.log('POOL', 1, 'Entity found');
			if(this.#onSpawn)this.#onSpawn(entity);
			entity.setActive(true);
			entity.body.checkCollision.none = false;
		}

		return entity;
	}
	
	/**
	 * Método para liberar una entidad
	 * @param {Object} entity - entidad de la pool que queremos marcar como libre
	 */
	release (entity) {
		entity.body.checkCollision.none = true;
		this.#group.kill(entity);
		if(this.#onRelease) this.#onRelease(entity);
	}


	getPhaserGroup(){
		return this.#group;
	}
}