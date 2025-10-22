---
dg-publish: true
---
**Set Arrow Path Modifier** – a mechanic that allows the player to alter the trajectory and behavior of projectiles after they are fired by selecting special type of bow.
## Description
The player [[Shop|can equip]] one active arrow path modifier (bow type) before entering the magical realm.
This modifier changes the flight pattern of all fired projectiles, overriding the default arched trajectory and adding unique behavior.  
Modifiers can alter the number of projectiles, their spread, bounce behavior, and travel distance. It is used to adjust the area of effect, control coverage, or introduce tactical variety in ranged combat.

Only one path modifier can be active before [[Enter and exit the dungeon|enter the dungeon]], encouraging players to adapt their loadout to different enemy types and environments.
## Available Modifiers
- [[#Hunter’s Bow – Triple Shot]]
- [[#Falcon Bow – Long Shot]]
- [[#Rebound Bow – Ricochet]]
- [[#Piercer Bow – Piercing Shot]]
- [[#Seeker Bow – Homing Shot]]
- [[#Graviton Bow – Magnet Shot]]
- [[#Specter Bow – Phantom Shot]]
### Hunter’s Bow – Triple Shot
Fires **three arrows** simultaneously in a **spread formation** (angled slightly outward).  
Each individual arrow deals **reduced damage**, but the total output can be high if all arrows hit the target.  
This bow excels in close to mid-range combat, ideal for dealing with groups of enemies.
![[Pasted image 20251022152142.png]]

### Falcon Bow – Long Shot
**Increases the initial velocity** of the arrow and reduces its trajectory curvature, allowing it to travel **much farther** in a **straighter line**.  
This modifier is best for **long-distance precision**, letting skilled players snipe enemies before they can close in.
![[Pasted image 20251022152227.png]]

### Rebound Bow – Ricochet
Arrows gain the ability to **bounce** off surfaces (walls, objects, possibly enemies) **multiple times** before losing momentum.  
Each bounce slightly reduces velocity and damage.  
Can be used to hit enemies hiding behind cover or around corners, rewarding players who master geometry and angles.
![[Pasted image 20251022152458.png]]

### Piercer Bow – Piercing Shot
Arrows **do not stop upon impact** and can pass through multiple enemies in a line.  
This makes it especially effective against **dense enemy formations** or narrow corridors.  
Each consecutive hit deals **reduced damage**.  
Implementation-wise, this can be achieved by temporarily disabling collision for a few frames after the first impact.
![[Pasted image 20251022152647.png]]

### Seeker Bow – Homing Shot
After an arrow **loses altitude** and would normally **hit the ground**, it **locks onto the nearest target’s last known position** and performs an additional **dash** toward it before stopping.
The trade-off is **reduced base damage** due to trajectory correction.  
![[Pasted image 20251022153003.png]]

### Graviton Bow – Magnet Shot
After landing, the arrow **generates a magnetic field**, slowly pulling in nearby **enemies, consumables, or dropped arrows**.  
This allows the player to **control enemy positioning** and simplify item retrieval.  
Perfect for crowd control or utility builds, offering both offensive and supportive benefits.
![[Pasted image 20251022153714.png]]

### Specter Bow – Phantom Shot
Arrows **phase through obstacles**, passing through **one wall or shield** before dissipating.  
This enables the player to **hit enemies hiding behind cover**, introducing a tactical advantage in complex environments.  
However, the **ammo count is reduced**, so player can't just spam all his arrows through the walls.
![[Pasted image 20251022153931.png]]
## Related Systems
- [[Combat]]