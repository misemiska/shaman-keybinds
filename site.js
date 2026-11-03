/* Shared behaviour for every page: the top bar, the footer, the home cards, and rendering the markdown guides.
   To add a page, add one entry to PAGES and create its HTML file. */
(function(){
  const SITE={
    name:"Miska's Shaman Emporium",
    discord:{label:"#Miska's-Macro-Emprioum",url:"https://discord.com/channels/260297137554849794/1553074139055783956"}
  };
  const PAGES=[
    {id:"home",href:"index.html",label:"Home"},
    {id:"macros",href:"macros.html",label:"Macros",title:"Macros",desc:"Shock, healing, totem, imbue and mount macros, ready to copy.",tags:["Macros"]},
    {id:"macro-builder",group:"macros",href:"macro-builder.html",label:"Macro Builder",title:"Macro Builder",desc:"Build your own targeting macro, and see in plain words how it reads.",tags:["Tool"]},
    {id:"common-macros",group:"macros",href:"common-macros.html",label:"Common Macros",title:"Useful Common Macros",desc:"Shock, heal and purge macros you can copy and paste.",tags:["Combat","Healing"],md:"content/common-macros.md",hue:"--c-shift"},
    {id:"smart-healing",group:"macros",href:"smart-healing.html",label:"Smart Healing",title:"Smart Healing",desc:"One Healing Wave button that finds the right target for you.",tags:["Healing"],md:"content/smart-healing.md"},
    {id:"totem-recall",group:"macros",href:"totem-recall.html",label:"Totem Recall",title:"Totem Destroyed / Totemic Recall",desc:"One button that destroys all your totems, even while casting or in Ghost Wolf.",tags:["Totems"],md:"content/totem-recall.md",hue:"--c-ctrl"},
    {id:"weapon-imbues",group:"macros",href:"weapon-imbues.html",label:"Weapon Imbues",title:"Weapon Imbues",desc:"One macro for weapon imbues and sharpening stones.",tags:["Buffs"],md:"content/weapon-imbues.md",hue:"--c-alt"},
    {id:"ghost-wolf-mount",group:"macros",href:"ghost-wolf-mount.html",label:"Ghost Wolf and Mount",title:"Ghost Wolf and Mount",desc:"One button that picks Ghost Wolf or your mount for you.",tags:["Movement"],md:"content/ghost-wolf-mount.md",hue:"--c-as"},
    {id:"leveling-build",href:"leveling-build.html",label:"Leveling Build",title:"Leveling Build",desc:"My talent order from level 10 to 60, for leveling and dungeons.",tags:["Build"],md:"content/leveling-build.md"},
    {id:"shamanpower",href:"shamanpower.html",label:"ShamanPower",title:"ShamanPower Addon",desc:"The all-in-one totem addon I contribute to, and what it does.",tags:["Addon"],md:"content/shamanpower.md"},
    {id:"weakauras",href:"weakauras.html",label:"WeakAuras",title:"My WeakAuras",desc:"The WeakAuras I built, and how they ended up in the addon.",tags:["WeakAuras"],md:"content/weakauras.md"},
    {id:"setup",href:"setup.html",label:"My Setup",title:"My Setup",desc:"My keyboard layout, with the macro behind every key.",tags:["Reference"],mock:"keys",hue:"--accent"}
  ];
  const MAXLEN=255;
  const current=document.body.dataset.nav||"";
  const calm=window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  /* Pages with a "group" belong to the page whose id matches it. Everything else is top level. */
  const top=PAGES.filter(p=>p.id!=="home"&&!p.group);
  const kids=g=>PAGES.filter(p=>p.group===g);
  const curPage=PAGES.find(p=>p.id===current);
  const curGroup=curPage?(curPage.group||(kids(curPage.id).length?curPage.id:null)):null;

  function el(t,cls,txt){const n=document.createElement(t);if(cls)n.className=cls;if(txt!=null)n.textContent=txt;return n}

  /* Top bar, with a thin reading-progress line along its bottom edge */
  function nav(){
    const host=document.getElementById("site-nav");if(!host)return;
    host.className="sitenav";
    const inner=el("div","in"),brand=el("a","brand",SITE.name);brand.href="index.html";
    const links=el("div","links");
    for(const p of top){
      const a=el("a","l",p.label);a.href=p.href;
      if(p.id===current||p.id===curGroup)a.setAttribute("aria-current","page");
      const sub=kids(p.id);
      if(!sub.length){links.append(a);continue}
      const dd=el("div","dd"),menu=el("div","menu");
      a.setAttribute("aria-haspopup","true");
      for(const k of sub){const m=el("a",null,k.label);m.href=k.href;if(k.id===current)m.setAttribute("aria-current","page");menu.append(m)}
      dd.append(a,menu);links.append(dd)}
    const seg=el("div","themeseg");seg.setAttribute("role","group");seg.setAttribute("aria-label","Colour theme");
    const ICON={
      light:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
      system:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>',
      dark:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>'};
    let saved="";try{saved=localStorage.getItem("theme")||""}catch(e){}
    if(saved==="light"||saved==="dark")document.documentElement.dataset.theme=saved;
    const choose=v=>{
      if(v==="system")delete document.documentElement.dataset.theme;else document.documentElement.dataset.theme=v;
      try{localStorage.setItem("theme",v==="system"?"":v)}catch(e){}
      seg.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",String(x.dataset.v===v)))};
    for(const v of ["light","system","dark"]){
      const bt=el("button");bt.type="button";bt.dataset.v=v;bt.innerHTML=ICON[v];bt.setAttribute("aria-label",v[0].toUpperCase()+v.slice(1));
      bt.setAttribute("aria-pressed",String(v===(saved==="light"||saved==="dark"?saved:"system")));
      bt.onclick=()=>choose(v);seg.append(bt)}
    /* hover labels; System says what the device setting currently is */
    const mq=window.matchMedia("(prefers-color-scheme:dark)");
    const titles=()=>seg.querySelectorAll("button").forEach(x=>{
      const v=x.dataset.v;
      x.title=v==="system"?"System: follows your device (currently "+(mq.matches?"dark":"light")+")":v==="dark"?"Dark":"Light"});
    titles();if(mq.addEventListener)mq.addEventListener("change",titles);
    const bar=el("div","progress");bar.setAttribute("aria-hidden","true");
    const ruler=el("div","ruler");ruler.setAttribute("aria-hidden","true");
    inner.append(brand,links,seg);host.append(inner,ruler,bar);
    const update=()=>{const h=document.documentElement,max=h.scrollHeight-h.clientHeight;host.style.setProperty("--p",max>0?Math.min(1,window.scrollY/max):0);host.classList.toggle("solid",window.scrollY>60)};
    window.addEventListener("scroll",update,{passive:true});window.addEventListener("resize",update);update()}

  function foot(){
    const host=document.getElementById("site-foot");if(!host)return;
    host.className="sitefoot";
    const inner=el("div","in"),grid=el("div","fgrid");
    const brand=el("div");brand.append(el("p","fbrand",SITE.name),el("p","ftag","Shaman macros, keybinds and addons, collected from my Discord threads."));
    const cols=[];
    for(const p of top){
      const sub=kids(p.id);if(!sub.length)continue;
      const col=el("div"),list=el("div","flist");col.append(el("p","fh",p.label),list);
      const all=el("a",null,"All "+p.label.toLowerCase());all.href=p.href;list.append(all);
      for(const k of sub){const x=el("a",null,k.label);x.href=k.href;list.append(x)}
      cols.push(col)}
    const more=el("div"),ml=el("div","flist");more.append(el("p","fh","More"),ml);
    for(const p of top){if(kids(p.id).length)continue;const x=el("a",null,p.label);x.href=p.href;ml.append(x)}
    cols.push(more);
    const com=el("div"),cl=el("div","flist");com.append(el("p","fh","Community"),cl);
    const d=el("a",null,SITE.discord.label);d.href=SITE.discord.url;d.target="_blank";d.rel="noopener";cl.append(d);
    grid.append(brand,...cols,com);
    const base=el("div","fbase");base.append(el("span",null,"© 2026 "+SITE.name),el("span",null,""));
    inner.append(grid,base);host.append(inner);
}

  /* Home cards: a framed preview on a coloured backdrop, taken from the guide's own first macro */
  function keysMock(){
    const wrap=el("div","mini");
    for(const row of [["§","1","2","3","4","5","6"],["Q","E","R"],["F","Z","X"]]){
      const r=el("div","mrow");for(const k of row)r.append(el("span","mk",k));wrap.append(r)}
    return wrap}
  function cards(){
    const host=document.getElementById("cards");if(!host)return;
    const g=host.dataset.group||"";
    const list=PAGES.filter(p=>p.desc&&(g?p.group===g:!p.group));
    const gc=document.getElementById("gcount");if(gc)gc.textContent=String(list.length).padStart(2,"0")+" guides";
    for(const p of list){
      const a=el("a","card");a.href=p.href;a.dataset.tags=(p.tags||[]).join(" ");a.dataset.text=(p.title+" "+p.desc+" "+(p.tags||[]).join(" ")).toLowerCase();
      const info=el("div","cbody");
      info.append(el("p","ctags",(p.tags||[]).join(" · ")),el("h2",null,p.title),el("p",null,p.desc),el("span","go","Open ").appendChild(el("span","arr","↗")).parentNode);
      a.append(info);
      if(!calm)a.addEventListener("pointermove",ev=>{
        const r=a.getBoundingClientRect();
        a.style.setProperty("--mx",(ev.clientX-r.left)+"px");a.style.setProperty("--my",(ev.clientY-r.top)+"px")});
      host.append(a)}}

  /* Sections fade up as they scroll into view. Skipped for reduced motion, and the effect removes itself once finished. */
  function reveal(){
    if(calm||!("IntersectionObserver" in window))return;
    const io=new IntersectionObserver(es=>es.forEach(e=>{
      if(!e.isIntersecting)return;
      const t=e.target;t.classList.add("is-visible");io.unobserve(t);
      setTimeout(()=>t.classList.remove("reveal","is-visible","d1","d2","d3"),1100)}),{threshold:.14});
    document.querySelectorAll(".sechead,.stat,.card,.pcell,.qa,.ctain>*,.sec,.pager,.docmain>h1,.docmain>.lead").forEach(t=>{
      if(t.dataset.rv)return;t.dataset.rv="1";
      const i=[...t.parentElement.children].indexOf(t);
      t.classList.add("reveal");if(i>0)t.classList.add("d"+Math.min(3,i));
      io.observe(t)})}

  /* A live macro box: the text can change, the counter and the Copy button follow it. Rich nodes colour the parts. */
  function liveMacro(){
    const box=el("div","macro"),bar=el("div","mbar");
    bar.append(el("span","t","Macro"));
    const pre=el("pre"),btn=el("button","copy","Copy");btn.type="button";
    let text="";btn.onclick=()=>copyText(text,btn,pre);
    const m=el("div","meter"),tr=el("span","track"),fl=el("span","fill"),cnt=el("span");
    tr.append(fl);m.append(tr,cnt);bar.append(btn,m);box.append(bar,pre);
    const set=(t,nodes)=>{
      text=t;
      if(t&&nodes)pre.replaceChildren(...nodes);else pre.textContent=t||"Switch on at least one rule to build a macro.";
      const n=t.length;cnt.textContent=n+" / "+MAXLEN;fl.style.width=Math.min(100,n/MAXLEN*100)+"%";
      m.classList.toggle("warn",n>=240);m.classList.toggle("over",n>MAXLEN);btn.disabled=!t};
    set("");return{box,set}}

  /* The macro builder: a list of rules, each one a spell plus who it is aimed at, who they need to be, a key and a situation.
     The macro text, a plain-words reading and a glossary are all built from the same list. */
  function macroBuilder(){
    const root=document.querySelector('[data-widget="macro-builder"]');if(!root)return;
    root.className="builder wide";
    const UNITS=[["target","Your target"],["mouseover","Mouseover"],["focus","Your focus"],["targettarget","Your target's target"],["focustarget","Your focus's target"],["player","Yourself"],["cursor","The spot under your mouse"],["none","Nobody (@none)"]];
    const WHO=[["fa","Friendly and alive"],["f","Friendly (alive or dead)"],["fd","Friendly and dead"],["ea","Enemy and alive"],["e","Enemy (alive or dead)"],["any","Anyone"]];
    const KEYS=[["","No key needed"],["nomod","No key held"],["shift","Shift"],["ctrl","Ctrl"],["alt","Alt"],["altshift","Alt + Shift"],["ctrlshift","Ctrl + Shift"]];
    const WHEN=[["","Any time"],["combat","In combat"],["nocombat","Out of combat"],["swimming","Swimming"],["indoors","Indoors"],["outdoors","Outdoors"]];
    const AT={target:"",mouseover:"@mouseover",focus:"@focus",targettarget:"@targettarget",focustarget:"@focustarget",player:"@player",cursor:"@cursor",none:"@none"};
    const WHOC={fa:["help","nodead"],f:["help"],fd:["help","dead"],ea:["harm","nodead"],e:["harm"],any:[]};
    /* the keys each choice needs held, for the order check: mod:shift also fits while Alt and Shift are held */
    const KEYM={shift:["shift"],ctrl:["ctrl"],alt:["alt"],altshift:["alt","shift"],ctrlshift:["ctrl","shift"]};
    const NOUN={target:"your target",mouseover:"the unit under your mouse",focus:"your focus",targettarget:"your target's target",focustarget:"your focus's target",player:"you",cursor:"the spot under your mouse",none:"nobody"};
    const ON={target:"on your target",mouseover:"on the unit under your mouse",focus:"on your focus",targettarget:"on your target's target",focustarget:"on your focus's target",player:"on you",cursor:"at the spot under your mouse",none:"with no target picked for it"};
    const EXISTS={mouseover:"there is a unit under your mouse",focus:"you have a focus set",targettarget:"your target has a target",focustarget:"your focus has a target"};
    const WHOP={fa:"is friendly and alive",f:"is friendly",fd:"is friendly and dead",ea:"is an enemy and alive",e:"is an enemy"};
    const KEYP={nomod:"you are holding no key",shift:"you are holding Shift",ctrl:"you are holding Ctrl",alt:"you are holding Alt",altshift:"you are holding Alt and Shift",ctrlshift:"you are holding Ctrl and Shift"};
    /* the mouse button: btn:1 is a left click, btn:2 a right click */
    const BTNS=[["","Any button"],["1","Left click"],["2","Right click"]],BTNP={"1":"you click with the left mouse button","2":"you click with the right mouse button"};
    const WHENP={combat:"you are in combat",nocombat:"you are out of combat",swimming:"you are swimming",indoors:"you are indoors",outdoors:"you are outdoors"};
    /* the glossary: what each piece of a macro means */
    const KEYN={shift:"Shift",ctrl:"Ctrl",alt:"Alt",altshift:"Alt and Shift",ctrlshift:"Ctrl and Shift"};
    const GLOSS={
      "#show":["cmd","Makes the button show the icon of the spell the macro would cast right now. It is 7 characters shorter than #showtooltip."],
      "#showtooltip":["cmd","Makes the button show the icon and tooltip of the spell the macro would cast right now. It must be the first line."],
      "/startattack":["cmd","Starts your auto-attack on your target."],
      "/use":["cmd","The command that casts a spell or uses an item. It does exactly the same as /cast, and it is one letter shorter."],
      "[ ]":["sym","Square brackets hold conditions. Everything inside one pair must be true for that choice to be used."],
      "][":["sym","Two bracket pairs side by side mean \u201cor\u201d. The spell is cast if either pair is true, checked from left to right."],
      ",":["sym","A comma inside brackets means \u201cand\u201d. Every condition in the brackets must be true."],
      ";":["sym","A semicolon separates different spells. The macro tries them from left to right and uses the first one that fits."],
      "@mouseover":["unit","Aim at the unit under your mouse. The other conditions in the same brackets are checked on that unit."],
      "@focus":["unit","Aim at your focus, the second target you set with /focus."],
      "@targettarget":["unit","Aim at whoever your target is targeting."],
      "@focustarget":["unit","Aim at whoever your focus is targeting."],
      "@player":["unit","Aim at yourself."],
      "@cursor":["unit","Aim at the spot under your mouse, for spells you place on the ground."],
      "/dismount":["cmd","Gets you off your mount."],
      "/cancelform":["cmd","Cancels your shapeshift form. For a Shaman that is Ghost Wolf."],
      "/stopmacro":["cmd","Stops the macro: the lines after it don't run."],
      "/stopcasting":["cmd","Stops the spell you are casting."],
      "/stopattack":["cmd","Stops your auto-attack."],
      "/cancelaura":["cmd","Removes the buff named after it from you."],
      "/click":["cmd","Clicks the button named after it."],
      "/run":["cmd","Runs a piece of Lua code."],
      "@none":["unit","Pick no target for the spell. Auto self-cast is skipped, and a spell that needs a target lets you click one."],
      "btn:1":["key","You must click the button with the left mouse button."],
      "btn:2":["key","You must click the button with the right mouse button. A key binding counts as a left click."],
      "help":["flt","The unit must be friendly."],
      "harm":["flt","The unit must be an enemy."],
      "nodead":["flt","The unit must be alive."],
      "dead":["flt","The unit must be dead."],
      "exists":["flt","Someone must be there: a unit under your mouse, a focus that is set, and so on. Without it the rule fits even when nobody is there, and the rules after it are never tried."],
      "nomod":["key","No modifier key (Shift, Ctrl or Alt) may be held."],
      "combat":["sit","You must be in combat."],
      "nocombat":["sit","You must be out of combat."],
      "swimming":["sit","You must be swimming."],
      "indoors":["sit","You must be indoors."],
      "outdoors":["sit","You must be outdoors."],
      "spell":["spell","The spell to cast. Adding (Rank 3), for example, picks a specific rank. Leave it off for your highest."]};
    GLOSS["mod"]=["key","You must be holding Shift, Ctrl or Alt. Any of them will do."];
    for(const k in KEYN)GLOSS["nomod:"+k]=["key","You must not be holding "+KEYN[k]+(KEYM[k].length>1?" together":"")+". The “no” in front turns the condition around."];
    for(const k in KEYN)GLOSS["mod:"+k]=["key","You must be holding "+KEYN[k]+"."+(KEYM[k].length>1?" Joining the key names means both at once.":" It also fits while you hold another key with it, so a rule that needs two keys has to come first.")];

    /* what the builder knows about Shaman spells in WoW: Forever and TBC, for the checks:
       friend = a friendly, living unit; res = a friendly, dead one; enemy = an enemy; ground = placed on the ground;
       self = always goes on you; none = takes no target at all (totems drop at your feet, Fire Nova erupts at your Fire totem).
       Ranks are not checked: each version has its own rank tables. */
    const SPELLS={},SPELLN=[];
    const know=(t,list)=>list.split("|").forEach(n=>{SPELLS[n.toLowerCase()]={n,t};SPELLN.push(n)});
    know("friend","Healing Wave|Lesser Healing Wave|Chain Heal|Riptide|Earth Shield|Cure Poison|Cure Disease|Water Breathing|Water Walking");
    know("res","Ancestral Spirit");
    know("enemy","Lightning Bolt|Chain Lightning|Lava Burst|Earth Shock|Flame Shock|Frost Shock|Purge|Stormstrike");
    know("ground","Totemic Projection");
    know("self","Lightning Shield|Water Shield|Ghost Wolf|Nature's Swiftness|Elemental Mastery|Shamanistic Rage|Rage of the Farseer|Astral Recall|"+
      "Rockbiter Weapon|Flametongue Weapon|Frostbrand Weapon|Windfury Weapon");
    know("none","Fire Nova|Totemic Recall|Totemic Call|Call of the Elements|Call of the Ancestors|Call of the Spirits|Bloodlust|Heroism|"+
      "Strength of Earth Totem|Stoneskin Totem|Tremor Totem|Earthbind Totem|Stoneclaw Totem|Earth Elemental Totem|Totem of Wrath|Searing Totem|Magma Totem|Fire Nova Totem|"+
      "Flametongue Totem|Frost Resistance Totem|Fire Elemental Totem|Mana Spring Totem|Healing Stream Totem|Mana Tide Totem|Poison Cleansing Totem|Disease Cleansing Totem|"+
      "Fire Resistance Totem|Windfury Totem|Grace of Air Totem|Wrath of Air Totem|Tranquil Air Totem|Grounding Totem|Nature Resistance Totem|Windwall Totem|Sentry Totem");

    const rule=(o)=>Object.assign({on:true,spell:"Healing Wave",rank:"",unit:"target",who:"fa",key:"",btn:"",when:"",known:""},o);
    /* known: takes a spell name or ID as typed, any spell, not only the one cast; a comma, ; or bracket would end the condition */
    const knownOf=r=>(typeof r.known==="string"?r.known:"").replace(/[\r\n;\[\],]/g,"").trim();
    const knownName=x=>/^\d+$/.test(x)?"the spell with ID "+x:x;
    const heal=(unit,who)=>rule({unit,who:who||"fa"});
    const PRESETS=[
      {id:"smart-heal",name:"Smart healing",opts:{tip:"show",attack:"off"},rules:()=>[heal("mouseover"),heal("target"),heal("focus"),heal("targettarget"),heal("focustarget"),heal("player","any")]},
      {id:"shock",name:"Shock, rank 1 on Shift",opts:{tip:"show",attack:"always"},rules:()=>[rule({spell:"Earth Shock",rank:"1",who:"any",key:"shift"}),rule({spell:"Earth Shock",who:"any"})]},
      {id:"heal-purge",name:"Heal friends, purge enemies",opts:{tip:"show",attack:"off"},rules:()=>[rule({spell:"Lesser Healing Wave",unit:"target"}),rule({spell:"Lesser Healing Wave",unit:"mouseover"}),rule({spell:"Purge",unit:"target",who:"ea"}),rule({spell:"Purge",unit:"mouseover",who:"ea"})]},
      {id:"resurrect",name:"Resurrect on Shift, heal otherwise",opts:{tip:"show",attack:"off"},rules:()=>[rule({spell:"Ancestral Spirit",unit:"mouseover",who:"fd",key:"shift"}),rule({spell:"Ancestral Spirit",unit:"target",who:"fd",key:"shift"}),heal("mouseover"),heal("target")]}];

    let rules=PRESETS[0].rules(),opts=Object.assign({},PRESETS[0].opts),uid=0;
    /* the macro's lines in order: MAIN is the /use line the rules build, the rest are kept as written ({text}) */
    const MAIN={main:true};let lines=[MAIN];
    const ids=new WeakMap();const idOf=r=>{if(!ids.has(r))ids.set(r,++uid);return ids.get(r)};

    /* ---- the macro being edited sits at the top */
    const out=liveMacro(),warn=el("p","bwarn"),bad=el("p","bwarn");warn.hidden=bad.hidden=true;
    const head=el("div","bhead");head.append(out.box,warn,bad);
    const dl=el("datalist");dl.id="mb-spells";for(const n of SPELLN)dl.append(el("option",null,n));

    /* ---- options and presets */
    /* the first line: nothing, #show (the icon) or #showtooltip (the icon and the tooltip); opts.tip is "", "show" or "showtooltip" */
    const TIPS=[["","Nothing"],["show","Icon (#show)"],["showtooltip","Icon and tooltip (#showtooltip)"]];
    const tipG=el("div","segs");tipG.setAttribute("role","group");tipG.setAttribute("aria-label","Show on the button");
    const tipBtns=TIPS.map(([v,t])=>{const b=el("button","bpre",t);b.type="button";b.onclick=()=>{opts.tip=v;syncTip();update()};tipG.append(b);return b});
    const syncTip=()=>tipBtns.forEach((b,i)=>b.setAttribute("aria-pressed",String(TIPS[i][0]===opts.tip)));
    /* what the two lines do, popping up while you hover over the buttons or reach them with the keyboard */
    const tipHelp=el("span","btip");tipHelp.id="mb-tip-help";tipHelp.setAttribute("role","tooltip");tipG.setAttribute("aria-describedby",tipHelp.id);
    tipHelp.append(el("code",null,"#show"),document.createTextNode(" makes the button show the icon of the spell the macro would cast right now. It changes as you hold a key or change targets, so with Shift held you see the Shift spell. "),
      el("code",null,"#showtooltip"),document.createTextNode(" does the same and also shows that spell's tooltip when you hover over the button. It costs 13 of your 255 characters, "),
      el("code",null,"#show"),document.createTextNode(" only 6. Either way, pick the red question-mark icon when you save the macro in the game, or the button keeps the icon you picked instead."));
    const mkSel=(id,list,val)=>{const s=el("select");s.id=id;for(const [v,l] of list){const o=el("option",null,l);o.value=v;if(v===val)o.selected=true;s.append(o)}return s};
    /* /startattack takes conditions too. You switch on each way of pressing the button that should start auto-attack
       (no key, Shift, Alt + Shift ...), and the builder writes the shortest condition that fits exactly those.
       opts.atk is a bit mask over ATKS: none on = no /startattack line, all on = no condition. */
    const ATKS=[["none","No key"],["shift","Shift"],["ctrl","Ctrl"],["alt","Alt"],["altshift","Alt + Shift"],["ctrlshift","Ctrl + Shift"]];
    const ATKALL=(1<<ATKS.length)-1,KEYK=Object.keys(KEYN);
    /* which of those presses a key name fits: mod:shift fits Shift, Alt + Shift and Ctrl + Shift */
    const fitsOf=x=>ATKS.reduce((m,[s],i)=>s!=="none"&&KEYM[x].every(k=>KEYM[s].includes(k))?m|1<<i:m,0);
    /* only forms players have confirmed in game: [mod], [nomod], mod: with one key or a joined pair (mod:altshift),
       nomod: with one key, and commas to need several at once. No slash lists like [nomod:ctrl/alt]: nobody reports testing them.
       So one pair of brackets is: nomod, or an optional mod / mod:x followed by any of nomod:shift, nomod:ctrl, nomod:alt. */
    const ONE=["shift","ctrl","alt"];
    const BR=[{t:["nomod"],c:1}];
    for(const p of [null,"mod"].concat(KEYK))for(let b=0;b<8;b++){
      const no=ONE.filter((_,i)=>b>>i&1);if(!p&&!no.length)continue;
      const c=(p===null?ATKALL:p==="mod"?ATKALL&~1:fitsOf(p))&~no.reduce((m,x)=>m|fitsOf(x),0);
      if(c)BR.push({t:(p?[p==="mod"?"mod":"mod:"+p]:[]).concat(no.map(x=>"nomod:"+x)),c})}
    BR.forEach(b=>b.len=b.t.join(",").length+2);
    /* the fewest letters that fit exactly the presses in want: brackets side by side mean "or" */
    const atkBrackets=want=>{
      const best={0:{len:0,bs:[]}};let grew=true;
      while(grew){grew=false;
        for(const k in best)for(const b of BR){
          if(b.c&~want)continue;const m=+k|b.c,len=best[k].len+b.len;
          if(!best[m]||len<best[m].len){best[m]={len,bs:best[k].bs.concat([b])};grew=true}}}
      return best[want].bs};
    const atkWhen=()=>{
      if(opts.atk===ATKALL)return"";
      const on=ATKS.filter((_,i)=>opts.atk>>i&1).map(([s,n])=>s==="none"?"no key":n);
      return" when you press it with "+(on.length===1?on[0]:on.slice(0,-1).join(", ")+" or "+on[on.length-1])};
    /* glossary lines for any mod:/nomod: key it writes that has none yet */
    const nameList=l=>{const n=l.map(x=>KEYN[x].replace(" and "," + "));return n.length===1?n[0]:n.slice(0,-1).join(", ")+" or "+n[n.length-1]};
    const glossKey=t=>{
      const m=!GLOSS[t]&&t.match(/^(no)?mod:(.+)$/);if(!m)return;
      GLOSS[t]=["key",m[1]?"You must not be holding "+nameList(m[2].split("/"))+". The “no” in front turns the condition around.":"You must be holding "+nameList(m[2].split("/"))+"."]};
    const atkBox=el("div","bfield bseg"),atkG=el("div","segs");atkG.setAttribute("role","group");atkG.setAttribute("aria-label","Start auto-attack when you press it with");
    const atkBtns=ATKS.map(([s,n],i)=>{const b=el("button","bpre",n);b.type="button";b.onclick=()=>{opts.atk^=1<<i;syncAtk();update()};atkG.append(b);return b});
    const atkAll=el("button","blink","All"),atkNone=el("button","blink","None");atkAll.type=atkNone.type="button";
    atkAll.onclick=()=>{opts.atk=ATKALL;syncAtk();update()};atkNone.onclick=()=>{opts.atk=0;syncAtk();update()};
    atkG.append(atkAll,atkNone);
    atkBox.append(el("span","bl","Start auto-attack when you press it with"),atkG);
    const syncAtk=()=>atkBtns.forEach((b,i)=>b.setAttribute("aria-pressed",String(!!(opts.atk>>i&1))));
    const optRow=el("div","btop");
    const tipBox=el("div","bfield bseg tipbox");tipBox.append(el("span","bl","Show on the button"),tipG,tipHelp);
    optRow.append(tipBox,atkBox);
    const pre=el("div","bpresets");pre.append(el("span","bl","Start from"));
    const presetBtns=[];
    /* paste a macro to edit it: a folded panel under the presets, with a report of what came in and what didn't */
    const imp=el("details","bimport"),impT=el("textarea"),impB=el("button","bpre","Import"),impR=el("div","bimrep");
    imp.append(el("summary",null,"Paste a macro to edit it here"));
    impT.id="mb-import";impT.rows=4;impT.spellcheck=false;impT.placeholder="#showtooltip\n/use [@mouseover,help,nodead][] Healing Wave";impT.setAttribute("aria-label","Macro to import");
    impB.type="button";impR.setAttribute("aria-live","polite");
    const impRow=el("div","bimrow");impRow.append(impB,el("span","bnote","This replaces your rules."));
    imp.append(impT,impRow,impR);
    const issueList=(head,items,never)=>{if(!items.length)return[];const out=[el("p","bimh",head)];
      for(const t of items){const p=el("p","bissue"+(never?" never":""));p.append(el("b",null,never?"Left out. ":"Changed. "),document.createTextNode(t));out.push(p)}return out};
    impB.onclick=()=>{
      const res=parseMacro(impT.value),n=res.rules.length,k=res.kept;impR.replaceChildren();
      if(!n&&!k){impR.append(el("p","bwarn",impT.value.trim()?"Nothing was imported: the builder found no macro lines in it. Your rules are unchanged.":"Paste a macro first."));return}
      rules=res.rules;lines=res.lines;opts=Object.assign({},opts,{tip:res.tip,atk:res.atk});syncTip();syncAtk();drawLines();
      presetBtns.forEach(b=>b.setAttribute("aria-pressed","false"));
      try{history.replaceState(null,"",location.pathname+location.search)}catch(e){}
      draw();update();
      impR.append(el("p",null,(n?"Imported "+(n===1?"1 rule":n+" rules"):"No line could become rules")+(k?(n?" and kept ":", so it kept ")+(k===1?"1 other line":k+" other lines")+" as written, under Other lines":"")+
        (res.skipped.length||res.notes.length?". Check the notes below.":".")),
        ...issueList("Not imported:",res.skipped,true),...issueList("Written differently:",res.notes,false))};
    const hint=el("p","bnote","Hover over a rule to see which part of the macro it makes, and which line of the reading it matches.");
    const list=el("div","blist"),addBtn=el("button","badd","+ Add a rule");addBtn.type="button";
    const clearBtn=el("button","bclear","Clear all rules");clearBtn.type="button";

    /* ---- explanation side */
    const how=el("div","bhow"),gloss=el("div","bgloss");

    const spellOf=r=>{let n=(r.spell||"").replace(/[\r\n;\[\]]/g,"").trim();if(!n)return"";const k=parseInt(r.rank,10);return k>0?n+"(Rank "+k+")":n};
    /* the conditions a rule checks on its unit; "Anyone" on a unit that may not be there needs exists,
       or [@mouseover] would fit with nobody under the mouse and the rules after it would never be tried */
    const condsOf=r=>r.unit==="cursor"||r.unit==="none"?[]:r.who==="any"?(EXISTS[r.unit]?["exists"]:[]):WHOC[r.who];
    const partsOf=r=>{
      const p=[];
      if(r.key==="nomod")p.push({t:"nomod",k:"key"});else if(r.key)p.push({t:"mod:"+r.key,k:"key"});
      if(r.btn)p.push({t:"btn:"+r.btn,k:"key"});
      if(r.when)p.push({t:r.when,k:"sit"});
      if(knownOf(r)){const t="known:"+knownOf(r);p.push({t,k:"sit"});
        if(!GLOSS[t])GLOSS[t]=["sit","You must know "+knownName(knownOf(r))+". Until you learn it the choice is skipped, so one macro works before and after."]}
      if(AT[r.unit])p.push({t:AT[r.unit],k:"unit"});
      for(const w of condsOf(r))p.push({t:w,k:"flt"});
      return p};

    /* ---- the checks: what keeps a rule from ever working, and what is worth knowing */
    const spellInfo=r=>{
      const raw=(r.spell||"").trim(),name=raw.replace(/\s*\(\s*rank\s*\d+\s*\)\s*$/i,"");
      return{name,s:SPELLS[name.toLowerCase()]}};
    /* everything the conditions on the unit say about it; help, harm and dead all mean someone is there */
    const facts=r=>{const c=condsOf(r);return c.some(x=>x==="help"||x==="harm"||x==="dead")?c.concat("exists"):c};
    /* does rule a fit every time rule b would? Then b can never be reached below it. */
    const covers=(a,b)=>{
      const keyOk=!a.key||a.key===b.key||(a.key!=="nomod"&&b.key&&b.key!=="nomod"&&KEYM[a.key].every(m=>KEYM[b.key].includes(m)));
      const whenOk=(!a.when||a.when===b.when)&&(!a.btn||a.btn===b.btn)&&(!knownOf(a)||knownOf(a).toLowerCase()===knownOf(b).toLowerCase());
      const ac=condsOf(a),unitOk=ac.length===0&&(a.unit==="target"||a.unit==="player"||a.unit==="cursor"||a.unit==="none")||(a.unit===b.unit&&ac.every(x=>facts(b).includes(x)));
      return keyOk&&whenOk&&unitOk};
    const always=r=>!r.key&&!r.btn&&!r.when&&!knownOf(r)&&condsOf(r).length===0&&(r.unit==="target"||r.unit==="player"||r.unit==="cursor"||r.unit==="none");
    const numOf=r=>rules.indexOf(r)+1;
    /* each issue: never = this rule can never work; note = it works, but not always as you'd expect */
    function check(valid){
      const res=new Map();
      valid.forEach((r,i)=>{
        const list=[],never=t=>list.push({never:true,t}),note=t=>list.push({never:false,t});
        const {name,s}=spellInfo(r),them=NOUN[r.unit],sp=s?s.n:name;
        const prev=valid.slice(0,i).find(a=>covers(a,r));
        /* the same spell again right below, at the same unit, with no conditions: this rule's conditions make no difference */
        if(partsOf(r).length)for(let j=i+1;j<valid.length&&spellOf(valid[j])===spellOf(r);j++)if(!partsOf(valid[j]).length){
          if(r.unit===valid[j].unit)note("Makes no difference: rule "+numOf(valid[j])+" right below casts the same spell and always fits, so the builder leaves this rule's conditions out of the macro.");break}
        if(prev)list.push({never:true,reach:true,t:"Never reached: rule "+numOf(prev)+" fits every time this one would, and the macro always stops at the first rule that fits. Move this rule above it."});
        if(r.unit==="player"&&(r.who==="ea"||r.who==="e"))never("You are never your own enemy, so this rule can never fit.");
        if(r.unit==="player"&&r.who==="fd")never("You can't cast while you are dead, so this rule can never work.");
        if(r.unit==="cursor"&&!(s&&s.t==="ground"))note("@cursor places spells that go on the ground, like Totemic Projection. "+
          (!s?"Check that this one is placed on the ground.":s.t==="self"||s.t==="none"?sp+" isn't aimed anywhere, so @cursor does nothing for it.":sp+" is cast on a unit, not on the ground, so @cursor can't aim it."));
        if(!s&&name)note("“"+name+"” isn't a Shaman spell this builder knows. That's fine for an item or another class's spell, but check the spelling: a misspelled name does nothing in the game.");
        if(s&&r.unit!=="cursor"&&r.unit!=="none"){
          const friend=r.who==="fa"||r.who==="f"||r.who==="fd",enemy=r.who==="ea"||r.who==="e";
          const stops=" The macro still stops here, so the rules after it aren't tried.";
          if(s.t==="enemy"){
            if(r.unit==="player"&&!enemy)never(sp+" can't be cast on yourself.");
            else if(friend)never(sp+" only hits enemies, but this rule only fits when "+them+" is friendly. The cast fails."+stops)}
          if(s.t==="friend"){
            if(enemy)never(sp+" only works on friendly players, but this rule only fits when "+them+" is an enemy. The cast fails."+stops);
            else if(r.who==="fd")never(sp+" doesn't work on the dead, but this rule only fits when "+them+" is dead. The cast fails."+stops);
            else if(r.who==="f"&&r.unit!=="player")note("This rule also fits when "+them+" is dead, and then the cast fails."+stops+" Pick “Friendly and alive” to skip the dead.")}
          if(s.t==="res"){
            if(r.who==="fa"||enemy)never(sp+" only works on dead friendly players, but this rule only fits when "+them+" is "+(enemy?"an enemy":"alive")+". The cast fails."+stops);
            else if(r.unit==="player")never("You can't resurrect yourself.");
            else if(r.who==="f"||r.who==="any")note("This rule also fits when "+them+" is alive, and then "+sp+" fails."+stops+" Pick “Friendly and dead”.")}
          if((s.t==="self"||s.t==="none")&&r.unit!=="player"&&(r.unit!=="target"||r.who!=="any"))
            note(sp+(s.t==="self"?" always goes on you.":" isn't aimed at anyone.")+" The conditions are still checked on "+them+", but the spell isn't cast on them.")}
        if(list.length)res.set(r,list)});
      return res}

    /* ---- importing a pasted macro: what the builder can say becomes rules, the rest is listed with the reason.
       A condition set it can't say is skipped whole, never half-imported, since half of it would mean something else. */
    const WHENS=["combat","nocombat","swimming","indoors","outdoors"];
    /* shift / altshift / shiftalt ... to the builder's name for it, or null (altctrl and lshift have no choice in the builder) */
    const keyName=x=>{const p=x.match(/alt|ctrl|shift/g);if(!p||p.join("")!==x)return null;const k=[...new Set(p)].sort().join("");return KEYM[k]?k:null};
    /* does one key condition (mod, nomod, mod:a/b, nomod:a/b) fit a press holding these keys */
    const keyFits=(t,held)=>{
      const m=t.match(/^(no)?mod(?::(.+))?$/);if(!m)return null;
      let fit;if(!m[2])fit=held.length>0;else{const ks=m[2].split("/").map(keyName);if(ks.includes(null))return null;fit=ks.some(k=>KEYM[k].every(x=>held.includes(x)))}
      return m[1]?!fit:fit};
    const normCond=t=>t.trim().replace(/^(no)?modifier\b/i,"$1mod");
    /* one pair of brackets to a rule's choices */
    function readConds(str,spell,where,res){
      const r={unit:"target",who:"any",key:"",when:""},f={},bad=[];
      for(const raw of str.split(",").map(normCond).filter(Boolean)){
        const t=raw.toLowerCase(),at=t.match(/^(?:@|target=)(.+)$/);
        if(at){if(UNITS.some(u=>u[0]===at[1]))r.unit=at[1];else bad.push(raw)}
        else if(["help","harm","dead","nodead","exists"].includes(t))f[t]=true;
        else if(t==="nomod"&&!r.key)r.key="nomod";
        else if(/^mod:/.test(t)&&!r.key&&keyName(t.slice(4)))r.key=keyName(t.slice(4));
        else if(WHENS.includes(t)&&!r.when)r.when=t;
        else if(/^(btn|button):[12]$/.test(t)&&!r.btn)r.btn=t.slice(-1);
        else if(/^known:/.test(t)&&!r.known&&raw.slice(raw.indexOf(":")+1).trim())r.known=raw.slice(raw.indexOf(":")+1).trim();
        else bad.push(raw)}
      if(f.help&&f.harm)bad.push("help and harm together");
      if(f.dead&&f.nodead)bad.push("dead and nodead together");
      if(f.help)r.who=f.dead?"fd":f.nodead?"fa":"f";
      else if(f.harm){if(f.dead)bad.push("harm,dead");else r.who=f.nodead?"ea":"e"}
      else if(f.dead||f.nodead)bad.push((f.dead?"dead":"nodead")+" without help or harm");
      if(bad.length){res.skipped.push("["+str+"] "+spell+": the builder has no choice for "+bad.map(b=>"“"+b+"”").join(", ")+".");return null}
      if((r.unit==="cursor"||r.unit==="none")&&(f.help||f.harm||f.dead||f.nodead||f.exists))res.notes.push("["+str+"] "+spell+": "+AT[r.unit]+" has no unit to check, so the builder drops the conditions on one.");
      if(r.who==="any"&&EXISTS[r.unit]&&!f.exists)res.notes.push("["+str+"] "+spell+": "+AT[r.unit]+" alone also fits when nobody is there, so the rules after it were never tried. The builder adds exists.");
      return r}
    /* a /use or /cast line's choices as rules, with what couldn't be said */
    function readUse(line){
      const t={rules:[],skipped:[],notes:[]},m=line.match(/^\/(use|cast)\s+(.*)$/i);
      for(const clause of m[2].split(";")){
        const c=clause.match(/^\s*((?:\[[^\]]*\]\s*)*)(.*)$/);let spell=c[2].trim();
        if(!spell){if(clause.trim())t.skipped.push("“"+clause.trim()+"”: there is no spell after the conditions.");continue}
        if(spell[0]==="!"){spell=spell.slice(1).trim();t.notes.push("!"+spell+": the builder doesn't write the “!”, which stops a second press from turning the spell off again.")}
        const rk=spell.match(/^(.*?)\s*\(\s*rank\s*(\d+)\s*\)$/i),name=rk?rk[1]:spell,rank=rk?rk[2]:"";
        const sets=[...c[1].matchAll(/\[([^\]]*)\]/g)].map(x=>x[1]);
        for(const s of sets.length?sets:[""]){const r=readConds(s,name,clause,t);if(r)t.rules.push(rule(Object.assign(r,{spell:name,rank})))}}
      return t}
    /* /startattack whose conditions are only keys becomes the auto-attack buttons; with anything else it is kept as written */
    const atkMask=cond=>{
      const brs=[...cond.matchAll(/\[([^\]]*)\]/g)].map(x=>x[1].split(",").map(normCond).filter(Boolean));
      if(!brs.length)return ATKALL;
      if(brs.some(b=>b.some(t=>keyFits(t.toLowerCase(),[])===null)))return null;
      let m=0;ATKS.forEach(([s],i)=>{const held=s==="none"?[]:KEYM[s];if(brs.some(b=>b.every(t=>keyFits(t.toLowerCase(),held))))m|=1<<i});return m};
    function parseMacro(text){
      const res={tip:"",atk:0,rules:[],skipped:[],notes:[],lines:[MAIN],kept:0};
      const all=text.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
      /* the rules take the last /use or /cast line they can say in full, never half of one; the rest stay as written */
      let main=-1,mainRes=null;
      for(let i=all.length-1;i>=0&&main<0;i--)if(/^\/(use|cast)\s/i.test(all[i])){const t=readUse(all[i]);if(t.rules.length&&!t.skipped.length){main=i;mainRes=t}}
      const before=[],after=[];
      all.forEach((line,i)=>{
        if(i===main)return;
        let m;
        if(/^#show(tooltip)?\b/i.test(line)&&i===0){res.tip=/^#showtooltip/i.test(line)?"showtooltip":"show";
          if(/^#show(tooltip)?\s+\S/i.test(line))res.notes.push("“"+line+"” names what to show. The builder writes it on its own, which shows the spell the macro would cast right now.");return}
        if(main>=0&&(m=line.match(/^\/startattack\b\s*(.*)$/i))){const a=atkMask(m[1]);if(a!==null){res.atk|=a;return}}
        (i<main?before:after).push({text:line});res.kept++;
        if(/^\/(use|cast)\s/i.test(line)){const t=readUse(line);if(t.skipped.length)res.notes.push("“"+line+"” is kept as written, since the rules can't say all of it: "+t.skipped[0])}});
      if(mainRes){res.rules=mainRes.rules;res.notes.push(...mainRes.notes)}
      res.lines=before.concat([MAIN],after);
      return res}

    /* ---- the other lines in words, for the reading */
    const CMDW={dismount:()=>"gets you off your mount",cancelform:()=>"cancels your shapeshift form, such as Ghost Wolf",
      stopmacro:()=>"stops the macro here, so the lines after it don't run",stopcasting:()=>"stops the spell you are casting",
      startattack:()=>"starts your auto-attack on your target",stopattack:()=>"stops your auto-attack",
      cancelaura:a=>"removes "+(a||"a buff")+" from you",click:a=>"clicks the button named "+(a||"after it"),run:()=>"runs a piece of Lua code",script:()=>"runs a piece of Lua code"};
    /* conditions in words: commas are "and", bracket sets side by side are "or"; "" when one set is empty, since that always fits */
    const condWords=sets=>{
      if(sets.some(x=>!x.trim()))return"";
      return sets.map(set=>{
        let unit="target";const f={},parts=[];
        for(const raw of set.split(",").map(normCond).filter(Boolean)){
          const t=raw.toLowerCase(),at=t.match(/^(?:@|target=)(.+)$/);let m;
          if(at)unit=at[1];
          else if(["help","harm","dead","nodead","exists","noexists"].includes(t))f[t]=true;
          else if(t==="mod")parts.push("you are holding Shift, Ctrl or Alt");
          else if(t==="nomod")parts.push(KEYP.nomod);
          else if((m=t.match(/^(no)?mod:(.+)$/))){const ks=m[2].split("/").map(keyName);
            parts.push(ks.includes(null)?"“"+raw+"” is true":(m[1]?"you are not holding ":"you are holding ")+ks.map(k=>KEYN[k]).join(" or "))}
          else if((m=t.match(/^(?:btn|button):([12])$/)))parts.push(BTNP[m[1]]);
          else if(WHENP[t])parts.push(WHENP[t]);
          else if(t.startsWith("known:"))parts.push("you know "+knownName(raw.slice(raw.indexOf(":")+1).trim()));
          else if((m=t.match(/^(no)?(?:form|stance)(?::(\d+))?$/)))parts.push("you are "+(m[1]?"not ":"")+"in "+(m[2]?"form "+m[2]+(m[2]==="1"?" (Ghost Wolf, for a Shaman)":""):"a shapeshift form"));
          else parts.push("“"+raw+"” is true")}
        const who=f.help?(f.dead?"is friendly and dead":f.nodead?"is friendly and alive":"is friendly"):f.harm?(f.dead?"is an enemy and dead":f.nodead?"is an enemy and alive":"is an enemy"):
          f.dead?"is dead":f.nodead?"is alive, or nobody is there":f.exists?"is there":f.noexists?"is not there":"";
        if(who)parts.push(unit==="player"?"you are "+who.replace(/^is /,""):(NOUN[unit]||"@"+unit)+" "+who);
        return parts.length===1?parts[0]:parts.slice(0,-1).join(", ")+" and "+parts[parts.length-1]}).join(", or ")};
    function otherWords(t){
      const m=t.match(/^\/(\S+)\s*(.*)$/);if(!m)return"“"+t+"” is kept as written.";
      const cmd=m[1].toLowerCase();
      const split=x=>{const c=x.match(/^\s*((?:\[[^\]]*\]\s*)*)(.*)$/);return{sets:[...c[1].matchAll(/\[([^\]]*)\]/g)].map(y=>y[1]),arg:c[2].trim()}};
      if(cmd==="use"||cmd==="cast"){
        const ch=m[2].split(";").map(split).filter(x=>x.arg);
        if(!ch.length)return"“"+t+"” has no spell or item to use.";
        return ch.map((x,i)=>{const w=x.sets.length?condWords(x.sets):"";
          return i===0?(w?"If "+w+", it uses "+x.arg:"It uses "+x.arg):(w?"if not, it uses "+x.arg+" if "+w:"otherwise it uses "+x.arg)}).join("; ")+"."}
      const x=split(m[2]),w=x.sets.length?condWords(x.sets):"";
      const what=CMDW[cmd]?CMDW[cmd](x.arg):"runs “"+t+"”, which the builder doesn't explain";
      return(w?"If "+w+", it ":"It ")+what+"."}
    /* another line in the macro box: its command coloured like the builder's, and every part the glossary knows explained there */
    const otherNodes=(t,add,txt,use)=>{
      const m=t.match(/^(\/\S+)(.*)$/);if(!m){txt(t);return}
      const cmd=m[1].toLowerCase();add(m[1],"tk tk-cmd");if(GLOSS[cmd])use(cmd);txt(m[2]);
      for(const b of m[2].matchAll(/\[([^\]]*)\]/g))for(const raw of b[1].split(",").map(normCond).filter(Boolean)){
        const k=raw.toLowerCase();glossKey(k);
        if(/^known:/.test(k)&&!GLOSS[k])GLOSS[k]=["sit","You must know "+knownName(raw.slice(raw.indexOf(":")+1).trim())+"."];
        if(GLOSS[k])use(k)}};

    function explain(valid,issues){
      how.replaceChildren();
      how.append(el("h3",null,"How this macro reads"));
      /* the other lines, in words, before and after the rules' line */
      const at=lines.indexOf(MAIN),before=lines.slice(0,at).filter(x=>x.text.trim()),after=lines.slice(at+1).filter(x=>x.text.trim());
      const say=(head,items)=>{if(!items.length)return;how.append(el("p",null,head));const ol=el("ol","bsteps");for(const x of items)ol.append(el("li",null,otherWords(x.text.trim())));how.append(ol)};
      if(!valid.length){
        if(before.length||after.length)say("When you press the button, it runs these lines from the top:",before.concat(after));
        else how.append(el("p","bnote","Switch on a rule and give it a spell name to see how the macro reads."));
        return}
      say("When you press the button, it first runs these lines from the top:",before);
      /* /startattack is its own line, run on every press before the spell is picked */
      if(opts.atk)how.append(el("p",null,(before.length?"Then it":"First it")+" starts your auto-attack on your target"+atkWhen()+". That only does something when your target is an enemy you can attack."));
      how.append(el("p",null,(opts.atk||before.length?"Then":"When you press the button,")+" the macro looks at these rules from the top. It uses the first one whose conditions are all true and skips the rest, even if that spell then fails. If none of them is true, nothing happens."));
      const ol=el("ol","bsteps");
      valid.forEach(r=>{
        const li=el("li"),conds=[];li.dataset.rule=idOf(r);
        if(KEYP[r.key])conds.push(KEYP[r.key]);
        if(BTNP[r.btn])conds.push(BTNP[r.btn]);
        if(WHENP[r.when])conds.push(WHENP[r.when]);
        if(knownOf(r))conds.push("you know "+knownName(knownOf(r)));
        if(r.unit!=="target"&&r.unit!=="player"&&r.unit!=="cursor"&&r.unit!=="none"){
          if(WHOP[r.who])conds.push(NOUN[r.unit]+" "+WHOP[r.who]);else if(EXISTS[r.unit])conds.push(EXISTS[r.unit]);
        }else if(r.unit==="target"&&WHOP[r.who])conds.push("your target "+WHOP[r.who]);
        else if(r.unit==="player"&&WHOP[r.who])conds.push("you are "+WHOP[r.who].replace(/^is /,""));
        const spell=el("strong",null,spellOf(r)),its=issues.get(r)||[],{s}=spellInfo(r);
        /* say what really happens: a rule below one that always fits would cast, a rule that can't work only tries,
           and a spell that goes on you, or on nobody, ignores where the rule points */
        /* a name the builder doesn't know may be an item, like a mount: it is used, and only aimed when the rule aims it */
        const verb=its.some(x=>x.reach)?(s?"would cast ":"would use "):its.some(x=>x.never)?"tries to cast ":s?"casts ":"uses ";
        const on=!s?(r.unit==="target"?"":ON[r.unit]):s.t==="self"?"on you":s.t==="none"?"(it isn't aimed at anyone)":s.t!=="ground"&&r.unit==="cursor"?"(@cursor can't aim it)":
          s.t==="ground"&&r.unit==="target"?"(you then click where to place it)":ON[r.unit];
        if(conds.length){
          const c=conds.length===1?conds[0]:conds.slice(0,-1).join(", ")+" and "+conds[conds.length-1];
          li.append(document.createTextNode("If "+c+", it "+verb),spell,document.createTextNode((on?" "+on:"")+"."))
        }else li.append(document.createTextNode("It "+verb),spell,document.createTextNode((on?" "+on:"")+"."));
        if(its.some(x=>x.never))li.classList.add("bad");
        for(const x of its){const p=el("span","bissue"+(x.never?" never":""));p.append(el("b",null,x.never?"Won't work. ":"Note. "),document.createTextNode(x.t));li.append(p)}
        ol.append(li)});
      /* a rule that always fits means "otherwise" is never reached */
      const last=valid.find(always);
      ol.append(el("li",null,!last?"If none of the above is true, nothing happens.":
        last===valid[valid.length-1]?"Rule "+numOf(last)+" always fits, so it is the “otherwise”: when nothing above it fits, the macro uses it.":
        "Rule "+numOf(last)+" always fits, so the macro never gets past it."));
      how.append(ol);
      say("After that it runs:",after)}

    function glossary(used){
      gloss.replaceChildren();
      if(!used.length)return;
      gloss.append(el("h3",null,"What each part means"));
      const dl=el("dl","bdl");
      for(const key of used){
        const g=GLOSS[key];if(!g)continue;
        const dt=el("dt"),chip=el("span","tk tk-"+g[0],key==="spell"?"Spell name":key);dt.append(chip);
        dl.append(dt,el("dd",null,g[1]))}
      gloss.append(dl)}

    const update=()=>{
      const valid=rules.filter(r=>r.on&&spellOf(r));
      let text="",nodes=[];
      const used=[],use=k=>{if(!used.includes(k))used.push(k)};
      const add=(t,cls,rule)=>{const s=el("span",cls,t);if(rule)s.dataset.rule=rule;nodes.push(s);return s};
      const txt=t=>nodes.push(document.createTextNode(t)),br=()=>{if(nodes.length)txt("\n")};
      const others=lines.filter(x=>!x.main&&x.text.trim());
      if(valid.length||others.length){
        if(opts.tip){use("#"+opts.tip);add("#"+opts.tip,"tk tk-cmd")}
        for(const item of lines){
          if(!item.main){if(item.text.trim()){br();otherNodes(item.text.trim(),add,txt,use)}continue}
          if(!valid.length)continue;
        const groups=[];
        for(const r of valid){const sp=spellOf(r),last=groups[groups.length-1];
          if(last&&last.sp===sp)last.rs.push(r);else groups.push({sp,rs:[r]})}
        if(opts.atk){br();use("/startattack");add("/startattack","tk tk-cmd");
          const bs=opts.atk===ATKALL?[]:atkBrackets(opts.atk);if(bs.length){txt(" ");use("[ ]");if(bs.length>1)use("][")}
          for(const b of bs){const c=add("","cl");c.append(document.createTextNode("["));
            b.t.forEach((t,ti)=>{if(ti){c.append(document.createTextNode(","));use(",")}c.append(el("span","tk tk-key",t));glossKey(t);use(t)});
            c.append(document.createTextNode("]"))}}
        /* /use does exactly what /cast does, one letter shorter */
        br();use("/use");add("/use","tk tk-cmd");txt(" ");
        groups.forEach((g,gi)=>{
          if(gi>0){use(";");add(";","tk tk-sym")}
          /* a rule with no conditions always fits, and the rules after it never get a turn. The rules before it that aim at the same unit
             change nothing, so they are left out: [mod:shift][]X is just X. One aimed elsewhere still decides who gets the spell,
             so [@mouseover,help][]X keeps both. */
          const ai=g.rs.findIndex(r=>!partsOf(r).length);
          const keep=ai<0?g.rs:g.rs.slice(0,ai+1).filter((r,k)=>k===ai||r.unit!==g.rs[ai].unit);
          const bare=ai>=0&&keep.length===1;
          if(!bare){
            if(keep.length>1)use("][");
            use("[ ]");
            keep.forEach(r=>{
              const c=add("","cl",idOf(r));c.append(document.createTextNode("["));
              partsOf(r).forEach((p,pi)=>{if(pi>0){c.append(document.createTextNode(","));use(",")}c.append(el("span","tk tk-"+p.k,p.t));use(p.t)});
              c.append(document.createTextNode("]"))})}
          /* no space between "]" and the spell: the game doesn't need one, and each saves a character */
          add(g.sp,"tk tk-spell");use("spell")})}
        text=nodes.map(n=>n.textContent).join("")}
      out.set(text,nodes);
      warn.hidden=text.length<=MAXLEN;
      warn.textContent=text.length>MAXLEN?"This is "+(text.length-MAXLEN)+" characters over the 255 limit. Remove a rule or a key to shorten it, or use spell IDs in place of long spell names.":"";
      const issues=check(valid),nBad=valid.filter(r=>(issues.get(r)||[]).some(x=>x.never)).length;
      bad.hidden=!nBad;
      bad.textContent=nBad?(nBad===1?"One rule":nBad+" rules")+" in this macro can never work. "+(nBad===1?"It is":"They are")+" marked below, with the reason.":"";
      for(const r of rules){
        const box=rowMsg.get(r);if(!box)continue;
        const its=r.on?issues.get(r)||[]:[];
        box.replaceChildren(...its.map(x=>{const p=el("p","bissue"+(x.never?" never":""));p.append(el("b",null,x.never?"Won't work. ":"Note. "),document.createTextNode(x.t));return p}));
        box.hidden=!its.length;box.parentNode.classList.toggle("bad",its.some(x=>x.never))}
      explain(valid,issues);glossary(used)};

    const rowMsg=new WeakMap();
    function draw(){
      list.replaceChildren();clearBtn.disabled=!rules.length;
      rules.forEach((r,i)=>{
        const n=idOf(r),row=el("div","rrow"+(r.on?"":" off"));row.dataset.rule=n;
        const headRow=el("div","rhead");
        const cb=el("input");cb.type="checkbox";cb.checked=r.on;cb.id="mb-on-"+n;cb.setAttribute("aria-label","Use rule "+(i+1));
        cb.onchange=()=>{r.on=cb.checked;row.classList.toggle("off",!r.on);update()};
        const sp=el("input");sp.type="text";sp.id="mb-sp-"+n;sp.value=r.spell;sp.placeholder="Spell name";sp.autocomplete="off";sp.spellcheck=false;sp.setAttribute("list","mb-spells");sp.setAttribute("aria-label","Spell for rule "+(i+1));
        sp.oninput=()=>{r.spell=sp.value;update()};
        /* the down arrow goes one step past Rank 1 to 0, which empties the box: back to "Highest", no rank in the macro */
        const rk=el("input");rk.type="number";rk.id="mb-rk-"+n;rk.min="0";rk.max="20";rk.placeholder="Highest rank";rk.value=r.rank;
        rk.title="Rank of the spell to cast. Leave empty for your highest rank.";rk.setAttribute("aria-label","Rank of the spell for rule "+(i+1)+". Leave empty for your highest rank.");
        rk.oninput=()=>{if(rk.value!==""&&+rk.value<1)rk.value="";r.rank=rk.value;update()};
        const up=el("button","mv","\u2191"),dn=el("button","mv","\u2193"),del=el("button","mv del","\u2715");
        up.type=dn.type=del.type="button";
        up.setAttribute("aria-label","Move rule "+(i+1)+" up");dn.setAttribute("aria-label","Move rule "+(i+1)+" down");del.setAttribute("aria-label","Remove rule "+(i+1));
        up.disabled=i===0;dn.disabled=i===rules.length-1;
        const focusBtn=(k,which)=>{const b=list.children[k]&&list.children[k].querySelectorAll(".mvs .mv")[which];if(b)b.focus()};
        up.onclick=()=>{[rules[i-1],rules[i]]=[rules[i],rules[i-1]];draw();update();focusBtn(i-1,0)};
        dn.onclick=()=>{[rules[i+1],rules[i]]=[rules[i],rules[i+1]];draw();update();focusBtn(i+1,1)};
        del.onclick=()=>{rules.splice(i,1);draw();update()};
        const mv=el("div","mvs");mv.append(up,dn,del);
        headRow.append(el("span","num",String(i+1)),cb,sp,rk,mv);
        const sels=el("div","rsel");
        const field=(label,list2,key)=>{
          const s=mkSel("mb-"+key+"-"+n,list2,r[key]);s.onchange=()=>{r[key]=s.value;update()};
          const f=el("div","rf"),l=el("label",null,label);l.htmlFor=s.id;f.append(l,s);return f};
        sels.append(field("Aimed at",UNITS,"unit"),field("Only if they are",WHO,"who"),field("While holding",KEYS,"key"),field("Click with",BTNS,"btn"),field("When",WHEN,"when"));
        const kn=el("input");kn.type="text";kn.id="mb-kn-"+n;kn.value=r.known||"";kn.placeholder="Any spell, or leave empty";kn.autocomplete="off";kn.spellcheck=false;
        kn.setAttribute("list","mb-spells");kn.oninput=()=>{r.known=kn.value;update()};
        const knF=el("div","rf"),knLb=el("label",null,"Only if you know");knLb.htmlFor=kn.id;knF.append(knLb,kn);sels.append(knF);
        const msg=el("div","rmsg");msg.hidden=true;msg.setAttribute("aria-live","polite");rowMsg.set(r,msg);
        row.append(headRow,sels,msg);list.append(row)})}

    /* the other lines, kept as written: edit, move around the rules' own line, or remove */
    const linesBox=el("div","blines"),linesList=el("div","llist"),lineAdd=el("button","badd","+ Add another line");lineAdd.type="button";
    linesBox.append(el("h3",null,"Other lines"),el("p","bnote","Lines the rules don't build, like /stopmacro or /dismount, kept as you write them. Move them above or below the rules' line to set when they run."),linesList,lineAdd);
    function drawLines(){
      linesList.replaceChildren();linesList.hidden=lines.length===1;
      lines.forEach((x,i)=>{
        const row=el("div","lrow"+(x.main?" main":""));let body;
        if(x.main)body=el("span","lmain","The rules above: their /use line");
        else{body=el("input");body.type="text";body.value=x.text;body.spellcheck=false;body.autocomplete="off";body.placeholder="/stopmacro [mod:ctrl]";
          body.setAttribute("aria-label","Macro line "+(i+1));body.oninput=()=>{x.text=body.value;update()}}
        const up=el("button","mv","\u2191"),dn=el("button","mv","\u2193");up.type=dn.type="button";up.disabled=i===0;dn.disabled=i===lines.length-1;
        up.setAttribute("aria-label","Move line "+(i+1)+" up");dn.setAttribute("aria-label","Move line "+(i+1)+" down");
        up.onclick=()=>{[lines[i-1],lines[i]]=[lines[i],lines[i-1]];drawLines();update()};
        dn.onclick=()=>{[lines[i+1],lines[i]]=[lines[i],lines[i+1]];drawLines();update()};
        const mv=el("div","mvs");mv.append(up,dn);
        if(!x.main){const del=el("button","mv del","\u2715");del.type="button";del.setAttribute("aria-label","Remove line "+(i+1));del.onclick=()=>{lines.splice(i,1);drawLines();update()};mv.append(del)}
        row.append(body,mv);linesList.append(row)})}
    lineAdd.onclick=()=>{lines.push({text:""});drawLines();update();const ins=linesList.querySelectorAll("input");if(ins.length)ins[ins.length-1].focus()};
    function load(p){
      lines=[MAIN];drawLines();
      rules=p.rules();opts=Object.assign({},p.opts);opts.atk=p.opts.attack==="always"?ATKALL:0;
      syncTip();syncAtk();
      presetBtns.forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.id===p.id)));
      draw();update()}
    for(const p of PRESETS){
      const b=el("button","bpre",p.name);b.type="button";b.dataset.id=p.id;b.setAttribute("aria-pressed","false");
      b.onclick=()=>{load(p);try{history.replaceState(null,"","#"+p.id)}catch(e){}};
      presetBtns.push(b);pre.append(b)}
    addBtn.onclick=()=>{
      const last=rules[rules.length-1];
      rules.push(rule({spell:last?last.spell:"Healing Wave",unit:"target"}));draw();update();
      const nr=list.lastElementChild&&list.lastElementChild.querySelector("input[type=text]");if(nr)nr.focus()};
    /* start from an empty list: no preset is picked any more, so the link loses its preset too */
    clearBtn.onclick=()=>{
      rules=[];draw();update();
      presetBtns.forEach(b=>b.setAttribute("aria-pressed","false"));
      try{history.replaceState(null,"",location.pathname+location.search)}catch(e){}
      addBtn.focus()};

    /* hovering or focusing a rule, a part of the macro or a line of the reading lights up the other two */
    let lit=null;
    const light=id=>{
      if(lit===id)return;lit=id;
      root.querySelectorAll(".hl").forEach(x=>x.classList.remove("hl"));
      if(id)root.querySelectorAll('[data-rule="'+id+'"]').forEach(x=>x.classList.add("hl"))};
    root.addEventListener("pointerover",ev=>{const t=ev.target.closest&&ev.target.closest("[data-rule]");light(t?t.dataset.rule:null)});
    root.addEventListener("pointerleave",()=>light(null));
    root.addEventListener("focusin",ev=>{const t=ev.target.closest&&ev.target.closest("[data-rule]");light(t?t.dataset.rule:null)});
    root.addEventListener("focusout",()=>light(null));

    const acts=el("div","bacts");acts.append(addBtn,clearBtn);
    const left=el("div","bleft");left.append(acts,list,linesBox);
    const side=el("div","bside");side.append(how,gloss);
    const grid=el("div","bgrid");grid.append(left,side);
    root.append(pre,imp,head,optRow,hint,grid,dl);
    const fromHash=(scroll)=>{
      const id=(location.hash||"").slice(1),p=PRESETS.find(x=>x.id===id);
      load(p||PRESETS[0]);
      if(p&&scroll)root.scrollIntoView({behavior:calm?"auto":"smooth",block:"start"})};
    fromHash(false);window.addEventListener("hashchange",()=>fromHash(true))}

  /* Pictures in a guide open full size in an overlay. Click, the close button or Esc closes it. */
  function lightbox(host){
    host.querySelectorAll("img").forEach(img=>{
      const btn=el("button","zoom");btn.type="button";btn.setAttribute("aria-label","Open the picture larger: "+(img.alt||"picture"));
      img.replaceWith(btn);btn.append(img);
      btn.addEventListener("click",()=>{
        const ov=el("div","lightbox");ov.setAttribute("role","dialog");ov.setAttribute("aria-modal","true");ov.setAttribute("aria-label",img.alt||"Picture");
        const big=el("img");big.src=img.currentSrc||img.src;big.alt=img.alt||"";
        const bar=el("div","lbbar"),close=el("button","lbclose","Close");close.type="button";
        const open=el("a","lbopen","Open in a new tab");open.href=big.src;open.target="_blank";open.rel="noopener";
        bar.append(el("span","lbhint","Click anywhere or press Esc to close"),open,close);
        ov.append(bar,big);document.body.append(ov);document.documentElement.classList.add("lbon");close.focus();
        const done=()=>{ov.remove();document.documentElement.classList.remove("lbon");document.removeEventListener("keydown",key);btn.focus()};
        const key=ev=>{if(ev.key==="Escape")done()};
        document.addEventListener("keydown",key);
        ov.addEventListener("click",ev=>{if(ev.target!==open)done()});
        close.addEventListener("click",ev=>{ev.stopPropagation();done()})})})}

  /* The talent calculator: the page's own tables are the steps. Scrolling (or the slider) walks through the levels and the trees show the points spent by then.
     A page can hold several builds, picked with a switcher. A build can respec once: the trees then change to the new spec all at once. */
  function talentCalc(host){
    const marker=host.querySelector('[data-widget="talent-calc"]');if(!marker)return;
    marker.remove();
    /* the icon sheet (images/talent-trees.webp): its size, where each tree starts, the icon size, the icons' columns and rows,
       and the tree header icons along its top. Each tree is 4 columns of 64 pixels, its talents from the second row of 64 down. */
    const W=768,H=512,ICON=56,HI=56,HY=4,PX={el:0,en:256,re:512},CX=[32,96,160,224],RY=[96,160,224,288,352,416,480];
    const TREES=[{id:"el",name:"Elemental",hx:4},{id:"en",name:"Enhancement",hx:260},{id:"re",name:"Restoration",hx:516}];
    /* [tree, column, row, name, most ranks] */
    const N=(t,c,r,name,max)=>({t,c,r,name,max});
    const NODES=[
      N("el",1,0,"Convection",5),N("el",2,0,"Concussion",5),
      N("el",0,1,"Elemental Devastation",3),N("el",1,1,"Reverberation",5),N("el",2,1,"Elemental Alacrity",3),N("el",3,1,"Call of Flame",3),
      N("el",0,2,"Elemental Focus",1),N("el",1,2,"Elemental Warding",3),
      N("el",0,3,"Trial by Fire",2),N("el",1,3,"Eye of the Storm",3),N("el",3,3,"Earthbound",1),
      N("el",0,4,"Elemental Reach",2),N("el",1,4,"Call of Thunder",1),N("el",2,4,"Lightning Overload",3),
      N("el",2,5,"Elemental Fury",5),N("el",1,6,"Lightning Mastery",1),
      N("en",0,0,"Earth's Grasp",2),N("en",1,0,"Thundering Strikes",5),N("en",2,0,"Ancestral Knowledge",5),
      N("en",0,1,"Guardian Totems",2),N("en",1,1,"Mental Dexterity",3),N("en",3,1,"Improved Lightning Shield",3),
      N("en",0,2,"Elemental Weapons",3),N("en",2,2,"Shamanistic Focus",1),N("en",3,2,"Anticipation",3),
      N("en",0,3,"Toughness",5),N("en",1,3,"Flurry",5),N("en",2,3,"Stormstrike",1),N("en",3,3,"Improved Ghost Wolf",2),
      N("en",0,4,"Spirit Weapons",1),N("en",1,4,"Mental Quickness",2),N("en",2,4,"Improved Stormstrike",2),
      N("en",2,5,"Maelstrom Weapon",5),N("en",1,6,"Rage of the Farseer",1),
      N("re",1,0,"Improved Healing Wave",5),N("re",2,0,"Tidal Focus",5),
      N("re",0,1,"Mindfulness",3),N("re",1,1,"Natural Grace",3),N("re",2,1,"Totemic Focus",5),N("re",3,1,"Improved Reincarnation",2),
      N("re",0,2,"Ancestral Healing",3),N("re",1,2,"Healing Focus",3),N("re",2,2,"Water Shield",1),
      N("re",0,3,"Tidal Mastery",5),N("re",1,3,"Restorative Totems",5),N("re",2,3,"Mana Tide Totem",1),
      N("re",1,4,"Healing Way",3),N("re",2,4,"Nature's Swiftness",1),
      N("re",2,5,"Purification",5),N("re",1,6,"Riptide",1)];
    const BYNAME={};NODES.forEach(n=>{BYNAME[n.name]=n});

    /* Builds: a section holding <div data-build="id" data-name="..."></div> starts that build, and the sections after it belong to it.
       Sections before the first build are shared. <div data-respec="30"></div> marks where a build respecs: its steps from there on are the new spec. */
    const BUILDS=[];let cb=null,phase=1;
    host.querySelectorAll(".sec").forEach(sec=>{
      const bm=sec.querySelector("[data-build]");
      if(bm){cb={id:bm.dataset.build,name:bm.dataset.name||bm.dataset.build,secs:[],respec:null};BUILDS.push(cb);phase=1;bm.remove()}
      const rm=sec.querySelector("[data-respec]");
      if(rm&&cb){cb.respec=+rm.dataset.respec;phase=2;rm.remove()}
      if(cb){cb.secs.push(sec);sec.dataset.build=cb.id;sec.dataset.phase=String(phase)}});

    /* the steps are the rows of the tables on this page */
    const steps=[];
    host.querySelectorAll("table tbody tr").forEach(tr=>{
      const td=[...tr.children].map(x=>x.textContent.trim());if(td.length<3)return;
      const lv=td[0].match(/^(\d+)(?:\s+to\s+(\d+))?$/),rk=td[2].match(/^(\d+)(?:\s+to\s+(\d+))?$/),node=BYNAME[td[1]];
      if(!lv||!rk||!node)return;
      const sec=tr.closest(".sec"),a=+lv[1],b=+(lv[2]||lv[1]),r1=+rk[1],r2=+(rk[2]||rk[1]);
      const st={tr,node,a,b,n:b-a+1,r1,r2,build:sec&&sec.dataset.build||null,phase:sec&&sec.dataset.phase==="2"?2:1};
      steps.push(st);tr.classList.add("step")});
    if(!steps.length)return;
    const TOTAL=51;

    /* A build's plan: the positions the slider and the scroll walk through, one per level, with the respec as a position of its own.
       Each step covers the positions from pa to pb; the respec's steps all land at once, on the respec position. */
    const planOf=b=>{
      const ss=steps.filter(s=>!b||s.build===b.id),R=b&&b.respec;if(!ss.length)return null;
      const pos=[],span=f=>{for(let L=Math.min(...f.map(s=>s.a));L<=Math.max(...f.map(s=>s.b));L++)pos.push({L,ph:f[0].phase})};
      if(!R)span(ss);
      else{const p1=ss.filter(s=>s.phase===1),p2=ss.filter(s=>s.phase===2&&s.a>R);span(p1);pos.push({L:R,ph:2,respec:true});if(p2.length){const at=pos.length;span(p2);for(let i=at;i<pos.length;i++)pos[i].ph=2}}
      const ri=pos.findIndex(p=>p.respec);
      for(const s of ss){
        if(s.phase===2&&R&&s.b<=R)s.pa=s.pb=ri;
        else{s.pa=pos.findIndex(p=>p.ph===s.phase&&!p.respec&&p.L===s.a);s.pb=pos.findIndex(p=>p.ph===s.phase&&!p.respec&&p.L===s.b)}}
      return{b,ss,pos,used:new Set(ss.map(s=>s.node))}};
    const plans=BUILDS.length?BUILDS.map(planOf).filter(Boolean):[planOf(null)];
    let cp=plans[0];
    const rankAt=(node,p)=>{const P=cp.pos[p];let r=0;for(const s of cp.ss){if(s.node!==node||s.phase!==P.ph||p<s.pa)continue;r=p>=s.pb?s.r2:s.r1+(P.L-s.a)}return r};

    /* build the trees */
    const root=el("div","tcalc");
    const head=el("div","tc-head");
    const lvl=el("div","tc-level"),lvN=el("b",null,"");lvl.append(el("span",null,"Level"),lvN);
    const pts=el("div","tc-pts"),ptN=el("b",null,"1");pts.append(el("span",null,"Points spent"),ptN,document.createTextNode(" / "+TOTAL));
    const sl=el("input");sl.type="range";sl.id="tc-slider";sl.step="1";
    sl.setAttribute("aria-label","Character level");
    head.append(lvl,pts,sl);
    const trees=el("div","tc-trees"),treeEls={};
    for(const t of TREES){
      const box=el("section","tc-tree"),h=el("header","tc-th"),ic=el("span","tc-ti");
      ic.style.setProperty("--bx",String(t.hx));ic.style.setProperty("--by",String(HY));
      const nm=el("span","tc-tn",t.name),cnt=el("span","tc-tc","0/51");
      h.append(ic,nm,cnt);
      const grid=el("div","tc-grid");
      box.append(h,grid);trees.append(box);treeEls[t.id]={cnt,grid,pts:0}}
    for(const n of NODES){
      const d=el("div","tn"),icon=el("span","tn-ic");
      d.style.gridColumn=String(n.c+1);d.style.gridRow=String(n.r+1);
      d.style.setProperty("--bx",String(PX[n.t]+CX[n.c]-ICON/2));d.style.setProperty("--by",String(RY[n.r]-ICON/2));
      const bd=el("span","tn-bd","0/"+n.max);d.append(icon,bd);n.bd=bd;d.setAttribute("aria-label",n.name);
      n.el=d;treeEls[n.t].grid.append(d)}
    const hint=el("p","tc-hint","Scroll down or drag the slider. Gold means all ranks are taken, green means some.");
    root.append(head,trees,hint);
    const wrap=el("div","tcols"),left=el("div","tleft"),right=el("aside","tright");
    right.setAttribute("aria-label","Talent calculator");
    [...host.children].forEach(c=>left.append(c));
    right.append(root);wrap.append(left,right);host.append(wrap);

    /* Each section with a table stays pinned in place while the page scrolls through a runway of 46 pixels per position.
       The table does not grow. The scrolling happens beneath it, and the position follows how far through the runway you are. */
    const RUN_PX=46;let pins=[];
    left.querySelectorAll(".sec").forEach(sec=>{
      if(!steps.some(s=>sec.contains(s.tr)))return;
      const w=el("div","pinwrap");sec.parentNode.insertBefore(w,sec);w.append(sec)});
    const pinsOf=plan=>{const out=[];
      left.querySelectorAll(".pinwrap").forEach(w=>{
        const rows=plan.ss.filter(s=>w.contains(s.tr));if(!rows.length)return;
        const a=Math.min(...rows.map(s=>s.pa)),b=Math.max(...rows.map(s=>s.pb));
        out.push({w,sec:w.firstElementChild,a,b,m:b-a+1,run:(b-a+1)*RUN_PX,pt:76})});
      return out};
    /* The last section needs enough page beneath it to be scrolled all the way through its runway, and to keep the trees on screen
       until it is done. Tall windows need extra, because the footer is not tall enough to push the page far enough. */
    const layoutPins=()=>{
      for(const p of pins){
        const h=p.sec.offsetHeight;
        p.pt=Math.min(76,window.innerHeight-h-16);
        p.sec.style.top=p.pt+"px";p.w.style.height=(h+p.run)+"px"}
      const last=pins[pins.length-1];if(!last)return;
      const h=last.sec.offsetHeight,wr=last.w.getBoundingClientRect();
      const trailing=document.documentElement.scrollHeight-(wr.bottom+window.scrollY);
      const toEnd=window.innerHeight-h-last.pt-trailing;
      const forTrees=76+root.offsetHeight+16-(last.pt+h);
      last.w.style.height=(h+last.run+Math.max(0,toEnd,forTrees))+"px"};
    window.addEventListener("resize",()=>layoutPins());
    if("ResizeObserver" in window){const ro=new ResizeObserver(()=>layoutPins());left.querySelectorAll(".sec").forEach(s=>ro.observe(s));ro.observe(root)}

    /* size the nodes to the width and height that are available */
    const fit=()=>{
      const w=root.clientWidth||600,g=14;
      const byW=((w-32-2*g)/3-22)/5.3,byH=(window.innerHeight-300)/10;
      const n=Math.max(24,Math.min(62,byW,byH));
      root.style.setProperty("--n",n.toFixed(1)+"px");root.style.setProperty("--s",(n/ICON).toFixed(4))};
    root.style.setProperty("--W",String(W));root.style.setProperty("--H",String(H));root.style.setProperty("--HI",String(HI));
    fit();
    if("ResizeObserver" in window)new ResizeObserver(fit).observe(root);window.addEventListener("resize",fit);

    /* show a position */
    let shown=-1;const prev=new Map();
    const draw=p=>{
      if(p===shown)return;shown=p;
      const P=cp.pos[p],sum={el:0,en:0,re:0};
      for(const n of NODES){
        const r=rankAt(n,p);sum[n.t]+=r;
        const was=prev.get(n);prev.set(n,r);
        n.el.classList.toggle("on",r>0);n.el.classList.toggle("full",r>0&&r===n.max);n.el.classList.toggle("un",!cp.used.has(n));
        n.bd.textContent=r+"/"+n.max;
        n.el.title=cp.used.has(n)?n.name+", rank "+r+" of "+n.max:n.name+": not used in this build";
        if(!calm&&was!==undefined&&r>was){n.el.classList.remove("pop");void n.el.offsetWidth;n.el.classList.add("pop")}}
      let total=0;
      for(const t of TREES){treeEls[t.id].cnt.textContent=sum[t.id]+"/51";total+=sum[t.id]}
      ptN.textContent=String(total);lvN.textContent=P.L+(P.respec?" · respec":"");sl.value=String(p);
      sl.setAttribute("aria-valuetext","Level "+P.L+(P.respec?", after the respec":""));
      for(const s of cp.ss){
        s.tr.classList.toggle("done",p>=s.pb);
        s.tr.classList.toggle("now",p>=s.pa&&p<s.pb);
        s.tr.classList.toggle("next",p<s.pa);
        s.tr.style.setProperty("--rp",String(p>=s.pb?1:p>=s.pa?(p-s.pa+1)/(s.pb-s.pa+1):0))}};

    /* Scrolling picks the position: once a section is pinned, its positions follow the scroll through its runway.
       The trees then walk to that position one step at a time, so even a fast scroll plays through every level. */
    const fromScroll=()=>{
      let p=0;
      for(const q of pins){
        const r=q.w.getBoundingClientRect();
        if(r.top>q.pt)break;
        const prog=Math.max(0,Math.min(1,(q.pt-r.top)/q.run));
        p=q.a+Math.min(q.m-1,Math.floor(prog*q.m))}
      return p};
    let disp=0,target=0,timer=null,lockUntil=0;
    const gap=()=>{const d=Math.abs(target-disp);return d>14?45:d>6?80:150};
    const tick=()=>{
      timer=null;if(disp===target)return;
      disp+=target>disp?1:-1;draw(disp);
      if(disp!==target)timer=setTimeout(tick,gap())};
    const go=p=>{
      target=p;
      if(calm){disp=p;draw(p);return}
      if(!timer&&disp!==target)timer=setTimeout(tick,0)};
    let queued=false;
    const onScroll=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;if(Date.now()>lockUntil)go(fromScroll())})};
    window.addEventListener("scroll",onScroll,{passive:true});window.addEventListener("resize",onScroll);

    /* the slider sets the position right away, and scrolls the page to the row for it */
    sl.addEventListener("input",()=>{
      const p=+sl.value;
      clearTimeout(timer);timer=null;disp=target=p;draw(p);
      lockUntil=Date.now()+700;
      const q=pins.find(x=>p>=x.a&&p<=x.b);let t=0;
      if(p>0&&q){const r=q.w.getBoundingClientRect(),prog=(p-q.a+0.5)/q.m;t=r.top+window.scrollY-q.pt+prog*q.run}
      window.scrollTo({top:Math.max(0,t),behavior:"auto"})});

    /* switch to a build: show its sections and its sidebar links, and walk the trees through its plan */
    const syncSide=()=>{
      const side=document.getElementById("side");if(!side)return;
      side.querySelectorAll('a[href^="#"]').forEach(a=>{const t=document.getElementById(a.getAttribute("href").slice(1)),s=t&&t.closest(".sec");if(s&&s.dataset.build)a.hidden=!!s.closest("[hidden]")})};
    const use=plan=>{
      cp=plan;
      for(const b of BUILDS)for(const sec of b.secs)(sec.closest(".pinwrap")||sec).hidden=!(plan.b&&plan.b.id===b.id);
      pins=pinsOf(plan);
      sl.min="0";sl.max=String(plan.pos.length-1);
      prev.clear();shown=-1;clearTimeout(timer);timer=null;
      layoutPins();disp=target=fromScroll();draw(disp);syncSide()};

    /* Elemental Devastation and Call of Flame can be taken in either order. A switch in a build's text swaps them in its table and in the trees. */
    left.querySelectorAll('[data-widget="swap-order"]').forEach(swapMarker=>{
      const bid=(swapMarker.closest(".sec")||{dataset:{}}).dataset.build||null;
      const edNode=BYNAME["Elemental Devastation"],cofNode=BYNAME["Call of Flame"];
      const pair=steps.filter(s=>s.build===bid&&(s.node===edNode||s.node===cofNode)).sort((x,y)=>x.phase-y.phase||x.a-y.a);
      let acc=0;const blk1=[],blk2=[];
      for(const s of pair){if(acc<edNode.max){blk1.push(s);acc+=s.n}else blk2.push(s)}
      const ok=pair.length&&edNode.max===cofNode.max&&acc===edNode.max&&blk2.reduce((n,s)=>n+s.n,0)===cofNode.max;
      if(!ok){swapMarker.remove();return}
      const setRows=(first,second)=>{
        for(const [blk,node] of [[blk1,first],[blk2,second]]){
          let k=0;
          for(const s of blk){s.node=node;s.r1=k+1;s.r2=k+s.n;k+=s.n}}};
      const paint=s=>{
        s.tr.children[1].textContent=s.node.name;
        s.tr.children[2].textContent=s.r1===s.r2?String(s.r1):s.r1+" to "+s.r2};
      let current=pair[0].node===edNode?"ed":"cof";
      const box=el("div","swapbox"),lab=el("span","swl","Take first"),seg=el("div","swseg");
      seg.setAttribute("role","group");seg.setAttribute("aria-label","Which talent to take first");
      const mk=(id,text)=>{const b=el("button",null,text);b.type="button";b.dataset.v=id;b.setAttribute("aria-pressed",String(id===current));
        b.onclick=()=>choose(id);seg.append(b);return b};
      mk("ed","Elemental Devastation");mk("cof","Call of Flame");
      const arrows=el("span","swic","⇄");arrows.setAttribute("aria-hidden","true");
      box.append(lab,seg,arrows);
      const live=el("span","swlive");live.setAttribute("aria-live","polite");box.append(live);
      swapMarker.replaceWith(box);
      const choose=id=>{
        if(id===current)return;
        current=id;
        for(const b of seg.children)b.setAttribute("aria-pressed",String(b.dataset.v===id));
        const first=id==="ed"?edNode:cofNode,second=id==="ed"?cofNode:edNode;
        live.textContent=first.name+" first";
        setRows(first,second);
        const refresh=()=>{shown=-1;draw(disp)};
        if(calm){pair.forEach(paint);refresh();return}
        pair.forEach((s,i)=>{
          for(const td of [s.tr.children[1],s.tr.children[2]]){
            td.style.animationDelay=(i*90)+"ms";td.classList.remove("flip");void td.offsetWidth;td.classList.add("flip")}
          setTimeout(()=>paint(s),300+i*90)});
        setTimeout(refresh,300);
        for(const n of [edNode,cofNode]){n.el.classList.remove("swp");void n.el.offsetWidth;n.el.classList.add("swp")}
        setTimeout(()=>{for(const s of pair)for(const td of [s.tr.children[1],s.tr.children[2]])td.classList.remove("flip");for(const n of [edNode,cofNode])n.el.classList.remove("swp")},1100)}});

    /* the build switcher: <div data-widget="build-pick"></div> in the shared text; the address keeps the pick (?build=id) so a build can be linked */
    const pickMarker=left.querySelector('[data-widget="build-pick"]');
    if(pickMarker&&plans.length>1){
      const want=new URLSearchParams(location.search).get("build");
      const start=plans.find(p=>p.b.id===want)||plans[0];
      const box=el("div","swapbox buildpick"),seg=el("div","swseg"),live=el("span","swlive");
      seg.setAttribute("role","group");seg.setAttribute("aria-label","Which build");live.setAttribute("aria-live","polite");
      for(const plan of plans){
        const b=el("button",null,plan.b.name);b.type="button";b.setAttribute("aria-pressed",String(plan===start));
        b.onclick=()=>{if(plan===cp)return;
          for(const x of seg.children)x.setAttribute("aria-pressed",String(x===b));
          live.textContent=plan.b.name;use(plan);
          try{const u=new URL(location.href);u.searchParams.set("build",plan.b.id);u.hash="";history.replaceState(null,"",u)}catch(e){}};
        seg.append(b)}
      box.append(el("span","swl","Build"),seg,live);pickMarker.replaceWith(box);
      use(start)}
    else{if(pickMarker)pickMarker.remove();use(cp)}
    /* the sidebar is built after this, so hide the other builds' links once it is there */
    setTimeout(syncSide,0)}

  /* Sidebar on guide pages: the sections of this guide, then every guide */
  function side(){
    const host=document.getElementById("side");if(!host)return;
    const block=(title,items)=>{
      const h=el("h2",null,title),n=el("nav");n.setAttribute("aria-label",title);
      for(const p of items){const a=el("a",null,p.label);a.href=p.href;if(p.id===current)a.setAttribute("aria-current","page");n.append(a)}
      host.append(h,n)};
    if(curGroup){
      const parent=PAGES.find(p=>p.id===curGroup);
      block(parent.label,[{id:parent.id,href:parent.href,label:"All "+parent.label.toLowerCase()},...kids(curGroup)]);
      block("More",top.filter(p=>p.id!==curGroup&&!kids(p.id).length));
    }else block("All guides",top)}

  /* Copy button */
  function flash(btn,msg){
    const old=btn.dataset.label||btn.textContent;btn.dataset.label=old;btn.textContent=msg;btn.classList.add("done");
    clearTimeout(btn._t);btn._t=setTimeout(()=>{btn.textContent=old;btn.classList.remove("done")},1600)}
  function selectNode(node){
    try{const r=document.createRange();r.selectNodeContents(node);const s=window.getSelection();s.removeAllRanges();s.addRange(r)}catch(e){}}
  function copyText(text,btn,node){
    const fail=()=>{if(node)selectNode(node);flash(btn,"Selected, press Ctrl+C")};
    try{
      if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(()=>flash(btn,"Copied"),fail);
      else fail()
    }catch(e){fail()}}

  function macroBox(text){
    text=text.replace(/\n$/,"");
    const box=el("div","macro"),bar=el("div","mbar");
    bar.append(el("span","t","Macro"));
    const pre=el("pre",null,text);
    const btn=el("button","copy","Copy");btn.type="button";btn.onclick=()=>copyText(text,btn,pre);
    const n=text.length,m=el("div","meter"+(n>=240?" warn":""));
    const tr=el("span","track"),fl=el("span","fill");fl.style.width=Math.min(100,n/MAXLEN*100)+"%";tr.append(fl);
    m.append(tr,el("span",null,n+" / "+MAXLEN));
    bar.append(btn,m);box.append(bar,pre);return box}

  /* Markdown guides. Discord's "-# small text" and the long divider lines are turned into standard markdown first. */
  function prep(md){
    return md.replace(/\r\n/g,"\n")
      .replace(/^[━─═]{4,}\s*$/gm,"\n---\n")
      .replace(/^-# (.*)$/gm,"\n§§SUB§§ $1\n")}

  function slug(s){return s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}

  /* Split each section into explanation on the left and its macros on the right.
     A bold label or small note directly above a macro travels with that macro. */
  function sectionize(host){
    const hasH3=!!host.querySelector("h3"),groups=[];let cur=null;
    for(const k of [...host.children]){
      if(k.tagName==="HR"){k.remove();continue}
      if(k.tagName==="H3"||(!hasH3&&k.tagName==="H2")){cur={head:k,items:[]};groups.push(cur);continue}
      if(!cur){cur={head:null,items:[]};groups.push(cur)}
      cur.items.push(k)}
    host.replaceChildren();
    const isLabel=n=>n.tagName==="P"&&(n.classList.contains("subtext")||(n.children.length===1&&n.firstElementChild.tagName==="STRONG"&&n.textContent.trim()===n.firstElementChild.textContent.trim()));
    const secs=[];
    for(const g of groups){
      const sec=el("section","sec");
      if(g.head){sec.append(g.head);sec.id="s-"+g.head.id}
      const right=new Set();
      g.items.forEach((n,i)=>{
        if(n.classList.contains("macro")){right.add(n);for(let j=i-1;j>=0&&isLabel(g.items[j]);j--)right.add(g.items[j])}});
      const text=el("div","sec-text"),macros=el("div","sec-macros");
      for(const n of g.items)(right.has(n)?macros:text).append(n);
      if(text.children.length)sec.append(text);
      if(macros.children.length)sec.append(macros);
      if(!text.children.length||!macros.children.length)sec.classList.add("solo");
      host.append(sec);secs.push(sec)}
    return secs}

  /* "Bold lead: explanation" bullet lists become small cards with a monogram square */
  function stepCards(host){
    host.querySelectorAll("ul").forEach(ul=>{
      const items=[...ul.children];
      if(!items.length||!items.every(li=>li.firstElementChild&&li.firstElementChild.tagName==="STRONG"&&li.firstChild===li.firstElementChild))return;
      ul.classList.add("steps");
      items.forEach(li=>{
        const strong=li.firstElementChild,title=strong.textContent.replace(/:\s*$/,"").trim();
        strong.remove();
        let rest=li.innerHTML.trim().replace(/^:\s*/,"");
        const star=/^★\s*/.test(rest);if(star)rest=rest.replace(/^★\s*/,"");
        li.replaceChildren();if(star)li.classList.add("star");
        const sq=el("span","sq",title.charAt(0).toUpperCase()),body=el("div","sb"),t=el("div","st",title),d=el("div","sd");
        d.innerHTML=rest;body.append(t,d);li.append(sq,body)})})}

  function dimTitle(){
    const h=document.querySelector(".docmain h1");if(!h)return;
    const words=h.textContent.trim().split(/\s+/);if(words.length<2)return;
    const last=words.pop();h.textContent=words.join(" ")+" ";
    h.append(el("span","dim",last))}

  function pager(){
    const main=document.querySelector(".docmain");if(!main||main.querySelector(".pager"))return;
    const guides=curGroup?kids(curGroup):top,i=guides.findIndex(p=>p.id===current);if(i<0)return;
    const box=el("nav","pager");box.setAttribute("aria-label","More guides");
    const link=(p,dir)=>{
      const a=el("a","pg "+dir);a.href=p.href;
      a.append(el("span","pl",(dir==="prev"?"Previous":"Next")+" · "+String(guides.indexOf(p)+1).padStart(2,"0")+" / "+String(guides.length).padStart(2,"0")),el("span","pt",(dir==="prev"?"← ":"")+p.title+(dir==="next"?" →":"")));
      return a};
    if(i>0)box.append(link(guides[i-1],"prev"));else box.append(el("span"));
    if(i<guides.length-1)box.append(link(guides[i+1],"next"));
    main.append(box)}

  function render(host,md){
    marked.setOptions({gfm:true,breaks:true});
    host.innerHTML=marked.parse(prep(md));
    host.classList.add("prose");
    host.querySelectorAll("p").forEach(p=>{
      const f=p.firstChild;
      if(f&&f.nodeType===3&&f.textContent.startsWith("§§SUB§§")){
        f.textContent=f.textContent.replace(/^§§SUB§§\s*/,"");p.classList.add("subtext")}});
    host.querySelectorAll("pre").forEach(pre=>{pre.replaceWith(macroBox(pre.textContent))});
    host.querySelectorAll("a[href^='http']").forEach(a=>{a.target="_blank";a.rel="noopener"});
    const heads=[...host.querySelectorAll("h2,h3")],used={};
    heads.forEach(h=>{let id=slug(h.textContent)||"section";if(used[id])id+="-"+(++used[id]);else used[id]=1;h.id=id});
    const secs=sectionize(host);
    lightbox(host);
    talentCalc(host);
    stepCards(host);
    dimTitle();
    pager();

    /* "On this page" list in the sidebar, highlighting the section being read */
    const sideHost=document.getElementById("side"),sections=secs.filter(s=>s.id);
    if(sideHost&&sections.length>=2){
      const h=el("h2",null,"On this page"),n=el("nav");n.setAttribute("aria-label","On this page");
      const links=new Map();
      for(const s of sections){const a=el("a",null,s.querySelector("h3,h2").textContent);a.href="#"+s.querySelector("h3,h2").id;n.append(a);links.set(s,a)}
      sideHost.prepend(h,n);
      if("IntersectionObserver" in window){
        const io=new IntersectionObserver(es=>{
          for(const e of es)if(e.isIntersecting){links.forEach(a=>a.removeAttribute("aria-current"));links.get(e.target).setAttribute("aria-current","true")}
        },{rootMargin:"-15% 0px -70% 0px"});
        sections.forEach(s=>io.observe(s))}}
    reveal()}

  function guide(){
    const host=document.getElementById("content"),path=document.body.dataset.md;
    if(!host||!path)return;
    fetch(path).then(r=>{if(!r.ok)throw new Error(r.status);return r.text()})
      .then(md=>render(host,md))
      .catch(()=>{host.textContent="This guide could not be loaded. If you opened the file directly, open the site through a web server such as Live Server, or use the published link."})}

  function glow(){
    const hero=document.querySelector(".hero");
    if(!hero||calm)return;
    hero.addEventListener("pointermove",ev=>{
      const r=hero.getBoundingClientRect();
      hero.style.setProperty("--mx",(ev.clientX-r.left)+"px");
      hero.style.setProperty("--my",(ev.clientY-r.top)+"px")})}

  nav();foot();cards();side();macroBuilder();guide();glow();reveal();
})();
