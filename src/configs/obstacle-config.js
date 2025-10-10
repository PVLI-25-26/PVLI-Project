/**
 * Configuration for obstacles in the gameplay scene.
 * @type {Array<Object>}
 */
const obstaclesConfig = [
    {
        x: 600,
        y: 400,
        texture: "barrel",
        scale: 0.25,
        hitbox: {
            width: 50,
            height: 50
        }
    },
    {
        x: 450,
        y: 350,
        texture: "barrel",
        scale: 0.25,
        hitbox: {
            width: 40,
            height: 40
        }
    }
];

export default obstaclesConfig;
