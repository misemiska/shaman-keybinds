### Shock Macros
Casts your highest rank of the shock. **+Shift** casts rank 1, which costs much less mana.

- **Earth Shock:** use rank 1 to interrupt cheaply, or to still get an interrupt off when you're low on mana.
- **Frost Shock:** use rank 1 to slow a target for a fraction of the mana.
- **Flame Shock:** use rank 1 when you only need the dot, not the damage. For example in PvP to keep people in combat for longer.

All three also start your auto-attack.

**Earth Shock**
```
#showtooltip
/startattack
/use [mod:shift]Earth Shock(Rank 1);Earth Shock
```

**Frost Shock**
```
#showtooltip
/startattack
/use [mod:shift]Frost Shock(Rank 1);Frost Shock
```

**Flame Shock**
```
#showtooltip
/startattack
/use [mod:shift]Flame Shock(Rank 1);Flame Shock
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
### Heal / Purge Macro
One button that heals friends and purges enemies, depending on who you're targeting.

- **Friendly target:** casts Lesser Healing Wave on them
- **Enemy target:** casts Purge on them
- **No target:** heals or purges whoever your mouse is over

-# If you have an enemy targeted and mouse over a friend, it heals the friend.
```
#showtooltip
/use [help,nodead][@mouseover,help,nodead]Lesser Healing Wave;[harm,nodead][@mouseover,harm,nodead]Purge
```
-# If you don't like mouseover macros, here's the simplest version. It purges an enemy target and heals anyone else. With no target, it heals you.
```
#showtooltip
/use [harm]Purge;Lesser Healing Wave
```
