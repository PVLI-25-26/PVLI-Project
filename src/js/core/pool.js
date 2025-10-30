// Pool de objetos sacada del ejemplo PhaserV y modificada

/**
 * Generic simple pool, with a maximum size and always reuses game objects.
 * To be improved and enhanced if necessary
 * @class Pool
 */
export default class Pool {
	/**
	 * Creates a pool with a maximum size. When all objects are active, the last used active object is used
	 * Objects are created with the constructor function passed.
	 * @param {Scene} scene - scene in which the objects live
	 * @param {Function} constructor - function called which must return the objects that populate the pool
	 * @param {Number} poolSize - size of the pool
	 */
	constructor (scene, constructor, poolSize) {
		this._group = scene.add.group();
		this.poolSize = poolSize;
		this.scene = scene;
        this.constructor = constructor;
        for(let i = 0; i < this.poolSize; i++) this._group.add(this.constructor());
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
		this.logger.log('POOL', 1, `Pool size: ${this.poolSize}\n`);
		if(!entity){
            this.logger.log('POOL', 1, 'Entity not found, reusing entity ...');
			entity = this._group.getFirstNth(1, true);
			this._group.remove(entity);
			this._group.add(entity);
		}
		
		// Cuando ya hemos conseguido la entidad de alguna forma la reutilizamos
		if (entity) {
            this.logger.log('POOL', 1, 'Entity found');
			entity.setActive(true);
			entity.setVisible(true); 
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
		this._group.killAndHide(entity);
	}


	getPhaserGroup(){
		return this._group;
	}
}