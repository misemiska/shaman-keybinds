Imbues now last 1 hour and stack with sharpening stones and weightstones, so here's a lazy macro for both.

- **Left-click** imbues your main hand weapon:
  - No modifier: Rockbiter Weapon
  - Shift: Flametongue Weapon
  - Alt: Frostbrand Weapon
  - Ctrl: Windfury Weapon
- **Right-click** applies your chosen stone to your main hand weapon.

Change `Coarse Sharpening Stone` to the stone you use. For a mace, use a weightstone instead.

```
/use [@none,btn:1,nomod]Rockbiter Weapon;[@none,mod:shift]Flametongue Weapon;[@none,mod:alt]Frostbrand Weapon;[@none,mod:ctrl]Windfury Weapon;[btn:2]Coarse Sharpening Stone
/use 16
/click StaticPopup1Button1
```

If we ever get dual wield, this can be expanded to handle off-hand imbues too. Poke me if that happens.
