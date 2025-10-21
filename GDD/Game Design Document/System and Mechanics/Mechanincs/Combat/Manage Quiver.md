---
dg-publish: true
---
**Manage Quiver** – a mechanic that allows the player to manage and switch between different types of projectiles.
## Description
The player can equip two different types of arrows in the quiver, each with unique properties that affect combat strategy. Arrows are consumable items: when the player shoots, the corresponding arrow is removed from the inventory. 

The player can quickly change arrows in the middle of combat to use both arrows properties using [[Controls|change arrow key]].

Arrows are a limited resource as the player can only have a certain number of arrows in their inventory. Arrows must be picked up after being used, making shooting arrows more than just shooting everywhere. 

Stronger arrows are more limited in quantity, requiring the player to carefully manage resources and choose the right type of projectile for each encounter. This mechanic encourages strategic thinking and careful planning during exploration and combat.

![[ArrowExamples.png]]
## Arrow Effects

### Fire Arrow
The *fire arrow* deals `param` every `param` seconds during  `param` time when impacting an enemy. When combined with other arrow effects, the *fire effect* will, in some way, enhance the damage dealt to the enemy.
The fire arrow is has a `param` seconds of cool down per shot.

### Slime Arrow
The *slime arrow* explodes in an area of slime (with `param` diameter) when impacting an enemy , which slows down enemies `param`% for `param` seconds. When combined with other effects, the *slime effect* will add to the duration time of other effects.
The slime arrow is has a `param` seconds of cool down per shot.

### Gas Arrow
The *gas arrow* explodes into a cloud of a poison when impacting an enemy. All enemies inside the cloud receive `param` damage every `param` seconds, the longer the enemies are under the effect of the poison, the more damage it deals.
The gas arrow has a `param` seconds of cool down per shot.

### Grass Arrow
The *grass arrow* immobilizes the enemy hit by the arrow (grass grows and traps the enemy). The enemies will not be able to move for `param` seconds. 
The grass arrow is has a `param` seconds of cool down per shot.

### Combined effects
Effect combination can happen in any order, meaning that effects do not need to be applied in an specific order for the special effect to happen.

#### Fire + Slime
When combining *fire* with *slime*, the fire effect is prolonged for `param` seconds and damage is increased by `param`%.

#### Fire + Gas
When combining *fire* with *gas*, an explosion occurs, dealing `param` damage to all enemies in the area and setting them on fire.

#### Fire + Grass
When combining *fire* with *grass*, the fire expands through the grass, setting all enemies on fire.

#### Slime + Grass
When combining *slime* with *grass*, the grass effect duration is enhanced by `param`% and the grass effect will affect all enemies in the area of effect of the slime.

#### Slime + Gas
When combining *slime* with *gas*, the gas effect will stick to the enemy even if it is outside the cloud for `param` seconds.

#### Gas + Grass
Does nothing special, their basic effects combined is already powerful enough. 

## Related Systems
- [[Combat]]
