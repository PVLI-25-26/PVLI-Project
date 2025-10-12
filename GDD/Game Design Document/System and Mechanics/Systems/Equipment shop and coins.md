---
dg-publish: True 
---
**Shop and coins** – A system that enclosures the economy. It explains how the player can earn and spend coins.

## Description
 Before a run, the player can buy the equipment he wishes to use with coins. The stronger the equipment, the more coins needed to buy it.
 The player can buy only 3 types of items for the next run (Look at their use in [[Combat System]]):
 - Bows (Arrows trajectories)
 - Arrows (Two types of arrows)
 - Skills

Coins are persistent between runs, meaning that they are not lost when the player dies or begins a new run. Coins are obtained by selling [[Item|items]] when [[Enter and exit the dungeon|exiting the dungeon]].

As the player obtains items and improves, he will also gain more gold, allowing him to obtain better items. ([[Vision Document#Game Loop|Game Loop]])
If the player runs out of gold, he will always have a basic loadout for free with the most basic items. This ensures that the player can always recover himself from big losses and represents the base point of the equipment progression.

Graphical example to understand the concept (Not actual design, not even close):
![[EquipmentShopExample.png]]

## Dynamics
The player is confronted with whether it is worth spending more for better or more custom items, or save gold for another future run.
When the player enters the dungeon, he risks loosing all of his equipment if he dies. Therefore, the player must be careful to buy items which allow him to survive more.
This also enhances the tension throughout the run, as dying would mean loosing the items bought at the beginning.

## Included mechanics
- [[Selling objects]]
