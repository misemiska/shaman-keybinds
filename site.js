/* Shared behaviour for every page: the top bar, the footer, the home cards, and rendering the markdown guides.
   To add a page, add one entry to PAGES and create its HTML file. */
(function(){
  const SITE={
    name:"Miska's Shaman Macros",
    discord:{label:"#Miska's-Macro-Emprioum",url:"https://discord.com/channels/260297137554849794/1553074139055783956"}
  };
  const PAGES=[
    {id:"home",href:"index.html",label:"Home"},
    {id:"common-macros",href:"common-macros.html",label:"Common Macros",title:"Useful Common Macros",desc:"Shock, heal and purge macros you can copy and paste."},
    {id:"totem-recall",href:"totem-recall.html",label:"Totem Recall",title:"Totem Destroyed / Totemic Recall",desc:"One button that destroys all your totems, even while casting or in Ghost Wolf."},
    {id:"weapon-imbues",href:"weapon-imbues.html",label:"Weapon Imbues",title:"Weapon Imbues",desc:"One macro for weapon imbues and sharpening stones."},
    {id:"ghost-wolf-mount",href:"ghost-wolf-mount.html",label:"Ghost Wolf and Mount",title:"Ghost Wolf and Mount",desc:"One button that picks Ghost Wolf or your mount for you."},
    {id:"setup",href:"setup.html",label:"My Setup",title:"My Setup",desc:"My keyboard layout, with the macro behind every key."}
  ];
  const MAXLEN=255;
  const current=document.body.dataset.nav||"";

  function el(t,cls,txt){const n=document.createElement(t);if(cls)n.className=cls;if(txt!=null)n.textContent=txt;return n}

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
    inner.append(brand,links);host.append(inner)}

  function foot(){
    const host=document.getElementById("site-foot");if(!host)return;
    host.className="sitefoot";
    const inner=el("div","in"),p1=el("p"),a=el("a",null,SITE.discord.label);
    a.href=SITE.discord.url;a.target="_blank";a.rel="noopener";
    p1.append(el("strong",null,"Questions, bugs or ideas? "),document.createTextNode("Post them in "),a,document.createTextNode(" so the threads stay easy to read."));
    inner.append(p1);host.append(inner)}

  function cards(){
    const host=document.getElementById("cards");if(!host)return;
    for(const p of PAGES){
      if(!p.desc)continue;
      const a=el("a","card");a.href=p.href;
      a.append(el("h2",null,p.title),el("p",null,p.desc));
      host.append(a)}}

  /* Copy button */
  function flash(btn,msg){
    const old=btn.dataset.label||btn.textContent;btn.dataset.label=old;btn.textContent=msg;
    clearTimeout(btn._t);btn._t=setTimeout(()=>{btn.textContent=old},1600)}
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
    if(heads.length>=2){
      const toc=el("nav","toc");toc.setAttribute("aria-label","On this page");
      heads.filter(h=>h.tagName==="H3"||!host.querySelector("h3")).forEach(h=>{const a=el("a",null,h.textContent);a.href="#"+h.id;toc.append(a)});
      host.before(toc)}}

  function guide(){
    const host=document.getElementById("content"),path=document.body.dataset.md;
    if(!host||!path)return;
    fetch(path).then(r=>{if(!r.ok)throw new Error(r.status);return r.text()})
      .then(md=>render(host,md))
      .catch(()=>{host.textContent="This guide could not be loaded. If you opened the file directly, open the site through a web server such as Live Server, or use the published link."})}

  nav();foot();cards();guide();
})();
