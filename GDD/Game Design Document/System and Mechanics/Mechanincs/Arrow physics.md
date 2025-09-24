**Arrow physics** - 

## Description
`<Full description of the logic of the mechanics>`
Attributes:
- Direction: a vector that represent the direction of the arrow.
- Velocity.
- Momentum.
When the arrow hits a wall or an entity, it rebounds (changes it's direction) and losses momentum.
The arrow moves in a arch way. The arch decreases slightly till hits the floor. The curvature of the arch is related with the force that uses the player to [[Drawing the bow]]. If the player draws the bow too much, the arch is less curve (and if is the maximum, the arch draws a line).
## Related Systems
- [[Combat System]]