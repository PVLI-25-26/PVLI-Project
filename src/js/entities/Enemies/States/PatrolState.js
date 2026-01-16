import { BaseState } from "./BaseState.js";

/**
 * PatrolState - enemy follows a predefined patrol route with waiting times.
 * The route loops indefinitely.
 */
export class PatrolState extends BaseState {
    /**
     * @param {BasicEnemyController} controller
     * @param {{points: {x:number, y:number, wait:number}[]}} patrolRoute
     */
    constructor(controller, patrolRoute) {
        super(controller);
        this.route = {};
        this.route.points = patrolRoute;
        
        this.currentPoint = 0;
        this.waiting = false;
        this.waitTimer = 0;
    }

    enter() {
        if (!this.route?.points?.length) return;
        this._setTarget(this.route.points[this.currentPoint]);
    }

    update(time, delta) {
        const movement = this.controller.movementComponent;
        const obj = this.controller.gameObject;

        // Handle waiting at current point
        if (this.waiting) {
            this.waitTimer -= delta;
            if (this.waitTimer <= 0) {
                this._setNextPoint();
            } else {
                movement.setDirection(0, 0);
            }
            return;
        }

        // Move toward current target
        const target = this.route.points[this.currentPoint];
        const destinationX = target.x - obj.x;
        const destinationY = target.y - obj.y;
        const distance = Math.sqrt(destinationX * destinationX + destinationY * destinationY);

        if (distance < 8) {
            this._startWaiting(target.wait || 0);
            return;
        }

        const dirX = destinationX / distance;
        const dirY = destinationY / distance;
        movement.setDirection(dirX, dirY);
    }

    exit() {}

    // Private methods
    
    _setTarget(point) {
        this.target = point;
        this.waiting = false;
        this.waitTimer = 0;
    }

    _setNextPoint() {
        this.currentPoint = (this.currentPoint + 1) % this.route.points.length;
        this._setTarget(this.route.points[this.currentPoint]);
    }

    _startWaiting(waitTime) {
        this.waiting = true;
        this.waitTimer = waitTime;
        this.controller.movementComponent.setDirection(0, 0);
    }
}
