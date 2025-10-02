---
dg-publish: True 
---
**Rooms paths** – A mechanic that allows the player move across rooms.
## Description

Each room is hand-crafted and has a fixed number of paths, each of which stores a reference to another room. 
When the player interacts with a path, the current scene is unloaded and the scene referenced by the path is loaded instead. The player also spawns on the path that indicates the previous path.

Paths references are defined previously.
## Related Systems
- [[Dungeon map system]]
