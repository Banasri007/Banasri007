import {svg,txt,write} from './art.mjs';
let b='<rect x="1" y="1" width="1198" height="498" rx="20" fill="url(#grid)" opacity=".45"/><circle cx="900" cy="260" r="260" fill="url(#halo)"/>';
// ---- Typing animation -------------------------------------------------------
// Each line is revealed left-to-right at a constant speed (linear = smooth, no stepping)
// with a thin caret riding the leading edge. Times are in seconds.
// w = measured text width in px (Times New Roman / Consolas, plus a few px of slack)
const lines=[
  {id:'G',cls:'typeGreeting',clipId:'greet',x:44,y:110,h:70,w:116,t0:0.30,t1:1.10,cy:124,ch:44},
  {id:'N',cls:'typeName',clipId:'name',x:39,y:190,h:100,w:476,t0:1.25,t1:2.95,cy:206,ch:78},
  {id:'R',cls:'typeRole',clipId:'role',x:44,y:310,h:60,w:379,t0:3.10,t1:5.20,cy:329,ch:24}
];
const T=12.2,eraseStart=11.2,eraseEnd=11.75,blink=0.5; // total loop, hold until eraseStart
const pc=t=>(t/T*100).toFixed(3)+'%';
let css='';
lines.forEach((L,i)=>{
  const next=lines[i+1];
  const grow='0%{W:0}'+pc(L.t0)+'{W:0}'+pc(L.t1)+'{W:'+L.w+'}'+pc(eraseStart)+'{W:'+L.w+'}'+pc(eraseEnd)+'{W:0}100%{W:0}';
  css+='@keyframes w'+L.id+'{'+grow.replace(/W:(\d+)/g,'width:$1px')+'}';
  css+='@keyframes m'+L.id+'{'+grow.replace(/W:(\d+)/g,'transform:translateX($1px)')+'}';
  // caret visibility: appears when its line starts typing, hands over to the next line
  let vis='0%{opacity:0}'+pc(L.t0)+'{opacity:1}';
  if(next){vis+=pc(next.t0)+'{opacity:0}';}
  else{
    // last line: caret stays, blinking, until the erase finishes
    let on=false;for(let t=L.t1+blink;t<eraseStart;t+=blink){on=!on;vis+=pc(t)+'{opacity:'+(on?0:1)+'}';}
    vis+=pc(eraseStart)+'{opacity:1}'+pc(eraseEnd)+'{opacity:0}';
  }
  vis+='100%{opacity:0}';
  css+='@keyframes v'+L.id+'{'+vis+'}';
  css+='.'+L.cls+'{animation:w'+L.id+' '+T+'s linear infinite}';
  css+='.m'+L.id+'{animation:m'+L.id+' '+T+'s linear infinite}';
  css+='.v'+L.id+'{opacity:0;animation:v'+L.id+' '+T+'s step-end infinite}';
});
css+='@media(prefers-reduced-motion:reduce){'+lines.map(L=>'.'+L.cls+'{animation:none;width:'+L.w+'px}').join('')+'.caret{display:none}}';
b+='<defs>'+lines.map(L=>'<clipPath id="'+L.clipId+'"><rect class="'+L.cls+'" x="'+L.x+'" y="'+L.y+'" width="'+L.w+'" height="'+L.h+'"/></clipPath>').join('')+'</defs>';
b+='<style>'+css+'</style>';
b+='<g clip-path="url(#greet)">'+txt(48,160,"Hi, I'm",38,'#d2e6ed','style="font-family:Times New Roman,Georgia,serif"')+'</g>';
b+='<g clip-path="url(#name)">'+txt(43,270,'Aditya Banasri',82,'#f0f6f7','style="font-family:Times New Roman,Georgia,serif" font-weight="400" letter-spacing="-2"')+'</g>';
b+='<g clip-path="url(#role)">'+txt(48,348,'AI / ML STUDENT + ENTHUSIAST',22,'#65e2ee','class="mono"')+'</g>';
lines.forEach(L=>{b+='<g class="caret v'+L.id+'"><rect class="m'+L.id+'" x="'+(L.x)+'" y="'+L.cy+'" width="3" height="'+L.ch+'" rx="1.5" fill="#65e2ee"/></g>';});
const cx=900,cy=258;
b+='<g fill="none" stroke="#43616c"><circle cx="900" cy="258" r="172" stroke-dasharray="2 10"/><ellipse cx="900" cy="258" rx="193" ry="64" transform="rotate(-28 900 258)" stroke="#65e2ee" opacity=".6"/><ellipse cx="900" cy="258" rx="183" ry="70" transform="rotate(38 900 258)" opacity=".45"/></g>';
const nodes=[];
for(let i=0;i<62;i++){const y=1-2*(i+.5)/62,rr=Math.sqrt(1-y*y),a=i*2.399963;const x=rr*Math.cos(a),z=rr*Math.sin(a);nodes.push({x:cx+142*x,y:cy+142*y,z});}
for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){const a=nodes[i],c=nodes[j],d=Math.hypot(a.x-c.x,a.y-c.y);if(d<57&&Math.abs(a.z-c.z)<.9)b+='<path d="M'+a.x.toFixed(1)+' '+a.y.toFixed(1)+'L'+c.x.toFixed(1)+' '+c.y.toFixed(1)+'" fill="none" stroke="#65e2ee" opacity="'+(a.z<0?.14:.38)+'"/>';}
for(let i=0;i<9;i++){const a=nodes[i*5],c=nodes[(i*5+13)%62];b+='<path d="M'+a.x+' '+a.y+'L'+c.x+' '+c.y+'" fill="none" stroke="#65e2ee" stroke-width="1.3" opacity=".7" class="signal" style="animation-delay:-'+i+'s"/>';}
nodes.sort((a,c)=>a.z-c.z).forEach((a,i)=>{b+='<circle cx="'+a.x+'" cy="'+a.y+'" r="'+(a.z>0?3:1.8)+'" fill="'+(i%7===0?'#65e2ee':'#65e2ee')+'" opacity="'+(a.z>0?.9:.3)+'"'+(i%5===0?' class="pulse"':'')+'/>';});
b+='<g class="orbit"><circle cx="900" cy="86" r="5" fill="#65e2ee"/><circle cx="900" cy="430" r="3" fill="#65e2ee"/></g>';
b+=txt(731,108,'INPUT',10,'#7da1ae','class="mono"')+txt(1024,413,'POSSIBILITY',10,'#7da1ae','class="mono"');
write('assets/hero.svg',svg(1200,500,'Aditya Banasri — AI/ML student and enthusiast',b));
const cards=[
['knowledge','01 / LANGUAGE SYSTEMS','Enterprise-knowledge-agent',['Multi-source RAG. Evidence reconciliation.','Answers grounded in their sources.'],'LangGraph  /  Hybrid retrieval','#65e2ee','agent'],
['vision','02 / COMPUTER VISION','Drivable-Space-Segmentation',['Pixel-level road understanding with a','custom PyTorch encoder–decoder.'],'PyTorch  /  Semantic segmentation','#65e2ee','vision'],
['calibration','03 / RELIABLE ML','clinical-risk-calibration',['Exploring how class imbalance changes','predicted risks — and how to repair them.'],'Calibration  /  Model evaluation','#c4a2ff','chart'],
['aerial','04 / APPLIED DEEP LEARNING','yolo-aerial-person-detection',['Evaluating tiny-object detection from','drone imagery with YOLOv8 + VisDrone.'],'YOLOv8  /  Computer vision','#ffbd83','detect']
];
for(const [id,kicker,title,desc,foot,c,type] of cards){
let s=txt(28,35,kicker,12,c,'class="mono" letter-spacing="1"')+txt(28,79,title,25,'#ecf3f6','font-weight="650"');
s+=txt(28,114,desc[0],15)+txt(28,137,desc[1],15)+txt(28,190,foot,12,c,'class="mono"');
s+='<path d="M28 158H552" stroke="#263640"/><path d="M535 38h15v15m0-15-19 19" stroke="'+c+'" stroke-width="1.5" fill="none"/>';
if(type==='agent')s+='<g stroke="'+c+'" fill="#10242c" opacity=".35"><path d="M475 95h36m-36 0v32h36m0-32 25 16-25 16" fill="none"/><rect x="464" y="87" width="16" height="16" rx="4"/><rect x="464" y="119" width="16" height="16" rx="4"/><circle cx="536" cy="111" r="10"/></g>';
if(type==='vision')s+='<g opacity=".35"><path d="M464 141l31-51h19l35 51" stroke="'+c+'" fill="#163b44"/><path d="M505 97v12m0 9v18" stroke="'+c+'" stroke-width="2"/></g>';
if(type==='chart')s+='<g fill="none" opacity=".4"><path d="M473 88v53h72" stroke="#647886"/><path d="M476 137l15-7 12-15 14-4 24-22" stroke="'+c+'" stroke-width="2"/><path d="M476 137l65-48" stroke="'+c+'" stroke-dasharray="3 5"/></g>';
if(type==='detect')s+='<g stroke="'+c+'" fill="none" opacity=".4"><path d="M472 98v-8h12m48 0h12v8m0 33v9h-12m-48 0h-12v-9"/><rect x="485" y="106" width="16" height="24"/><rect x="515" y="99" width="14" height="27"/></g>';
write('assets/project-'+id+'.svg',svg(580,214,title+'. '+desc.join(' '),s));
}

// ---- Section headings (Times New Roman) -------------------------------------
// GitHub READMEs cannot change fonts, so each heading is a small SVG. Dark and light
// variants are swapped by <picture> in README.md to follow GitHub's theme.
const headings=[['featured-projects','Featured projects',222],['stack','Stack',72],['neural-activity','Neural activity',192]];
for(const [slug,label,tw] of headings){
  for(const [mode,color] of [['dark','#e6edf3'],['light','#1f2328']]){
    const w=tw+8,h=42;
    write('assets/heading-'+slug+'-'+mode+'.svg','<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'" role="img"><title>'+label+'</title><text x="2" y="32" fill="'+color+'" font-size="32" font-weight="400" style="font-family:Times New Roman,Times,Georgia,serif">'+label+'</text></svg>');
  }
}

await import('./build-stack.mjs');
