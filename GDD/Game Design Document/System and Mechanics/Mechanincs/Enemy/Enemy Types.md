## Overview

Enemies differ in both movement and combat behavior. Each enemy type has a specific gameplay role, defining the challenge and threat level it presents to the player.
### Movement Logic
Enemy movement is based on a state-driven system. Every enemy transitions between states using unique rules and triggers, but the logic of the states itself can be repeated for different enemies.
### Combat Logic
Enemy combat behavior varies depending on role. This includes attack type, additional abilities, and effects when receiving damage.
### Role Purpose
Each enemy type introduces a distinct challenge. Roles are expressed through:  
• Level of pressure on the player  
• Expected player response (evasion, counterattack, positioning, resource management)  
• Contribution to encounter variety
#### Enforcer
Primary strike unit that advances head-on and applies constant pressure on the player. Designed to force close engagement and prevent disengagement.
#### Disruptor
Fragile interference unit that is easy to kill but continuously distracts and interrupts the player. Its purpose is to divide player attention and create openings for enforcers to deal more damage.
#### Support
Backline unit that strengthens and heals allies, increasing their time on the battlefield. Focuses on sustaining the frontline rather than dealing direct damage.

This section defines how enemy roles, movement logic, and combat patterns work together to shape overall encounter design.
## Enemies

**Enforcers**
- [[#Elemental]]
- [[#Golem]]
- [[#Berserker]]

**Disruptors**
- [[#Slime]]
- [[#Prowler]]
- [[#Marksman]]

**Support**
- [[#Dryad]]

### Elemental

| Name            | Elemental                                                                                |
| --------------- | ---------------------------------------------------------------------------------------- |
| Role            | [[#Enforcer]]                                                                            |
| Description     | Melee pursuer that forces constant movement.                                             |
| Dynamics        | Applies direct pressure, drives the player to reposition.                                |
| Movement States | `Idle/Patrol` → `Chase` → `Strafe` → `Chase`                                             |
| Combat Logic    | Close-range attack with small knockback; switches to strafe when the player draws a bow. |
| Visual Style    | ![[Minotauro.jpg]]                                                                       |
### Golem

| Name            | Golem                                                                                                                  |
| --------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Role            | [[#Enforcer]]                                                                                                          |
| Description     | Slow tank that reacts to damage taken by allies.                                                                       |
| Dynamics        | Creates a control anchor, prevents the player from simply wiping the group.                                            |
| Movement States | `Patrol/Idle` → `Chase` → `Defense` → `Chase or Patrol/Idle`                                                           |
| Combat Logic    | Attacks with strong knockback. Defense — temporary invulnerability.<br>If player is too far, returns to initial state. |
| Visual Style    | ![[golem-ciclope.jpg]]                                                                                                 |
### Slime

| Name            | Slime                                                               |
| --------------- | ------------------------------------------------------------------- |
| Role            | [[#Disruptor]]                                                      |
| Description     | Hit-and-run nuisance enemy with high mobility.                      |
| Dynamics        | Provokes player mistakes and forces target tracking.                |
| Movement States | `Idle/Patrol` → `Chase (Zigzag)` → `Retreat` → `Chase (Zigzag)`     |
| Combat Logic    | Fast weak strike with short recovery. Attacks disabled during flee. |
| Visual Style    | ![[b117f3342a11b01b989eecedf8a0b538.jpg]]                           |
### Dryad

| Name            |                                                                |
| --------------- | -------------------------------------------------------------- |
| Role            | [[#Support]]                                                   |
| Description     | Enhances the squad and heals allies.                           |
| Dynamics        | Forces the player to shift target priorities and adapt focus.  |
| Movement States | `Follow Ally` → `Retreat (if player is close)` → `Follow Ally` |
| Combat Logic    | Heals allies on cooldown, triggered by their HP loss.          |
| Visual Style    | ![[driade2.jpg]]                                               |

### Prowler

| Name            | Live Bomb                                                                                                                                                                        |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Role            | [[#Disruptor]]                                                                                                                                                                   |
| Description     | Stealth ambusher that approaches the player and detonates, dealing area damage.                                                                                                  |
| Dynamics        | Creates psychological tension through delayed and sudden attack.                                                                                                                 |
| Movement States | `Idle` → `Chase`                                                                                                                                                                 |
| Combat Logic    | Initially completely invisible. When player comes close, it becomes 50% visible. When player is very close, it attacks. Explodes on death, also deals damage to another enemies. |
| Visual Style    | #TODO Add visual style                                                                                                                                                           |
### Marksman

| Name            | Marksman                                                                      |
| --------------- | ----------------------------------------------------------------------------- |
| Role            | [[#Disruptor]]                                                                |
| Description     | Ranged attacker that maintains optimal distance.                              |
| Dynamics        | Forces the player to reposition or close the gap.                             |
| Movement States | `Idle/Patrol` → `Chase` → `Idle`                                              |
| Combat Logic    | Shoots only with clear line of sight. Stops when player is in shooting range. |
| Visual Style    | #TODO add visual style                                                        |
### Berserker

| Name            | Berserker                                                                           |
| --------------- | ----------------------------------------------------------------------------------- |
| Role            | [[#Enforcer]]                                                                       |
| Description     | Melee pursuer that grows stronger from taking damage.                               |
| Dynamics        | The player increases the threat by attacking it recklessly.                         |
| Movement States | `Idle/Patrol` → `Chase`                                                             |
| Combat Logic    | Basic melee attack. <br>Attack speed and movement speed scale with received damage. |
| Visual Style    | #TODO add visual style                                                              |
