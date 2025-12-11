Sometimes, as developers, we need to quickly skip through combats, dialogues. Get items spontaneously or anything that skips the steps the player has to go through, just to test implementations quickly.

Cheats are implemented as functions accesible through the browser developer CLI.
They emit events that other classes listen to produce the desired effect, trying to use a cheat where it can't be applied might crash the game or have weird behavior so be aware of it.
## Available cheats
- **ag(num)**: get gold
- **rg(num)**: remove gold
- **garrw(type)**: get arrow (types: "fire", "grass", "gas")
- **gabty(type)**: get ability (types: "dash", "forcefield")
- **dbgTog()**: toggle debug
- **tp(id || name)**: teleport to room (you can specify the room id or the room name)
- **rooms()**: show ids and names of all rooms
- **obst(type, x, y, r)**: spawn an obstacle
- **item(type, x , y)**: spawn an item
- **enmy(type, x, y)**: spawn an enemy