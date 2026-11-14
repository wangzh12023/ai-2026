import {language,t,eventById,monthText,dateText,dayText} from './locale';
const root=document.documentElement;
const read=key=>{try{return localStorage.getItem(key);}catch{return null;}};
const save=(key,value)=>{try{localStorage.setItem(key,value);}catch{}};
function applyLanguage(){
 document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));
 document.querySelectorAll('[data-i18n-aria]').forEach(el=>el.setAttribute('aria-label',t(el.dataset.i18nAria)));
 document.querySelectorAll('[data-event-title]').forEach(el=>el.textContent=eventById(el.dataset.eventTitle).title);
 document.querySelectorAll('[data-event-summary]').forEach(el=>el.textContent=eventById(el.dataset.eventSummary).summary);
 document.querySelectorAll('[data-event-date]').forEach(el=>el.textContent=dateText(el.dataset.eventDate,el.hasAttribute('data-compact-date')));
 document.querySelectorAll('[data-event-day]').forEach(el=>el.textContent=dayText(el.dataset.eventDay));
 document.querySelectorAll('[data-month-text]').forEach(el=>el.textContent=monthText(el.dataset.monthText));
 const sections={'事件起点':'Background','经过':'What happened','关键节点':'Key moments','后续':'What followed','参考资料':'Sources'};
 document.querySelectorAll('#article :is(h2,h3),.toc a').forEach(el=>{el.dataset.originalText??=el.textContent.trim();const original=el.dataset.originalText;el.textContent=language()==='en'?(sections[original]||original):original;});
 const switcher=document.getElementById('language-toggle');switcher.setAttribute('aria-label',t('language'));switcher.title=t('language');switcher.setAttribute('aria-pressed',String(language()==='en'));
 document.querySelectorAll('[data-i18n-aria]').forEach(el=>{if(el.matches('button,.icon-button,.brand'))el.title=el.getAttribute('aria-label');});
 const id=document.querySelector('.article-title h1')?.dataset.eventTitle;
 document.title=id?`${eventById(id).title} · AI 2026`:root.classList.contains('blog-page')?'Blog · AI 2026':language()==='en'?'AI 2026 · A timeline':'2026 · AI 纪事';
 const meta=document.querySelector('meta[name="description"]');if(meta)meta.content=id?eventById(id).summary:language()==='en'?'A timeline of AI events in 2026.':'2026 年人工智能主事件时间线';
 document.dispatchEvent(new CustomEvent('site:language'));
 updateThemeButton();
}
function updateThemeButton(){const button=document.getElementById('theme-toggle');const dark=root.dataset.theme==='dark';button.setAttribute('aria-pressed',String(dark));button.setAttribute('aria-label',t(dark?'light':'dark'));button.title=t(dark?'light':'dark');}
function applyTheme(theme){root.dataset.theme=theme;document.querySelector('meta[name="theme-color"]').content=theme==='dark'?'#17191c':'#ffffff';updateThemeButton();}
document.getElementById('language-toggle').addEventListener('click',()=>{root.lang=language()==='zh'?'en':'zh-CN';save('ai-language',language());applyLanguage();});
document.getElementById('theme-toggle').addEventListener('click',()=>{const theme=root.dataset.theme==='dark'?'light':'dark';save('ai-theme',theme);applyTheme(theme);});
matchMedia('(prefers-color-scheme:dark)').addEventListener('change',event=>{if(!read('ai-theme'))applyTheme(event.matches?'dark':'light');});
applyLanguage();applyTheme(root.dataset.theme||'light');
