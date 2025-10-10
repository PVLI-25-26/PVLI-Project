/**
 * Obstacle entity that acts as a static collider in the world.
 * Used to block movement or define map geometry.
 */
export default class Obstacle {
    /**
     * @param {Phaser.Scene} scene - The scene to which the obstacle belongs.
     * @param {{
     *   x: number,
     *   y: number,
     *   texture: string,
     *   scale?: number,
     *   hitbox?: {
     *     width?: number,
     *     height?: number,
     *     offsetX?: number,
     *     offsetY?: number
     *   }
     * }} config - Configuration object for obstacle creation.
     */
    constructor(scene, config) {
        const {
            x,
            y,
            texture,
            scale = 1,
            hitbox = {}
        } = config;

        /**
         * The static physics-enabled sprite representing the obstacle.
         * @type {Phaser.Physics.Arcade.Sprite}
         */
        this.sprite = scene.physics.add.staticSprite(x, y, texture);

        this.sprite.setScale(scale);

        const body = this.sprite.body;

        if (hitbox.width && hitbox.height) {
            body.setSize(hitbox.width, hitbox.height);
        }

        if (hitbox.offsetX || hitbox.offsetY) {
            body.setOffset(hitbox.offsetX || 0, hitbox.offsetY || 0);
        }

        body.updateFromGameObject();
    }
}
