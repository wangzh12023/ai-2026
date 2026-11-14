import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import events from './events.json';
import {eventText,language,t,dateText,monthText} from './locale';
import { clamp, lerp, sv } from './motion-helpers';


// Adapted from EmiraIT's MIT Scroll-Drawn SVG Timeline.
// Preserves SVG camera transforms, path-tip drawing, ScrollTrigger scrubbing,
// matchMedia lifecycle and Lenis/GSAP ticker integration. See references/.
document.documentElement.classList.add('js');
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });
const $ = s => document.querySelector(s);
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const wideQuery='(min-width:900px) and (min-height:500px) and (prefers-reduced-motion:no-preference)';
let trigger, lenis, current=0, navigating=false, cameraY=450, lockedUntil=0;
const state={v:0};
const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
// Unmodified brand assets from Lobe Icons and Simple Icons. No decorative artwork.
const logoNames={0:['material-policy'],1:['siApple','gemini-color'],2:['openclaw-official'],3:['bytedance-color'],4:['zhipu-color','qwen-color','bytedance-color'],5:['openclaw-official'],6:['openai','openclaw-official'],7:['anthropic'],8:['meta-color','openclaw-official'],9:['nvidia-color'],10:['siApple','openclaw-official'],11:['nvidia-color'],12:['claude-color'],13:['deepseek-color'],14:['sora-color'],15:['openai'],16:['anthropic'],17:['material-policy'],18:['openai','huggingface-color'],19:['material-policy'],20:['kimi-color'],21:['bytedance-color'],22:['europe'],23:['claude-color'],24:['siGithub'],25:['unitree-official'],26:['meta-color','openai','anthropic'],27:['openai'],28:['gemini-color'],29:['openai'],30:['openai'],31:['material-policy'],32:['baidu-color'],33:['nvidia-color']};
function identity(i){
 if(logoNames[i])return logoNames[i].map(name=>`<img src="${baseUrl}icons/${name}.svg" alt="" class="brand-mark ${name}"/>`).join('');
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
// A short flat stroke leads the line; no sphere, bloom or simulated material.
const leadGradient=sv('linearGradient',{id:'line-lead',gradientUnits:'userSpaceOnUse'},defs);
[[0,0],[.45,.3],[1,.95]].forEach(([offset,opacity])=>sv('stop',{offset,'stop-color':'#6493e8','stop-opacity':opacity},leadGradient));
const lead=sv('path',{fill:'none',stroke:'url(#line-lead)','stroke-width':3.6,'stroke-linecap':'round'},tip);
let flow=0, cameraTarget=450, travelLength=lengths[0], travelDirection=1;
function updateAtmosphere(){
 flow=lerp(flow,Math.min(Math.abs(lenis?.velocity||0)/45,1),.08);
 const pt=track.getPointAtLength(travelLength), segment=24+flow*32;
 const tail=track.getPointAtLength(clamp(travelLength-travelDirection*segment,0,trackLength));
 leadGradient.setAttribute('x1',tail.x-pt.x);leadGradient.setAttribute('y1',tail.y-pt.y);
 leadGradient.setAttribute('x2',0);leadGradient.setAttribute('y2',0);
 const points=Array.from({length:7},(_,i)=>{const p=track.getPointAtLength(clamp(travelLength-travelDirection*segment*(1-i/6),0,trackLength));return `${i?'L':'M'}${p.x-pt.x} ${p.y-pt.y}`;});
 lead.setAttribute('d',points.join(' '));
 const diff=cameraTarget-cameraY;
 cameraY+=clamp(diff,-150,150)*(1-Math.pow(1-.16,gsap.ticker.deltaRatio(60)));
 if(Math.abs(diff)<.05)cameraY=cameraTarget;
 cam.setAttribute('transform',`translate(0 ${450-cameraY})`);
}
let rendered=-1;
function renderEvent(i){
 if(i===rendered)return;rendered=i;
 const e=eventText(events[i]);
 $('#scene-date').textContent=language()==='en'?dateText(e.date):e.date.replace('2026-','2026 / ').replace(/-(\d{2})$/,' / $1');
 const title=$('#scene-title');if(language()==='en')title.textContent=e.title;else title.replaceChildren(...[...new Intl.Segmenter('zh-CN',{granularity:'word'}).segment(e.title)].map(({segment})=>{const word=document.createElement('span');word.className='title-word';word.textContent=segment;return word;}));
 $('#scene-summary').textContent=e.summary;
 $('#scene-open').href=`${baseUrl}posts/${e.id.toLowerCase()}/`;
 $('#event-identity').innerHTML=identity(i);
 $('#current-count').textContent=String(i+1).padStart(2,'0')+' / '+events.length;
 $('#previous').disabled=i===0;$('#next').disabled=i===events.length-1;
 document.querySelectorAll('.month-nav button').forEach(b=>{const active=Number(b.dataset.month)===Number(e.date.slice(5,7));b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','date');else b.removeAttribute('aria-current');});
}
function update(){
 const len=lerp(lengths[0],trackLength,state.v);
 track.style.strokeDashoffset=trackLength-len;
 if(Math.abs(len-travelLength)>.05)travelDirection=Math.sign(len-travelLength);
 travelLength=len;
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
 copy.style.opacity=fade(.20,.50);
 copy.style.transform=`translateY(${-offset*72}px)`;
 identityEl.style.opacity=fade(.14,.50);
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
  const duration=Math.min(1.8,.82+Math.abs(i-current)*.045);
  lockedUntil=immediate?0:performance.now()+duration*1000+300;
  const stage=$('.event-stage');
  gsap.killTweensOf(stage);
  const far=Math.abs(i-current)>3&&!immediate;
  gsap.to(stage,{opacity:far?0:1,duration:immediate?0:.16});
  lenis?.resize();
  if(lenis)lenis.scrollTo(y,{immediate,force:true,duration,easing:gsap.parseEase('power2.inOut'),onComplete:()=>{navigating=false;if(far)gsap.to(stage,{opacity:1,duration:.45,delay:.18});}});
  else window.scrollTo({top:y,behavior:immediate?'instant':'smooth'});
  if(immediate){ScrollTrigger.update();trigger.getTween()?.progress(1);trigger.animation.progress(progress);cameraY=cameraTarget;updateAtmosphere();navigating=false;}
 }else document.getElementById(`mobile-${events[i].id}`).scrollIntoView({behavior:reduced||immediate?'instant':'smooth',block:'start'});
}

const mm=gsap.matchMedia();
mm.add(wideQuery,()=>{
 // Preserve free scrubbing; only cap a single wheel gesture to adjacent nodes.
 let gestureActive=false,gestureAnchor=0,gestureTimer,lastWheel=0,lastDelta=0,cappedSince=0;
 const scrollAt=i=>trigger.start+(lengths[i]-lengths[0])/(trackLength-lengths[0])*(trigger.end-trigger.start);
 lenis=new Lenis({lerp:.12,smoothWheel:true,wheelMultiplier:1,virtualScroll:data=>{
  if(!trigger||!data.event.type.includes('wheel')||data.event.ctrlKey||data.event.metaKey||Math.abs(data.deltaX)>Math.abs(data.deltaY))return;
  const now=performance.now(),delta=data.deltaY,magnitude=Math.abs(delta);
  const reversed=delta*lastDelta<0;
  const renewed=magnitude>Math.abs(lastDelta)*1.35&&magnitude-Math.abs(lastDelta)>12;
  const sustained=cappedSince&&now-cappedSince>180&&current!==gestureAnchor&&Math.abs(lenis.animatedScroll-scrollAt(current))<8&&magnitude>=8&&Math.abs(magnitude-Math.abs(lastDelta))<.5;
  // New pushes, reversals and deliberate steady wheel input re-arm without a click.
  // A decaying touchpad tail keeps its original bound instead of skipping events.
  if(!gestureActive||now-lastWheel>160||reversed||renewed||sustained||navigating){
   gestureActive=true;gestureAnchor=current;cappedSince=0;
   const snapping=trigger.getTween(true);if(snapping){snapping.kill();lenis.reset();}
   if(navigating){navigating=false;lenis.reset();gsap.to($('.event-stage'),{opacity:1,duration:.2});}
  }
  lastWheel=now;lastDelta=delta;
  clearTimeout(gestureTimer);gestureTimer=setTimeout(()=>{gestureActive=false;cappedSince=0;},340);
  const low=scrollAt(Math.max(0,gestureAnchor-1)),high=scrollAt(Math.min(events.length-1,gestureAnchor+1));
  const proposed=lenis.targetScroll+delta,bounded=clamp(proposed,low,high);
  if(Math.abs(proposed-bounded)>.01){if(!cappedSince)cappedSince=now;}else cappedSince=0;
  data.deltaY=bounded-lenis.targetScroll;
  if(Math.abs(data.deltaY)<.01){if(data.event.cancelable)data.event.preventDefault();return false;}
 }});
 lenis.on('scroll',ScrollTrigger.update);
 const tick=t=>{lenis.raf(t*1000);updateAtmosphere();};gsap.ticker.add(tick);gsap.ticker.lagSmoothing(0);
 const tween=gsap.fromTo(state,{v:0},{v:1,ease:'none',onUpdate:update,scrollTrigger:{trigger:'.tl-pin',start:'top top',end:()=>'+='+innerHeight*events.length*.85,pin:true,scrub:.38,snap:{snapTo:value=>navigating||gestureActive?value:gsap.utils.snap(lengths.map(l=>(l-lengths[0])/(trackLength-lengths[0])),value),delay:.28,duration:{min:.65,max:.95},ease:'power2.inOut',directional:false,inertia:false},anticipatePin:1,invalidateOnRefresh:true,onRefresh:update}});
 trigger=tween.scrollTrigger;update();
 return()=>{clearTimeout(gestureTimer);trigger=null;gsap.ticker.remove(tick);lenis.destroy();lenis=null;};
});

document.addEventListener('keydown',e=>{
 if(!trigger||e.target.closest('a,button,input,textarea')||e.ctrlKey||e.metaKey||e.altKey)return;
 const direction=['ArrowDown','PageDown',' '].includes(e.key)?1:['ArrowUp','PageUp'].includes(e.key)?-1:0;
 if(direction||e.key==='Home'||e.key==='End'){e.preventDefault();if(performance.now()<lockedUntil)return;go(e.key==='Home'?0:e.key==='End'?events.length-1:current+direction);}
});
$('#previous').onclick=()=>go(current-1);$('#next').onclick=()=>go(current+1);
$('.month-nav').innerHTML=[...new Set(events.map(e=>Number(e.date.slice(5,7))))].map(month=>`<button data-month="${month}" aria-label="${monthText(String(month).padStart(2,'0'))}"><i aria-hidden="true"></i><span>${monthText(String(month).padStart(2,'0'))}</span></button>`).join('');
rendered=-1;renderEvent(current);
$('.month-nav').onclick=e=>{const b=e.target.closest('[data-month]');if(b)go(events.findIndex(ev=>Number(ev.date.slice(5,7))===Number(b.dataset.month)));};

// Keep the exact timeline position when opening a standalone article.
document.addEventListener('click',e=>{const a=e.target.closest(`a[href^="${baseUrl}posts/"],a[href="${baseUrl}blog/"],a[href^="/posts/"],a[href="/blog/"]`);if(a)sessionStorage.setItem('timeline-position',JSON.stringify({index:Number(a.dataset.event??current),scroll:scrollY}));});
window.addEventListener('pageshow',e=>{if(e.persisted){lenis?.start();ScrollTrigger.refresh();}});
document.querySelectorAll('a[href="#journey"],a[href="#"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const y=a.getAttribute('href')==='#'?0:$('#journey').getBoundingClientRect().top+scrollY;if(lenis)lenis.scrollTo(y);else window.scrollTo({top:y,behavior:reduced?'instant':'smooth'});}));
document.fonts.ready.then(()=>{
 ScrollTrigger.refresh();
 const saved=sessionStorage.getItem('timeline-position');
 const returning=sessionStorage.getItem('timeline-return')||performance.getEntriesByType('navigation')[0]?.type==='back_forward';
 if(saved&&returning){sessionStorage.removeItem('timeline-return');try{const value=JSON.parse(saved);if(trigger)go(value.index,true);else window.scrollTo({top:value.scroll,behavior:'instant'});}catch{}}
});

// Resizing preserves the selected event.
let resizeTimer, resizeIndex;
window.addEventListener('resize',()=>{if(resizeIndex===undefined)resizeIndex=current;clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{ScrollTrigger.refresh();go(resizeIndex,true);resizeIndex=undefined;},250);});

document.addEventListener('site:language',()=>{rendered=-1;renderEvent(current);document.querySelectorAll('.month-nav button').forEach(button=>{const label=monthText(String(button.dataset.month).padStart(2,'0'));button.querySelector('span').textContent=label;button.setAttribute('aria-label',label);});ScrollTrigger.refresh();});
