/**
 * Converts world coordinates to screen coordinates for a given camera
 * @param {number} worldX - World coordinate X
 * @param {number} worldY - World coordinate Y
 * @param {Phaser.Cameras.Scene2D.Camera} camera - Phaser camera
 * @returns {Object} Object with screen coordinates {x, y}
 */
export function worldToScreen(worldX, worldY, camera) {
    const { TransformXY } = Phaser.Math;
    
    const {
        scrollX,
        scrollY,
        rotation,
        zoom,
        originX,
        originY,
        width,
        height
    } = camera;
    
    // Calculate the camera anchor point in world coordinates
    const ox = originX * width;
    const oy = originY * height;
    
    // Apply transformation with rotation and scale
    let { x, y } = TransformXY(
        worldX,
        worldY,
        ox + scrollX,
        oy + scrollY,
        -rotation,
        1 / zoom,
        1 / zoom
    );
    
    // Add the anchor offset
    x += ox;
    y += oy;
    
    // Round values for integer screen coordinates
    return {
        x: Math.round(x),
        y: Math.round(y)
    };
}


/**
 * Converts screen coordinates to world coordinates for a given camera
 * @param {number} screenX - Screen coordinate X
 * @param {number} screenY - Screen coordinate Y
 * @param {Phaser.Cameras.Scene2D.Camera} camera - Phaser camera
 * @returns {Object} Object with world coordinates {x, y}
 */
export function screenToWorld(screenX, screenY, camera) {
    const { TransformXY } = Phaser.Math;
    
    const {
        scrollX,
        scrollY,
        rotation,
        zoom,
        originX,
        originY,
        width,
        height
    } = camera;
    
    // Calculate the camera anchor point
    const ox = originX * width;
    const oy = originY * height;
    
    // Transform screen coordinates relative to the anchor point
    const relativeX = screenX - ox;
    const relativeY = screenY - oy;
    
    // Inverse transformation: rotation and scaling
    // TransformXY uses a direct angle for inverse transformation
    let { x, y } = TransformXY(
        relativeX,
        relativeY,
        ox + scrollX,
        oy + scrollY,
        rotation, // Use direct angle (not negative) for inverse transformation
        zoom,     // Use direct scale (not inverse)
        zoom
    );
    
    // Subtract camera scroll
    x -= scrollX;
    y -= scrollY;
    
    return {
        x: x,
        y: y
    };
}
