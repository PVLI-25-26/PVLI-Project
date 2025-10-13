---
dg-publish: True 
---
**Inventory System** – a system that manages the player’s inventory throughout its entire lifecycle, from entering the dungeon to exiting it.
## Description
Players will be able to collect [[Use Item|items]] during the run through the [[Interaction|interaction system]]. Items collected by the player are stored inside his inventory.
The inventory is an infinite list of items collected by the player, so the player can take as many items as they want.
![[InventorySystemExample.png]]
All items inside the player's inventory are sold when the player [[Enter and exit the dungeon|exits the dungeon]]. However, if the player dies, all items inside the inventory are lost.
## Included mechanics
- [[Use Item]]
- [[Pick up items]]
- [[Sell item]]
