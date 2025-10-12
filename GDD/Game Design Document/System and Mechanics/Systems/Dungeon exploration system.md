---
dg-publish: True 
---
**Dungeon map** – The system that defines how the structure of the dungeon works and how the player move across rooms.

## Description
The dungeon is composed by rooms. Each room has a number of [[Room's paths|paths]] that connect with other rooms (like Hades or Isaac). As the player traverses new rooms, the game becomes harder (look at [[Difficulty system]]).
Rooms work like isolated scenes and are hand-crafted. Each room has [[Rooms entities]] that the player can interact with.
Paths are predefined, although we would like to make a procedurally generated dungeon.
 ![[SmallEnemiesDraw.PNG]]

The dungeon could be represented as a graph, with each room being the nodes, and each path the edges:
![[DungeonExample.png]]


## Dynamics
Each room will have a specialized purpose. For example, one room cannot be both a fighting room and an NPC room. This way, we can separate and encapsulate how the player interacts with each room. This allows the player to choose a path based on their desired strategy.
The player should be encouraged to clear each room before enter another one. This can be achieved by either blocking the paths or rewarding the player with valuable items after clearing the room.

## Included mechanics
- [[Room's paths]]
- [[Rooms entities]]
- [[Enter and exit the dungeon]]
