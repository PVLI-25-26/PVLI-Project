---
dg-publish: True 
---
**Shop** – a system that manages the game’s economy and how the player can earn and spend coins.
## Description
 Before a run, the player can buy the equipment he wishes to use with coins. The stronger the equipment, the more coins needed to buy it.
 The player can buy only 2 types of items for the next run:
 - Bows ([[Set Arrow path modifier#Available Modifiers|Arrows trajectories]])
 - Arrows (Two types of [[Manage Quiver#Arrow Effects|arrows with special effect]])
### Coins
Coins are persistent between runs, meaning that they are not lost when the player dies or begins a new run. Coins are obtained by selling [[Use Item|items]] when [[Enter and exit the dungeon|exiting the dungeon]].
## Prototype
Graphical example to understand the concept (Not actual design, not even close):
![[EquipmentShopExample.png]]
## Dynamics
As the player obtains items and improves, he will also gain more gold, allowing him to [[Progression|obtain better items]].
If the player runs out of gold, he will always have a basic loadout for free with the most basic items. This ensures that the player can always recover himself from big losses and represents the base point of the equipment progression.

The player is confronted with whether it is worth spending more for better or more custom items, or save gold for another future run.
When the player enters the dungeon, he risks loosing all of his equipment if he dies. Therefore, the player must be careful to buy items which allow him to survive more.
This also enhances the tension throughout the run, as dying would mean loosing the items bought at the beginning.

## Included mechanics
- [[Sell item]]
