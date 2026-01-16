export class BaseState {
    constructor(controller) {
        this.controller = controller;
    }

    enter() {}
    update(time, delta) {}
    exit() {}
}