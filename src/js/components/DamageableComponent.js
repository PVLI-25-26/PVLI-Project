import { BaseComponent } from "../core/base-component.js";
import { MovementComponent } from "../components/Movement.js";
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

        if (event === 'entityHit') {
            const knockbackParameters = {
                direction: { x: data.target.x - data.attacker.x, y: data.target.y - data.attacker.y },
                force: data.force,
                duration: data.duration
            };
            this.takeDamage(data.damage, knockbackParameters);
        }

        if(event === 'pushEnemy') {
            const knockbackParameters = {
                direction: { x: data.target.x - data.attacker.x, y: data.target.y - data.attacker.y },
                force: 20,
                duration: 200
            };
            this.takeDamage(0, knockbackParameters);
        }

        if(event == 'invisibilityActivated'){
            this.startInvulnerability(data.duration);
        }
    }

    /**
     * Main damage handling method.
     * @param {number} amount - Damage amount to apply.
     */
    takeDamage(amount, knockbackParameters = null) {
        if (this.isInvulnerable) return;

        this.currentHP = Math.max(0, this.currentHP - amount);
        
        EventBus.emit('entityDamaged', { entity: this.gameObject, amount: amount, currentHP: this.currentHP });

        this.flashRed(300);

        const movementComponent = this.getComponent(MovementComponent);
            if (movementComponent && !this.isInvulnerable) {
                movementComponent.setDirection(0, 0);
                movementComponent.knockback(knockbackParameters.direction, knockbackParameters.force, knockbackParameters.duration);
            }

        if (this.currentHP <= 0) {
            this.onDeath();
            return;
        }

        if (this.sounds.damage) {
            EventBus.emit('playSound', this.sounds.damage);
        }

        if (this.useInvulnerability) {
            this.startInvulnerability(1000);
        }
    }

    /**
     * Heals the entity by the specified amount.
     * @param {number} amount - Amount to heal.
     */
    heal(amount) {
        const healingAmount = Math.min(amount, this.maxHP - this.currentHP);
        if (healingAmount <= 0) return;
        this.currentHP += healingAmount;
        EventBus.emit('entityHealed', { entity: this.gameObject, amount: healingAmount, currentHP: this.currentHP });
    }

    /**
     * Changes the sprite tint to red temporarily to indicate damage.
     * @param {number} duration - Duration of the effect in milliseconds.
     */
    flashRed(duration) {
        const sprite = this.gameObject;
        if (!sprite || !sprite.setTint || !sprite.clearTint) return;
        sprite.setTint(0xf26868);
        sprite.setBlendMode(Phaser.BlendModes.NORMAL);

        if (sprite.scene && sprite.scene.time) {
            sprite.scene.time.delayedCall(duration, () => {
                if (sprite.active) sprite.clearTint();
                sprite.setBlendMode(Phaser.BlendModes.NORMAL);
            });
        }
    }

    /**
     * Starts temporary invulnerability with visual feedback.
     */
    startInvulnerability(duration) {
        this.isInvulnerable = true;

        const sprite = this.gameObject;

        // Visual blinking effect
        if (sprite.scene && sprite.scene.tweens) {
            this._blinkTween = sprite.scene.tweens.add({
                targets: sprite,
                alpha: 0.3,
                duration: duration/10,
                yoyo: true,
                repeat: -1,
            });
        }

        // Invulnerability duration timer
        sprite.scene.time.delayedCall(duration, () => {
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
        this.gameObject.emit('entityDied'); // Cheaper and easier to know from within the object if they have died
        EventBus.emit('playSound', this.sounds.death);
        this.gameObject.setActive(false);
        this.gameObject.setVisible(false);
        this.gameObject.setStatic(true);
        this.gameObject.setCollidesWith(0);
        this.destroy();
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
