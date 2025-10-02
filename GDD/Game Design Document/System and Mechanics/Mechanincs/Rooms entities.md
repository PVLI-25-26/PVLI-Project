---
dg-publish: True 
---
**Rooms** – A mechanic that describes how entities are displaced in the rooms.
## Description
Each room is hand-crafted; therefore, its entities are defined in the design. 
Room entities are persistent. When a room is unloaded, the state of all its entities must be saved. For example, if the player kills all the enemies in a room and then exits, the enemies will still be dead when the player returns. The same applies to consumables and NPC dialogues.

¿El jugador tiene que matar a todos los enemigos para desbloquear los caminos? ·
#TODO
## Entities list
- NPC
- Small enemy
- Boss
- Consumable
## Related Systems
- [[Dungeon map system]]