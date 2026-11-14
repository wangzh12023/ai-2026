import events from './events.json';
import english from './locales/en.json';
export const language=()=>document.documentElement.lang.startsWith('en')?'en':'zh';
const messages={
 zh:{skip:'跳至正文',home:'时间线首页',navigation:'主导航',language:'Switch to English',light:'切换为浅色',dark:'切换为深色',archive:'月份与事件',close:'关闭',github:'GitHub 源码',previous:'上一事件',next:'下一事件',read:'阅读事件',contents:'本文目录',backTop:'回到顶部',timeline:'2026 年主事件时间线',months:'按月份浏览',events:'按时间浏览事件',pagination:'相邻事件'},
 en:{skip:'Skip to content',home:'Timeline home',navigation:'Main navigation',language:'切换为中文',light:'Switch to light appearance',dark:'Switch to dark appearance',archive:'Browse events by month',close:'Close',github:'Source on GitHub',previous:'Previous event',next:'Next event',read:'Read event',contents:'On this page',backTop:'Back to top',timeline:'2026 AI event timeline',months:'Browse by month',events:'Browse events chronologically',pagination:'Adjacent events'}
};
export const t=key=>messages[language()][key]||key;
export const eventText=e=>language()==='en'?{...e,...english[e.id]}:e;
export const eventById=id=>eventText(events.find(e=>e.id===id));
export function monthText(month){return language()==='en'?new Intl.DateTimeFormat('en',{month:'short',timeZone:'UTC'}).format(new Date(Date.UTC(2026,Number(month)-1,1))):`${month} 月`;}
export function dateText(date,compact=false){
 if(language()==='zh')return compact?date.slice(5):date;
 const month=monthText(date.slice(5,7));
 if(date.includes('上旬'))return `Early ${month}${compact?'':' 2026'}`;
 const day=Number(date.slice(8,10));
 return `${date.includes('起')?'From ':''}${month} ${day}${compact?'':', 2026'}`;
}

export function dayText(date){return language()==='zh'?(date.slice(8)||'—'):date.includes('上旬')?'early':date.slice(8,10)+(date.includes('起')?'+':'');}
