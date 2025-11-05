import { BaseComponent } from "../core/base-component.js";
import { EventBus } from "../core/event-bus.js";

/**
 * Component responsible for receiving and processing damage.
 * Supports multiple damage event types and temporary invulnerability.
 *
 * @class
 * @category Components
 * @extends BaseComponent
 */
export class DamageableComponent extends BaseComponent {
    /**
     * @param {Phaser.GameObjects.GameObject} gameObject - GameObject this component is attached to.
     * @param {number} maxHP - Maximum and initial health points.
     * @param {Array<string>} damageEvents - List of event names that can deal damage to this object.
     * @param {boolean} [useInvulnerability=true] - Whether to enable temporary invulnerability after taking damage.
     */
    constructor(gameObject, maxHP, damageEvents, useInvulnerability = true, sounds = null) {
        super(gameObject);

        this.maxHP = maxHP;
        this.currentHP = maxHP;
        this.damageEvents = damageEvents;
        this.useInvulnerability = useInvulnerability;
        this.sounds = sounds;

        this.isInvulnerable = false;
        this._blinkTween = null;

        // subscribe to damage events
        for (const event of damageEvents) {
            EventBus.on(event, (data) => this.handleDamageEvent(event, data));
        }
    }

    /**
     * Damage event handler.
     * Checks if the target is the current GameObject.
     */
    handleDamageEvent(event, data) {
        if (data.target !== this.gameObject) return;

        if (event === 'arrowHit') {
            this.takeDamage(1); // Placeholder damage value, arrow must store its damage
        }
    }

    /**
     * Main damage handling method.
     * @param {number} amount - Damage amount to apply.
     */
    takeDamage(amount) {
        if (this.isInvulnerable) return;

        this.currentHP = Math.max(0, this.currentHP - amount);

        if (this.currentHP <= 0) {
            this.onDeath();
            return;
        }

        if (this.sounds.damage) {
            EventBus.emit('playSound', this.sounds.damage);
        }

        if (this.useInvulnerability) {
            this.startInvulnerability();
        }
    }

    /**
     * Starts temporary invulnerability with visual feedback.
     */
    startInvulnerability() {
        this.isInvulnerable = true;

        const sprite = this.gameObject;

        // Visual blinking effect
        if (sprite.scene && sprite.scene.tweens) {
            this._blinkTween = sprite.scene.tweens.add({
                targets: sprite,
                alpha: 0.3,
                duration: 100,
                yoyo: true,
                repeat: -1,
            });
        }

        // Invulnerability duration timer
        sprite.scene.time.delayedCall(1000, () => {
            this.isInvulnerable = false;
            if (this._blinkTween) {
                this._blinkTween.stop();
                this._blinkTween = null;
            }
            sprite.setAlpha(1);
        });
    }

    /**
     * Entity death.
     */
    onDeath() {
        EventBus.emit('entityDied', this.gameObject);
        EventBus.emit('playSound', this.sounds.death);
        this.gameObject.setActive(false);
        this.gameObject.setVisible(false);
        this.gameObject.body.enable = false;
    }

    /**
     * Called every frame to update the component.
     * @param {number} time - The current time in milliseconds.
     * @param {number} delta - Time elapsed since the last frame in milliseconds.
     * @returns {void}
     */
    update(time, delta) {
        // No per-frame updates needed currently
    }
}
