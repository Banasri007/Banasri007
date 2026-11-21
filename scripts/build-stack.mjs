import fs from 'node:fs';
import {svg,txt,write,root} from './art.mjs';
const icons=JSON.parse(fs.readFileSync(root+'/scripts/stack.json','utf8'));
// Grid: 5 columns, last row centred. Each box keeps its own moving border light.
const cols=5,boxW=214,boxH=70,gapX=20,pitchY=84,top=24,W=1200;
const rows=Math.ceil(icons.length/cols);
const H=top*2+(rows-1)*pitchY+boxH;
let body='';
icons.forEach(({name,slug},i)=>{
  const row=Math.floor(i/cols),col=i%cols;
  const inRow=Math.min(cols,icons.length-row*cols);
  const rowW=inRow*boxW+(inRow-1)*gapX;
  const x=Math.round((W-rowW)/2)+col*(boxW+gapX),y=top+row*pitchY;
  const raw=fs.readFileSync(root+'/assets/logos/'+slug+'.svg','utf8');
  const paths=raw.replace(/<title>[\s\S]*?<\/title>/g,'').replace(/<svg[^>]*>/,'').replace('</svg>','');
  body+='<rect x="'+x+'" y="'+y+'" width="'+boxW+'" height="'+boxH+'" rx="12" fill="#0e1c29" stroke="#253d51"/>';
  body+='<svg x="'+(x+18)+'" y="'+(y+18)+'" width="34" height="34" viewBox="0 0 24 24" fill="#65e2ee">'+paths+'</svg>';
  body+=txt(x+66,y+41,name,19,'#d9e9f3');
  body+='<rect x="'+x+'" y="'+y+'" width="'+boxW+'" height="'+boxH+'" rx="12" pathLength="100" class="edge" style="animation-delay:-'+(i*.37).toFixed(2)+'s;stroke-width:1;opacity:.6"/>';
});
// outerEdge=false: no moving light around the whole panel, only around each box
write('assets/stack.svg',svg(W,H,'Technology stack used across my public projects',body,'',false));
