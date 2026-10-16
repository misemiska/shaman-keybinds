This macro destroys all your totems with one button, without triggering the GCD. It works while you're casting, and it works in Ghost Wolf without pulling you out of form the way Totemic Recall does.

It uses Totemic Recall when both of these apply:

- You're not in Ghost Wolf
- You're not casting

In every other case it destroys your totems directly.

```
/run for i=1,4 do local n="t"..i;_G[n]=CreateFrame("Button",n,UIParent,"SecureUnitButtonTemplate");_G[n]:SetAttribute("type","destroytotem");_G[n]:SetAttribute("totem-slot",i) end
/use [noform:1] Totemic Recall
/click t1
/click t2
/click t3
/click t4
```

Totemic Recall triggers the GCD. If you want to skip the GCD out of form too, delete the `/use [noform:1] Totemic Recall` line, and the macro will always destroy your totems directly.
