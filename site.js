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
    const UNITS=[["target","Your target"],["mouseover","Mouseover"],["focus","Your focus"],["targettarget","Your target's target"],["focustarget","Your focus's target"],["player","Yourself"],["cursor","The spot under your mouse"]];
    const WHO=[["fa","Friendly and alive"],["f","Friendly (alive or dead)"],["fd","Friendly and dead"],["ea","Enemy and alive"],["e","Enemy (alive or dead)"],["any","Anyone"]];
    const KEYS=[["","No key needed"],["nomod","No key held"],["shift","Shift"],["ctrl","Ctrl"],["alt","Alt"],["altshift","Alt + Shift"],["ctrlshift","Ctrl + Shift"]];
    const WHEN=[["","Any time"],["combat","In combat"],["nocombat","Out of combat"],["swimming","Swimming"],["indoors","Indoors"],["outdoors","Outdoors"]];
    const AT={target:"",mouseover:"@mouseover",focus:"@focus",targettarget:"@targettarget",focustarget:"@focustarget",player:"@player",cursor:"@cursor"};
    const WHOC={fa:["help","nodead"],f:["help"],fd:["help","dead"],ea:["harm","nodead"],e:["harm"],any:[]};
    const NOUN={target:"your target",mouseover:"the unit under your mouse",focus:"your focus",targettarget:"your target's target",focustarget:"your focus's target",player:"you",cursor:"the spot under your mouse"};
    const ON={target:"on your target",mouseover:"on the unit under your mouse",focus:"on your focus",targettarget:"on your target's target",focustarget:"on your focus's target",player:"on you",cursor:"at the spot under your mouse"};
    const EXISTS={mouseover:"there is a unit under your mouse",focus:"you have a focus set",targettarget:"your target has a target",focustarget:"your focus has a target"};
    const WHOP={fa:"is friendly and alive",f:"is friendly",fd:"is friendly and dead",ea:"is an enemy and alive",e:"is an enemy"};
    const KEYP={nomod:"you are holding no key",shift:"you are holding Shift",ctrl:"you are holding Ctrl",alt:"you are holding Alt",altshift:"you are holding Alt and Shift",ctrlshift:"you are holding Ctrl and Shift"};
    const WHENP={combat:"you are in combat",nocombat:"you are out of combat",swimming:"you are swimming",indoors:"you are indoors",outdoors:"you are outdoors"};
    /* the glossary: what each piece of a macro means */
    const KEYN={shift:"Shift",ctrl:"Ctrl",alt:"Alt",altshift:"Alt and Shift",ctrlshift:"Ctrl and Shift"};
    const GLOSS={
      "#showtooltip":["cmd","Makes the button show the icon and tooltip of the spell the macro would cast right now. It must be the first line."],
      "/startattack":["cmd","Starts your auto-attack on your target."],
      "/cast":["cmd","The command that casts a spell."],
      "/use":["cmd","The command that uses a spell or an item. For spells it works the same as /cast."],
      "[ ]":["sym","Square brackets hold conditions. Everything inside one pair must be true for that choice to be used."],
      "][":["sym","Two bracket pairs side by side mean \u201cor\u201d. The spell is cast if either pair is true, checked from left to right."],
      ";":["sym","A semicolon separates different spells. The macro tries them from left to right and uses the first one that fits."],
      "@mouseover":["unit","Aim at the unit under your mouse. The other conditions in the same brackets are checked on that unit."],
      "@focus":["unit","Aim at your focus, the second target you set with /focus."],
      "@targettarget":["unit","Aim at whoever your target is targeting."],
      "@focustarget":["unit","Aim at whoever your focus is targeting."],
      "@player":["unit","Aim at yourself."],
      "@cursor":["unit","Aim at the spot under your mouse, for spells you place on the ground."],
      "help":["flt","The unit must be friendly."],
      "harm":["flt","The unit must be an enemy."],
      "nodead":["flt","The unit must be alive."],
      "dead":["flt","The unit must be dead."],
      "nomod":["key","No modifier key (Shift, Ctrl or Alt) may be held."],
      "combat":["sit","You must be in combat."],
      "nocombat":["sit","You must be out of combat."],
      "swimming":["sit","You must be swimming."],
      "indoors":["sit","You must be indoors."],
      "outdoors":["sit","You must be outdoors."],
      "spell":["spell","The spell to cast. Adding (Rank 3), for example, picks a specific rank. Leave it off for your highest."]};
    for(const k in KEYN)GLOSS["mod:"+k]=["key","You must be holding "+KEYN[k]+"."];

    const rule=(o)=>Object.assign({on:true,spell:"Healing Wave",rank:"",unit:"target",who:"fa",key:"",when:""},o);
    const heal=(unit,who)=>rule({unit,who:who||"fa"});
    const PRESETS=[
      {id:"smart-heal",name:"Smart healing",opts:{tip:true,attack:"off",cmd:"cast"},rules:()=>[heal("mouseover"),heal("target"),heal("focus"),heal("targettarget"),heal("focustarget"),heal("player","any")]},
      {id:"shock",name:"Shock, rank 1 on Shift",opts:{tip:true,attack:"always",cmd:"use"},rules:()=>[rule({spell:"Earth Shock",rank:"1",who:"any",key:"shift"}),rule({spell:"Earth Shock",who:"any"})]},
      {id:"heal-purge",name:"Heal friends, purge enemies",opts:{tip:true,attack:"off",cmd:"use"},rules:()=>[rule({spell:"Lesser Healing Wave",unit:"target"}),rule({spell:"Lesser Healing Wave",unit:"mouseover"}),rule({spell:"Purge",unit:"target",who:"ea"}),rule({spell:"Purge",unit:"mouseover",who:"ea"})]},
      {id:"resurrect",name:"Resurrect on Shift, heal otherwise",opts:{tip:true,attack:"off",cmd:"use"},rules:()=>[rule({spell:"Ancestral Spirit",unit:"mouseover",who:"fd",key:"shift"}),rule({spell:"Ancestral Spirit",unit:"target",who:"fd",key:"shift"}),heal("mouseover"),heal("target")]}];

    let rules=PRESETS[0].rules(),opts=Object.assign({},PRESETS[0].opts),uid=0;
    const ids=new WeakMap();const idOf=r=>{if(!ids.has(r))ids.set(r,++uid);return ids.get(r)};

    /* ---- the macro being edited sits at the top */
    const out=liveMacro(),warn=el("p","bwarn");warn.hidden=true;
    const head=el("div","bhead");head.append(out.box,warn);

    /* ---- options and presets */
    const tip=el("input");tip.type="checkbox";tip.id="mb-tip";
    const tipL=el("label","bcheck");tipL.htmlFor="mb-tip";tipL.append(tip,document.createTextNode(" Show the spell's icon on the button"));
    const mkSel=(id,list,val)=>{const s=el("select");s.id=id;for(const [v,l] of list){const o=el("option",null,l);o.value=v;if(v===val)o.selected=true;s.append(o)}return s};
    const atk=mkSel("mb-atk",[["off","Never"],["nomod","Only with no key held"],["always","Always"]],opts.attack);
    const cmd=mkSel("mb-cmd",[["cast","/cast"],["use","/use"]],opts.cmd);
    const fld=(label,ctrl,cls)=>{const f=el("div","bfield"+(cls?" "+cls:"")),l=el("label",null,label);l.htmlFor=ctrl.id;f.append(l,ctrl);return f};
    const optRow=el("div","btop");
    const tipBox=el("div","bfield tipbox");tipBox.append(tipL);
    optRow.append(fld("Start auto-attack",atk,"small2"),fld("Command",cmd,"small"),tipBox);
    const pre=el("div","bpresets");pre.append(el("span","bl","Start from"));
    const presetBtns=[];
    const hint=el("p","bnote","Hover over a rule to see which part of the macro it makes, and which line of the reading it matches.");
    const list=el("div","blist"),addBtn=el("button","badd","+ Add a rule");addBtn.type="button";

    /* ---- explanation side */
    const how=el("div","bhow"),gloss=el("div","bgloss");

    const spellOf=r=>{let n=(r.spell||"").replace(/[\r\n;\[\]]/g,"").trim();if(!n)return"";const k=parseInt(r.rank,10);return k>0?n+"(Rank "+k+")":n};
    const partsOf=r=>{
      const p=[];
      if(r.key==="nomod")p.push({t:"nomod",k:"key"});else if(r.key)p.push({t:"mod:"+r.key,k:"key"});
      if(r.when)p.push({t:r.when,k:"sit"});
      if(AT[r.unit])p.push({t:AT[r.unit],k:"unit"});
      if(r.unit!=="cursor")for(const w of WHOC[r.who])p.push({t:w,k:"flt"});
      return p};

    function explain(valid){
      how.replaceChildren();
      how.append(el("h3",null,"How this macro reads"));
      if(!valid.length){how.append(el("p","bnote","Switch on a rule and give it a spell name to see how the macro reads."));return}
      how.append(el("p",null,"When you press the button, the macro looks at these rules from the top. It uses the first one whose conditions are all true and skips the rest. If none of them is true, nothing happens."));
      const ol=el("ol","bsteps");
      valid.forEach(r=>{
        const li=el("li"),conds=[];li.dataset.rule=idOf(r);
        if(KEYP[r.key])conds.push(KEYP[r.key]);
        if(WHENP[r.when])conds.push(WHENP[r.when]);
        if(r.unit!=="target"&&r.unit!=="player"&&r.unit!=="cursor"){
          if(WHOP[r.who])conds.push(NOUN[r.unit]+" "+WHOP[r.who]);else if(EXISTS[r.unit])conds.push(EXISTS[r.unit]);
        }else if(r.unit==="target"&&WHOP[r.who])conds.push("your target "+WHOP[r.who]);
        else if(r.unit==="player"&&WHOP[r.who])conds.push("you are "+WHOP[r.who].replace(/^is /,""));
        const spell=el("strong",null,spellOf(r));
        if(conds.length){
          const c=conds.length===1?conds[0]:conds.slice(0,-1).join(", ")+" and "+conds[conds.length-1];
          li.append(document.createTextNode("If "+c+", it casts "),spell,document.createTextNode(" "+ON[r.unit]+"."))
        }else li.append(document.createTextNode("It casts "),spell,document.createTextNode(" "+ON[r.unit]+"."));
        ol.append(li)});
      ol.append(el("li",null,"If none of the above is true, nothing happens."));
      how.append(ol)}

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
      if(valid.length){
        const groups=[];
        for(const r of valid){const sp=spellOf(r),last=groups[groups.length-1];
          if(last&&last.sp===sp)last.rs.push(r);else groups.push({sp,rs:[r]})}
        const add=(t,cls,rule)=>{const s=el("span",cls,t);if(rule)s.dataset.rule=rule;nodes.push(s);return s};
        const txt=t=>nodes.push(document.createTextNode(t));
        if(opts.tip){use("#showtooltip");add("#showtooltip","tk tk-cmd");txt("\n")}
        if(opts.attack!=="off"){use("/startattack");add("/startattack","tk tk-cmd");if(opts.attack==="nomod"){txt(" ");const c=add("","cl");c.append(document.createTextNode("["),el("span","tk tk-key","nomod"),document.createTextNode("]"));use("nomod");use("[ ]")}txt("\n")}
        use("/"+opts.cmd);add("/"+opts.cmd,"tk tk-cmd");txt(" ");
        groups.forEach((g,gi)=>{
          if(gi>0){use(";");add(";","tk tk-sym")}
          const bare=g.rs.length===1&&partsOf(g.rs[0]).length===0;
          if(!bare){
            if(g.rs.length>1)use("][");
            use("[ ]");
            g.rs.forEach(r=>{
              const c=add("","cl",idOf(r));c.append(document.createTextNode("["));
              partsOf(r).forEach((p,pi)=>{if(pi>0)c.append(document.createTextNode(","));c.append(el("span","tk tk-"+p.k,p.t));use(p.t)});
              c.append(document.createTextNode("]"))});
            txt(" ")}
          add(g.sp,"tk tk-spell");use("spell")});
        text=nodes.map(n=>n.textContent).join("")}
      out.set(text,nodes);
      warn.hidden=text.length<=MAXLEN;
      warn.textContent=text.length>MAXLEN?"This is "+(text.length-MAXLEN)+" characters over the 255 limit. Remove a rule or a key to shorten it, or use spell IDs in place of long spell names.":"";
      explain(valid);glossary(used)};

    function draw(){
      list.replaceChildren();
      rules.forEach((r,i)=>{
        const n=idOf(r),row=el("div","rrow"+(r.on?"":" off"));row.dataset.rule=n;
        const headRow=el("div","rhead");
        const cb=el("input");cb.type="checkbox";cb.checked=r.on;cb.id="mb-on-"+n;cb.setAttribute("aria-label","Use rule "+(i+1));
        cb.onchange=()=>{r.on=cb.checked;row.classList.toggle("off",!r.on);update()};
        const sp=el("input");sp.type="text";sp.id="mb-sp-"+n;sp.value=r.spell;sp.placeholder="Spell name";sp.autocomplete="off";sp.spellcheck=false;sp.setAttribute("aria-label","Spell for rule "+(i+1));
        sp.oninput=()=>{r.spell=sp.value;update()};
        const rk=el("input");rk.type="number";rk.id="mb-rk-"+n;rk.min="1";rk.max="20";rk.placeholder="Highest";rk.value=r.rank;rk.setAttribute("aria-label","Rank for rule "+(i+1));
        rk.oninput=()=>{r.rank=rk.value;update()};
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
        sels.append(field("Aimed at",UNITS,"unit"),field("Only if they are",WHO,"who"),field("While holding",KEYS,"key"),field("When",WHEN,"when"));
        row.append(headRow,sels);list.append(row)})}

    function load(p){
      rules=p.rules();opts=Object.assign({},p.opts);
      tip.checked=opts.tip;atk.value=opts.attack;cmd.value=opts.cmd;
      presetBtns.forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.id===p.id)));
      draw();update()}
    for(const p of PRESETS){
      const b=el("button","bpre",p.name);b.type="button";b.dataset.id=p.id;b.setAttribute("aria-pressed","false");
      b.onclick=()=>{load(p);try{history.replaceState(null,"","#"+p.id)}catch(e){}};
      presetBtns.push(b);pre.append(b)}
    tip.onchange=()=>{opts.tip=tip.checked;update()};
    atk.onchange=()=>{opts.attack=atk.value;update()};
    cmd.onchange=()=>{opts.cmd=cmd.value;update()};
    addBtn.onclick=()=>{
      const last=rules[rules.length-1];
      rules.push(rule({spell:last?last.spell:"Healing Wave",unit:"target"}));draw();update();
      const nr=list.lastElementChild&&list.lastElementChild.querySelector("input[type=text]");if(nr)nr.focus()};

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

    const left=el("div","bleft");left.append(list,addBtn);
    const side=el("div","bside");side.append(how,gloss);
    const grid=el("div","bgrid");grid.append(left,side);
    root.append(head,optRow,pre,hint,grid);
    const fromHash=(scroll)=>{
      const id=(location.hash||"").slice(1),p=PRESETS.find(x=>x.id===id);
      load(p||PRESETS[0]);
      if(p&&scroll)root.scrollIntoView({behavior:calm?"auto":"smooth",block:"start"})};
    fromHash(false);window.addEventListener("hashchange",()=>fromHash(true))}

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
