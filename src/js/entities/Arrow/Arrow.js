export class Arrow extends Phaser.GameObjects.Sprite{
    constructor(scene){
        super(scene, 0, 0, 'arrow');

        // This should probably be done by the pool
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.scene.physics.add.collider(this.body, this.scene.obstaclesGroup, this.onCollision, ()=>{}, this);
        //                                            I don't know what this processCallback is ---^
        this.setActive(false);
        this.setVisible(false);

        // Make the collider smaller to look like the arrow is inside the object
        this.body.setSize(this.width-25, this.height-25);
    }

    shoot(trajectory, effect, oX, oY, tX, tY, power){
        this.x = oX;
        this.y = oY;

        this.trajectory = trajectory;
        this.effect = effect;

        // target direction
        this.target = {x: tX-oX, y: tY-oY};
        this.power = power;

        // This should be done by the pool
        this.setActive(true);
        this.setVisible(true);

        this.trajectory.shoot(this, this.scene.cameras.main.rotation);
    }

    onCollision(arrow, other){
        this.trajectory.onCollision();
        // Apply arrow effects to other
        //if(other.onArrowHit) other.onArrowHit(this.effect);
    }

    preUpdate(time, delta){
        this.trajectory.update(time, delta);
    }
}