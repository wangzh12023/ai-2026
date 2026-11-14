import fs from 'node:fs';

const selected = fs.readFileSync('2026-AI大事件-精选.md', 'utf8').split('## 二、')[0];
const existingEvents = fs.existsSync('src/events.json') ? JSON.parse(fs.readFileSync('src/events.json', 'utf8')) : [];
const events = [...selected.matchAll(/^\| (2026[^|]+) \| (.*?) \| (.*?) \|/gm)].map((m, i) => {
  const date = m[1].trim();
  const title = m[2].trim();
  const summary = m[3].trim();
  const existing = existingEvents[i] || existingEvents.find(e => e.date === date || e.title === title);
  return {
    id: existing?.id || `e-${date.slice(0, 10).replace(/-/g, '')}-event-${i + 1}`,
    date,
    title,
    summary,
    index: i
  };
});

fs.writeFileSync('src/events.json', JSON.stringify(events, null, 2) + '\n');
console.log(`Imported ${events.length} main events`);
