const panel=document.getElementById('archive-panel');
const open=document.getElementById('archive-open');
const close=document.getElementById('archive-close');
function setOpen(value){panel.classList.toggle('is-open',value);open.setAttribute('aria-expanded',String(value));document.body.classList.toggle('archive-open',value);if(value){panel.removeAttribute('inert');close.focus();}else open.focus();}
open.addEventListener('click',()=>setOpen(!panel.classList.contains('is-open')));
close.addEventListener('click',()=>setOpen(false));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel.classList.contains('is-open'))setOpen(false);if(e.key==='Tab'&&panel.classList.contains('is-open')){const focusable=[...panel.querySelectorAll('button,summary,a[href]')].filter(e=>e.getClientRects().length);const first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
document.querySelectorAll('[data-home-return]').forEach(a=>a.addEventListener('click',()=>sessionStorage.setItem('timeline-return','1')));
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=document.getElementById(decodeURIComponent(a.hash.slice(1)));if(!target)return;e.preventDefault();target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});history.replaceState(null,'',a.hash);}));
