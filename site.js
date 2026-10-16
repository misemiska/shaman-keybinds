/* Shared behaviour for every page: the top bar, the footer, the home cards, and rendering the markdown guides.
   To add a page, add one entry to PAGES and create its HTML file. */
(function(){
  const SITE={
    name:"Miska's Shaman Emporium",
    discord:{label:"#Miska's-Macro-Emprioum",url:"https://discord.com/channels/260297137554849794/1553074139055783956"}
  };
  const PAGES=[
    {id:"home",href:"index.html",label:"Home"},
    {id:"common-macros",href:"common-macros.html",label:"Common Macros",title:"Useful Common Macros",desc:"Shock, heal and purge macros you can copy and paste.",tags:["Combat","Healing"],md:"content/common-macros.md",hue:"--c-shift"},
    {id:"totem-recall",href:"totem-recall.html",label:"Totem Recall",title:"Totem Destroyed / Totemic Recall",desc:"One button that destroys all your totems, even while casting or in Ghost Wolf.",tags:["Totems"],md:"content/totem-recall.md",hue:"--c-ctrl"},
    {id:"weapon-imbues",href:"weapon-imbues.html",label:"Weapon Imbues",title:"Weapon Imbues",desc:"One macro for weapon imbues and sharpening stones.",tags:["Buffs"],md:"content/weapon-imbues.md",hue:"--c-alt"},
    {id:"ghost-wolf-mount",href:"ghost-wolf-mount.html",label:"Ghost Wolf and Mount",title:"Ghost Wolf and Mount",desc:"One button that picks Ghost Wolf or your mount for you.",tags:["Movement"],md:"content/ghost-wolf-mount.md",hue:"--c-as"},
    {id:"shamanpower",href:"shamanpower.html",label:"ShamanPower",title:"ShamanPower Addon",desc:"The all-in-one totem addon I contribute to, and what it does.",tags:["Addon"],md:"content/shamanpower.md"},
    {id:"weakauras",href:"weakauras.html",label:"WeakAuras",title:"My WeakAuras",desc:"The WeakAuras I built, and how they ended up in the addon.",tags:["WeakAuras"],md:"content/weakauras.md"},
    {id:"setup",href:"setup.html",label:"My Setup",title:"My Setup",desc:"My keyboard layout, with the macro behind every key.",tags:["Reference"],mock:"keys",hue:"--accent"}
  ];
  const MAXLEN=255;
  const current=document.body.dataset.nav||"";
  const calm=window.matchMedia("(prefers-reduced-motion:reduce)").matches;

  function el(t,cls,txt){const n=document.createElement(t);if(cls)n.className=cls;if(txt!=null)n.textContent=txt;return n}

  /* Top bar, with a thin reading-progress line along its bottom edge */
  function nav(){
    const host=document.getElementById("site-nav");if(!host)return;
    host.className="sitenav";
    const inner=el("div","in"),brand=el("a","brand",SITE.name);brand.href="index.html";
    const links=el("div","links");
    for(const p of PAGES){
      if(p.id==="home")continue;
      const a=el("a","l",p.label);a.href=p.href;
      if(p.id===current)a.setAttribute("aria-current","page");
      links.append(a)}
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
    const guides=el("div"),gl=el("div","flist");guides.append(el("p","fh","Guides"),gl);
    for(const p of PAGES){if(p.id==="home")continue;const a=el("a",null,p.label);a.href=p.href;gl.append(a)}
    const com=el("div"),cl=el("div","flist");com.append(el("p","fh","Community"),cl);
    const d=el("a",null,SITE.discord.label);d.href=SITE.discord.url;d.target="_blank";d.rel="noopener";cl.append(d);
    grid.append(brand,guides,com);
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
    const list=PAGES.filter(p=>p.desc);
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

  /* Sidebar on guide pages: the sections of this guide, then every guide */
  function side(){
    const host=document.getElementById("side");if(!host)return;
    const h=el("h2",null,"All guides"),n=el("nav");n.setAttribute("aria-label","All guides");
    for(const p of PAGES){
      if(p.id==="home")continue;
      const a=el("a",null,p.label);a.href=p.href;
      if(p.id===current)a.setAttribute("aria-current","page");
      n.append(a)}
    host.append(h,n)}

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
        const rest=li.innerHTML.trim().replace(/^:\s*/,"");
        li.replaceChildren();
        const sq=el("span","sq",title.charAt(0).toUpperCase()),body=el("div","sb"),t=el("div","st",title),d=el("div","sd");
        d.innerHTML=rest;body.append(t,d);li.append(sq,body)})})}

  function dimTitle(){
    const h=document.querySelector(".docmain h1");if(!h)return;
    const words=h.textContent.trim().split(/\s+/);if(words.length<2)return;
    const last=words.pop();h.textContent=words.join(" ")+" ";
    h.append(el("span","dim",last))}

  function pager(){
    const main=document.querySelector(".docmain");if(!main||main.querySelector(".pager"))return;
    const guides=PAGES.filter(p=>p.id!=="home"),i=guides.findIndex(p=>p.id===current);if(i<0)return;
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

  nav();foot();cards();side();guide();glow();reveal();
})();
