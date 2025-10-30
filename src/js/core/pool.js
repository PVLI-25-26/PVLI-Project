// Pool de objetos sacada del ejemplo PhaserV y modificada

/**
 * Generic simple pool, with a maximum size and always reuses game objects.
 * Always leaves 1 inactive in case a nice tween to despawn is wanted.
 * @class Pool
 */
export default class Pool {
	/**
	 * Creates a pool with a maximum size. When all objects are active, the last used active object is used
	 * Objects are created with the constructor function passed.
	 * @param {Scene} scene - scene in which the objects live
	 * @param {Function} constructor - function called which must return the objects that populate the pool
	 * @param {Number} poolSize - size of the pool
	 * @param {Function} onRelease - function to call on an object when it is released. Recieves object as parameter.
	 * @param {Function} onSpawn - function to call on an object when it spawns. Recieves object as parameter.
	 */
	constructor (scene, constructor, poolSize, onRelease = null, onSpawn = null) {
		this._group = scene.add.group();
		this.scene = scene;
        this.constructor = constructor;
        for(let i = 0; i < poolSize; i++) this._group.add(this.constructor());
		this.onRelease = onRelease;
		this.onSpawn = onSpawn;
        this.logger = scene.plugins.get('logger');
		this.logger.log('POOL', 1, `Pool created: ${this._group}`);
	}
	
	/**
	 * Adds an array of entities to the pool
	 * @param {Array} entities - entities added to the pool
	 */
	addMultipleEntity(entities) {
		this._group.addMultiple(entities);
		entities.forEach(c => {
			this._group.killAndHide(c);
			c.body.checkCollision.none = true;
		});
	}
	
	/**
	 * Get an object from the pool
	 * @returns A previously inactive object or the last used object
	 */
	spawn () {
		let entity = this._group.getFirstDead();
		this.logger.log('POOL', 1, `Used objects: ${this._group.countActive(false)}/${this._group.getLength()}\n`);
		if(this._group.countActive(false) == 1){
			const element = this._group.getFirstAlive()
			this.release(element);
			this._group.remove(element);
			this._group.add(element);
		}
		
		// Cuando ya hemos conseguido la entidad de alguna forma la reutilizamos
		if (entity) {
            this.logger.log('POOL', 1, 'Entity found');
			this.onSpawn(entity);
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
		this._group.kill(entity);
		this.onRelease(entity);
	}


	getPhaserGroup(){
		return this._group;
	}
}