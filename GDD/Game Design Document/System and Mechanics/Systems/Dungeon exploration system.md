---
dg-publish: True 
---
**Dungeon map** – The system that defines how the structure of the dungeon works and how the player move across rooms.

## Description
The dungeon is composed by rooms. Each room has a number of paths that connect with other rooms (like Hades or Isaac). 
Rooms work like isolated scenes and are hand-creafted. Each room has its enemies and loot places. 
Paths are predefined, although a procedurally generated dungeon is on the table.

## Dynamics
Each room will have a specialized purpose. For example, one room cannot be both a fighting room and an NPC room. This way, we can separate and encapsulate how the player interacts with each room. This allows the player to choose a path based on their desired strategy.
The player should be encouraged to clear each room before enter another one. This can be achieved by either blocking the paths or rewarding the player.

## Included mechanics
- [[Room's paths]]
- [[Rooms entities]]
- [[Enter and exit the dungeon]]
