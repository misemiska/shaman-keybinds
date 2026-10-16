One button for Ghost Wolf and your mount. The macro picks whichever one makes sense.

It uses Ghost Wolf when any of these apply:

- You're indoors and have the Improved Ghost Wolf talent
- You're in combat
- You're swimming
- You're holding Shift

In every other case it uses your mount.

Change `Horn of the Dire Wolf` to your mount's name.

```
#showtooltip
/stopcasting
/use [known:16262,indoors][combat][swimming][mod:shift]Ghost Wolf;Horn of the Dire Wolf
```
