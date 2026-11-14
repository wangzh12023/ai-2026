import fs from 'node:fs';
const selected=fs.readFileSync('2026-AI大事件-精选.md','utf8').split('## 二、')[0];
const wiki=fs.readFileSync('2026-AI大事件回顾.md','utf8');
const records=[...wiki.matchAll(/### (E-[^\n]+)\n([\s\S]*?)(?=\n### |$)/g)].map(m=>Object.fromEntries([...m[2].matchAll(/^\| (\w+) \| (.*?) \|/gm)].map(x=>[x[1],x[2]])));
const events=[...selected.matchAll(/^\| (2026[^|]+) \| (.*?) \| (.*?) \|/gm)].map((m,i)=>{const date=m[1].trim();const record=records.find(r=>r.date?.startsWith(date.slice(0,10)));return {id:record?.id||`event-${i+1}`,date,title:m[2],summary:m[3],index:i};});
fs.writeFileSync('src/events.json',JSON.stringify(events,null,2)+'\n');
console.log(`Imported ${events.length} main events`);
