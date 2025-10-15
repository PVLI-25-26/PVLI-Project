import Phaser from "phaser";

/**
 * Global event bus used for communication between different parts of the game.
 * 
 * Provides a centralized way to emit and listen to events across scenes, UI components,
 * and subsystems (e.g. sound, UI interactions, game logic).
 *
 * @constant
 * @type {Phaser.Events.EventEmitter}
 *
 * @example
 * // Emit an event:
 * EventBus.emit("playSound", "hover");
 *
 * // Listen for an event:
 * EventBus.on("playSound", (key) => {
 *     console.log(`Sound requested: ${key}`);
 * });
 */
export const EventBus = new Phaser.Events.EventEmitter();
