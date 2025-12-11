---
dg-publish: true
---
**Boss Fight System** – a specialized system that manages encounters with powerful enemies, defining their behavior, attack patterns, and the conditions for victory or defeat. It builds on the core combat mechanics to create high-stakes, strategic challenges for the player.
## Description
This system implements a boss mechanic that fully utilizes the behavior of regular enemies, combining them into a two-phase battle that requires player adaptation and tactical shifts.
## Two-Phase Battle
The boss's behavior, attacks, and tactics change drastically when its health drops to 50%.
### Phase 1 (Defensive / Tactical)
#### Behavior
The boss acts like a **Golem** – moving heavily but purposefully, attempting to pin the player against walls or corners of the arena.
#### Primary Goal:
Positioning. The boss actively **shields weaker support enemies** (e.g., healers or buffers) positioned behind it, who are restoring its health.
#### Player Tactic
 The player must maneuver to flank the boss and eliminate the support units first, or the fight risks becoming indefinitely prolonged.

### Phase 2 (Aggressive / Desperate)
#### Behavior
when health drops below 50% the boss becomes mobile and aggressive, its movement akin to a [[Enemy Types#Slime|Slime]] – it quickly closes the distance with the player, maneuvering in a **spiral pattern** to make evasion difficult. Every successful attack the boss lands on the player restores a portion of the boss's health. 
#### Primary Goal
Survival and damage mitigation. The player's main objective shifts from aggression to careful avoidance of the boss's life-stealing attacks.
#### Player Tactic
The player must adopt a defensive playstyle:
1. Actively use accumulated **healing items** (potions, herbs) to counter the boss's health drain.
2. Utilize **mobility or crowd-control abilities** to break distance and reposition, disrupting the boss's relentless spiral approach.
3. Attack opportunistically during safe windows, prioritizing avoiding damage over dealing it.

## Related Systems

- [[Combat]]
- [[Enemy]]