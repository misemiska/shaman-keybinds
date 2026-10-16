### Healing Wave
One button that finds someone to heal. What sets it apart are the two checks that follow an enemy's target: **your target's target and your focus's target.** Keep an enemy targeted or focused, press the button, and it heals whoever that enemy is targeting, which in group content is usually the tank. You never have to change target.

Each macro on the right does one of these checks on its own. If nobody matches, the button does nothing. The last macro chains all of them, and it heals the first one that applies, checking them in this order.

In the macro, each check is one set of square brackets. The `@` part says who it looks at, `help` means they must be friendly and `nodead` means they must be alive. The first set that is true decides who gets healed, and the rest are skipped.

**[Open the macro builder with this macro loaded](macro-builder.html#smart-heal)** to change the order, add a key to hold, or use another spell.

- **Mouseover:** Heals the friendly player under your mouse, whether that is a unit frame, a nameplate or the character in the world. They must be alive. This is checked first, so hovering over someone always wins over everything else below.
- **Your target:** Heals your current target if they are friendly and alive. It is checked after mouseover, so it only decides when your mouse is not over a friend.
- **Your focus:** Heals your focus target if they are friendly and alive. A focus is a second target you set with `/focus`, so you can keep someone such as the tank on focus and always heal them, whatever you have targeted.
- **Your target's target:** ★ Works when your target is an enemy. The enemy's target is whoever it is attacking, and if that is a friendly player who is alive, this heals them. You do not have to change target. It only gets a turn when your mouse and target are not friendly and your focus is not a friendly player.
- **Your focus's target:** ★ The same idea for your focus. If your focus is an enemy, such as a boss you have focused, this heals whoever that enemy is targeting, as long as they are friendly. If your focus is already a friendly player, "Your focus" above has already healed them.
- **Yourself:** If none of the above apply, it heals you. This is the last fallback, so the full macro always has somebody to heal.

**Your target's target**
```
#showtooltip
/cast [@targettarget,help,nodead] Healing Wave
```
**Mouseover**
```
#showtooltip
/cast [@mouseover,help,nodead] Healing Wave
```
**Your focus**
```
#showtooltip
/cast [@focus,help,nodead] Healing Wave
```
**Your focus's target**
```
#showtooltip
/cast [@focustarget,help,nodead] Healing Wave
```

**All of them together**
```
#showtooltip
/cast [@mouseover,help,nodead][@target,help,nodead][@focus,help,nodead][@targettarget,help,nodead][@focustarget,help,nodead][@player] Healing Wave
```

They cast your highest rank of Healing Wave.
-# To heal with a lower rank, add it after the spell name, like Healing Wave(Rank 5).
-# Macro credit: taubut.
