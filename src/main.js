import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import events from './events.json';
import { clamp, lerp, sv } from './motion-helpers';


// Adapted from EmiraIT's MIT Scroll-Drawn SVG Timeline.
// Preserves SVG camera transforms, path-tip drawing, ScrollTrigger scrubbing,
// matchMedia lifecycle and Lenis/GSAP ticker integration. See references/.
document.documentElement.classList.add('js');
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const wideQuery='(min-width:900px) and (min-height:500px) and (prefers-reduced-motion:no-preference)';
let trigger, lenis, current=0, navigating=false, cameraY=450;
const state={v:0};
// Unmodified brand assets from Lobe Icons and Simple Icons. No decorative artwork.
const logoNames={0:['siApple','gemini-color'],1:['openclaw-official'],2:['zhipu-color','qwen-color','bytedance-color'],3:['anthropic'],4:['nvidia-color'],5:['claude-color'],6:['deepseek-color'],7:['sora-color'],8:['openai'],9:['openai'],10:['anthropic'],11:['material-policy'],12:['huggingface-color'],13:['kimi-color'],14:['europe'],15:['unitree-official'],16:['openai'],17:['gemini-color'],18:['openai'],19:['meta-color'],20:['deepseek-color'],21:['anthropic'],22:['baidu-color'],23:['nvidia-color']};
function identity(i){
 if(logoNames[i])return logoNames[i].map(name=>`<img src="/icons/${name}.svg" alt="" class="brand-mark ${name}"/>`).join('');
 return '';
}
const cam=$('.tl-cam');
// Fade in viewport space: the camera moves through the mask, not with it.
const viewportDefs=sv('defs',{},$('.tl-svg'));
const depth=sv('linearGradient',{id:'line-depth',x1:0,y1:0,x2:0,y2:1},viewportDefs);
[[0,0],[.15,.28],[.35,.8],[.5,1],[.67,.7],[.88,.2],[1,0]].forEach(([offset,opacity])=>sv('stop',{offset,'stop-color':'white','stop-opacity':opacity},depth));
const mask=sv('mask',{id:'line-atmosphere',maskUnits:'userSpaceOnUse',x:0,y:0,width:1440,height:900},viewportDefs);
sv('rect',{width:1440,height:900,fill:'url(#line-depth)'},mask);
const atmosphere=sv('g',{mask:'url(#line-atmosphere)'},$('.tl-svg'));
atmosphere.appendChild(cam);
const colors=['#72a0ef','#e8887f','#edc368','#79bba0'];
// Vertical adaptation of the source camera. Each node is separated by a viewport.
const positions=events.map((e,i)=>({x:460,y:450+i*1100}));
let route='M 460 -650 C 560 -320 560 120 460 450';
positions.slice(1).forEach((pt,i)=>{const prev=positions[i],bend=i%2?560:360;route+=` C ${bend} ${prev.y+330}, ${bend} ${pt.y-330}, ${pt.x} ${pt.y}`;});
const defs=sv('defs',{},cam);
const gradient=sv('linearGradient',{id:'timeline-color',gradientUnits:'userSpaceOnUse',x1:0,y1:450,x2:0,y2:1550,spreadMethod:'repeat'},defs);
[[0,0],[.12,0],[.20,1],[.37,1],[.45,2],[.62,2],[.70,3],[.87,3],[.95,0],[1,0]].forEach(([offset,color])=>sv('stop',{offset,'stop-color':colors[color]},gradient));
const futureTrack=sv('path',{d:route,fill:'none',stroke:'url(#timeline-color)','stroke-width':2.5,'stroke-opacity':'.18'},cam);
const track=sv('path',{d:route,fill:'none',stroke:'url(#timeline-color)','stroke-width':3,'stroke-opacity':'.78','stroke-linecap':'round'},cam);
const trackLength=track.getTotalLength();
track.style.strokeDasharray=trackLength;
const lengths=positions.map(pt=>{let low=0,high=trackLength;for(let k=0;k<24;k++){const mid=(low+high)/2;if(track.getPointAtLength(mid).y<pt.y)low=mid;else high=mid;}return(low+high)/2;});
const nodes=positions.map((pt,i)=>sv('circle',{cx:pt.x,cy:pt.y,r:7,fill:'#fff',stroke:colors[i%4],'stroke-width':2},cam));
const tip=sv('g',{},cam);
// Translucent multi-stop orb: the gradient belongs to the traveler, not a solid dot.
const orbGradient=sv('radialGradient',{id:'orb-fill',cx:'.32',cy:'.25',r:'.8'},defs);
[['0','#ffffff',.98],['.3','#c5dbff',.86],['.62','#9dbbf5',.75],['.86','#cfbbef',.58],['1','#f4d5c9',.32]].forEach(([offset,color,opacity])=>sv('stop',{offset,'stop-color':color,'stop-opacity':opacity},orbGradient));
const halo=sv('circle',{r:22,fill:'#a8c7fa','fill-opacity':'.10'},tip);
const orb=sv('circle',{r:11,fill:'url(#orb-fill)',stroke:'#9eb9ec','stroke-opacity':'.4','stroke-width':'.8'},tip);
sv('circle',{cx:-3,cy:-3,r:2.5,fill:'white','fill-opacity':'.65'},tip);
let flow=0, cameraTarget=450;
function updateAtmosphere(){
 flow=lerp(flow,Math.min(Math.abs(lenis?.velocity||0)/45,1),.08);
 halo.setAttribute('r',22+flow*5);
 halo.setAttribute('fill-opacity',.10+flow*.04);
 orb.setAttribute('fill-opacity',1-flow*.16);
 // Traveler leads; the camera catches up. A bounded lag survives rapid month jumps.
 const diff=cameraTarget-cameraY;
 cameraY+=clamp(diff,-150,150)*(1-Math.pow(1-.085,gsap.ticker.deltaRatio(60)));
 if(Math.abs(diff)<.05)cameraY=cameraTarget;
 cam.setAttribute('transform',`translate(0 ${450-cameraY})`);
}
let rendered=-1;
function renderEvent(i){
 if(i===rendered)return;rendered=i;
 const e=events[i];
 $('#scene-date').textContent=e.date.replace('2026-','2026 / ').replace(/-(\d{2})$/,' / $1');
 const title=$('#scene-title');title.replaceChildren(...[...new Intl.Segmenter('zh-CN',{granularity:'word'}).segment(e.title)].map(({segment})=>{const word=document.createElement('span');word.className='title-word';word.textContent=segment;return word;}));
 $('#scene-summary').textContent=e.summary;
 $('#scene-open').href=`/posts/${e.id.toLowerCase()}/`;
 $('#event-identity').innerHTML=identity(i);
 $('#current-count').textContent=String(i+1).padStart(2,'0')+' / '+events.length;
 $('#previous').disabled=i===0;$('#next').disabled=i===events.length-1;
 document.querySelectorAll('.month-nav button').forEach(b=>{const active=Number(b.dataset.month)===Number(e.date.slice(5,7));b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','date');else b.removeAttribute('aria-current');});
}
function update(){
 const len=lerp(lengths[0],trackLength,state.v);
 track.style.strokeDashoffset=trackLength-len;
 const pt=track.getPointAtLength(len);
 tip.setAttribute('transform',`translate(${pt.x} ${pt.y})`);
 // Camera descends in one continuous coordinate space; no horizontal travel.
 cameraTarget=pt.y;
 if(Math.abs(cameraTarget-cameraY)>170)cameraY=cameraTarget-Math.sign(cameraTarget-cameraY)*170;
 current=lengths.reduce((best,l,i)=>Math.abs(l-len)<Math.abs(lengths[best]-len)?i:best,0);
 renderEvent(current);
 // Continuous shared-axis fade-through. Content changes only at zero opacity.
 const spacing=current===events.length-1?lengths[current]-lengths[current-1]:lengths[current+1]-lengths[current];
 const offset=(len-lengths[current])/spacing;
 const fade=(start,end)=>{const t=clamp((Math.abs(offset)-start)/(end-start),0,1);return 1-t*t*(3-2*t);};
 const copy=$('.event-copy'),identityEl=$('.event-identity');
 copy.style.opacity=fade(.10,.49);
 copy.style.transform=`translateY(${-offset*72}px)`;
 identityEl.style.opacity=fade(.04,.48);
 identityEl.style.transform=`translateY(${-offset*100}px) scale(${1-Math.abs(offset)*.035})`;
 $('#scene-open').tabIndex=Math.abs(offset)<.4?0:-1;
 nodes.forEach((n,i)=>n.style.opacity=i===current?0:1);
}
renderEvent(0);
function go(i,immediate=false){
 i=clamp(i,0,events.length-1);
 if(trigger){
  const progress=(lengths[i]-lengths[0])/(trackLength-lengths[0]);
  const y=trigger.start+progress*(trigger.end-trigger.start);
  navigating=true;
  const stage=$('.event-stage');
  gsap.killTweensOf(stage);
  const far=Math.abs(i-current)>3&&!immediate;
  gsap.to(stage,{opacity:far?0:1,duration:immediate?0:.16});
  lenis?.resize();
  if(lenis)lenis.scrollTo(y,{immediate,force:true,duration:Math.min(1.9,.95+Math.abs(i-current)*.045),easing:t=>1-Math.pow(1-t,3),onComplete:()=>{navigating=false;if(far)gsap.to(stage,{opacity:1,duration:.45,delay:.18});}});
  else window.scrollTo({top:y,behavior:immediate?'instant':'smooth'});
  if(immediate){ScrollTrigger.update();trigger.getTween()?.progress(1);trigger.animation.progress(progress);cameraY=cameraTarget;updateAtmosphere();navigating=false;}
 }else document.getElementById(`mobile-${events[i].id}`).scrollIntoView({behavior:reduced||immediate?'instant':'smooth',block:'start'});
}

const mm=gsap.matchMedia();
mm.add(wideQuery,()=>{
 // Lenis setup copied from the reference, using package imports.
 lenis=new Lenis({lerp:.085,smoothWheel:true,wheelMultiplier:.95});
 lenis.on('scroll',ScrollTrigger.update);
 const tick=t=>{lenis.raf(t*1000);updateAtmosphere();};gsap.ticker.add(tick);gsap.ticker.lagSmoothing(0);
 const tween=gsap.fromTo(state,{v:0},{v:1,ease:'none',onUpdate:update,scrollTrigger:{trigger:'.tl-pin',start:'top top',end:()=>'+='+innerHeight*events.length*.85,pin:true,scrub:.65,snap:{snapTo:(value,self)=>navigating?value:ScrollTrigger.snapDirectional(lengths.map(l=>(l-lengths[0])/(trackLength-lengths[0])))(value,self.direction),delay:.28,duration:{min:.25,max:.6},inertia:false},anticipatePin:1,invalidateOnRefresh:true,onRefresh:update}});
 trigger=tween.scrollTrigger;update();
 return()=>{trigger=null;gsap.ticker.remove(tick);lenis.destroy();lenis=null;};
});

document.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]')||!trigger)return;if(e.key==='ArrowDown'){e.preventDefault();go(current+1);}if(e.key==='ArrowUp'){e.preventDefault();go(current-1);}});
$('#previous').onclick=()=>go(current-1);$('#next').onclick=()=>go(current+1);
$('.month-nav').innerHTML=[...new Set(events.map(e=>Number(e.date.slice(5,7))))].map(month=>`<button data-month="${month}" aria-label="跳转到 ${month} 月"><i aria-hidden="true"></i><span>${String(month).padStart(2,'0')} 月</span></button>`).join('');
rendered=-1;renderEvent(current);
$('.month-nav').onclick=e=>{const b=e.target.closest('[data-month]');if(b)go(events.findIndex(ev=>Number(ev.date.slice(5,7))===Number(b.dataset.month)));};

const indexDialog=$('#index-dialog');
function syncLock(){const open=document.querySelector('dialog[open]');if(open)lenis?.stop();else lenis?.start();}
function showIndex(){indexDialog.showModal();syncLock();}
$('#index-open').onclick=showIndex;
function renderIndex(query=''){
 const filtered=events.filter(e=>`${e.date} ${e.title} ${e.summary}`.toLowerCase().includes(query.toLowerCase()));
 $('.event-index').innerHTML=filtered.length?filtered.map(e=>`<li><button data-jump="${e.index}"><time>${esc(e.date.replace('2026-',''))}</time><span>${esc(e.title)}</span><span aria-hidden="true">↗</span></button></li>`).join(''):'<li class="empty">没有找到相关事件</li>';
}
renderIndex();$('#search').oninput=e=>renderIndex(e.target.value);
$('.event-index').onclick=e=>{const b=e.target.closest('[data-jump]');if(b){indexDialog.close();syncLock();go(Number(b.dataset.jump));}};
// Keep the exact timeline position when opening a standalone article.
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="/posts/"]');if(a)sessionStorage.setItem('timeline-position',JSON.stringify({index:Number(a.dataset.event??current),scroll:scrollY}));});
indexDialog.querySelector('[data-close]').onclick=()=>indexDialog.close();
indexDialog.addEventListener('click',e=>{if(e.target===indexDialog){const r=indexDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)indexDialog.close();}});
indexDialog.addEventListener('close',syncLock);
window.addEventListener('pageshow',e=>{if(e.persisted){lenis?.start();ScrollTrigger.refresh();}});
document.querySelectorAll('a[href="#journey"],a[href="#"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const y=a.getAttribute('href')==='#'?0:$('#journey').getBoundingClientRect().top+scrollY;if(lenis)lenis.scrollTo(y);else window.scrollTo({top:y,behavior:reduced?'instant':'smooth'});}));
document.fonts.ready.then(()=>{
 ScrollTrigger.refresh();
 const saved=sessionStorage.getItem('timeline-position');
 const returning=sessionStorage.getItem('timeline-return')||performance.getEntriesByType('navigation')[0]?.type==='back_forward';
 if(saved&&returning){sessionStorage.removeItem('timeline-return');try{const value=JSON.parse(saved);if(trigger)go(value.index,true);else window.scrollTo({top:value.scroll,behavior:'instant'});}catch{}}
});

// Manual input cancels a long navigation reveal; resizing preserves the event.
window.addEventListener('wheel',()=>{if(navigating){navigating=false;gsap.to($('.event-stage'),{opacity:1,duration:.2});}},{passive:true});
let resizeTimer, resizeIndex;
window.addEventListener('resize',()=>{if(resizeIndex===undefined)resizeIndex=current;clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{ScrollTrigger.refresh();go(resizeIndex,true);resizeIndex=undefined;},250);});
