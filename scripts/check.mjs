import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { chromium } from '@playwright/test';
const base=process.env.TEST_URL||'http://localhost:5173';
const artifacts=await fs.mkdtemp(path.join(os.tmpdir(),'ai-2026-review-'));
const events=JSON.parse(await fs.readFile(new URL('../src/events.json',import.meta.url)));
const m11Count = events.findIndex(e => e.date.slice(5, 7) === '11') + 1;
const m3Count = events.findIndex(e => e.date.slice(5, 7) === '03') + 1;
const claudeCodeIndex = events.findIndex(e => e.id === 'e-20260331-claude-code-leak');
const claudeCodeCount = claudeCodeIndex + 1;

const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900},recordVideo:{dir:artifacts,size:{width:1440,height:900}}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const settle=async count=>{await page.waitForFunction((opt)=>document.querySelector('#current-count')?.textContent===`${String(opt.n).padStart(2,'0')} / ${opt.total}`&&Number(getComputedStyle(document.querySelector('.event-copy')).opacity)>.99&&Number(getComputedStyle(document.querySelector('.event-stage')).opacity)>.99&&Math.abs(document.querySelector('.tl-cam>g:last-child').transform.baseVal.consolidate().matrix.f-Number(document.querySelectorAll('.tl-cam>circle')[opt.n-1].getAttribute('cy')))<3,{n:count,total:events.length});await page.waitForTimeout(700);};
 await page.goto(base);await settle(1);
 assert.equal(await page.locator('#scene-title').textContent(),events[0].title);
 assert.equal(await page.locator('#index-dialog,#index-open').count(),0);
 assert.equal(await page.locator('#orb-fill').count(),0);
 await page.screenshot({path:path.join(artifacts,'home.png')});
 // Sample real frames: fade, camera follow, and traveler must all move continuously.
 await page.evaluate(()=>{window.motionSamples=[];let n=0;const tick=()=>{const el=document.querySelector('.tl-cam>g:last-child'),svg=document.querySelector('.tl-svg');window.motionSamples.push({opacity:Number(getComputedStyle(document.querySelector('.event-copy')).opacity),icon:Number(getComputedStyle(document.querySelector('.event-identity')).opacity),leadY:el.getBoundingClientRect().y-svg.getBoundingClientRect().y,scroll:scrollY});if(n++<130)requestAnimationFrame(tick);};requestAnimationFrame(tick);});
 await page.locator('#next').click();await settle(2);await page.waitForTimeout(700);
 const frames=await page.evaluate(()=>window.motionSamples);
 assert.ok(frames.some(f=>f.opacity>.05&&f.opacity<.9),'text has intermediate opacity');
 assert.ok(frames.some(f=>f.icon>.05&&f.icon<.9),'brand has intermediate opacity');
 assert.ok(Math.max(...frames.map(f=>f.leadY))-Math.min(...frames.map(f=>f.leadY))>25,'traveler moves down inside viewport');
 assert.ok(frames.filter(f=>f.scroll>5&&f.scroll<700).length>4,'next travels across intermediate scroll positions');
 await fs.writeFile(path.join(artifacts,'motion-samples.json'),JSON.stringify(frames));
 await page.screenshot({path:path.join(artifacts,'second.png')});
 // One long decaying touchpad gesture must not advance through several events.
 for(let i=0;i<24;i++){await page.mouse.wheel(0,1200-i*35);await page.waitForTimeout(65);}
 await settle(3);
 await page.mouse.wheel(0,-2000);await settle(2);
 // Free scrubbing must preserve intermediate positions before gentle release snap.
 const origin=await page.evaluate(()=>scrollY);
 await page.mouse.wheel(0,350);await page.waitForTimeout(220);
 const partial=await page.evaluate(()=>scrollY);
 assert.ok(partial>origin+80&&partial<origin+600,'wheel follows partial input instead of a full-page turn');
 assert.equal(await page.locator('#current-count').textContent(),`02 / ${events.length}`);
 await page.screenshot({path:path.join(artifacts,'partial-scroll.png')});
 await settle(2);
 await page.mouse.wheel(0,510);await settle(3);
 await page.mouse.wheel(1200,0);await page.waitForTimeout(400);assert.equal(await page.locator('#current-count').textContent(),`03 / ${events.length}`);
 await page.locator('body').click({position:{x:700,y:150}});await page.keyboard.press('PageDown');await settle(4);
 await page.keyboard.press('PageUp');await settle(3);
 await page.locator('[data-month="11"]').click();await page.waitForTimeout(120);
 assert.notEqual(await page.locator('#current-count').textContent(),`${String(m11Count).padStart(2,'0')} / ${events.length}`,'month does not teleport');
 await settle(m11Count);
 await page.setViewportSize({width:1000,height:600});await settle(m11Count);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.screenshot({path:path.join(artifacts,'narrow.png')});
 await page.setViewportSize({width:1440,height:900});await settle(m11Count);
 await page.locator('[data-month="3"]').click();await settle(m3Count);
 for(let step=m3Count;step<claudeCodeCount;step++){await page.locator('#next').click();await settle(step+1);}
 await page.locator('#scene-open').click();await page.waitForURL('**/posts/e-20260331-claude-code-leak/');await page.waitForTimeout(500);
 assert.equal(await page.locator('.article-title h1').textContent(),events[claudeCodeIndex].title);
 assert.equal(await page.locator('a[href="/"]').count(),1,'only the wordmark returns home');
 assert.equal(await page.locator('.archive-month a').count(),events.length);
 assert.ok(await page.locator('.toc-rail a').count()>=3);
 assert.equal(await page.locator('.archive-month a[aria-current="page"]').count(),1);
 await page.screenshot({path:path.join(artifacts,'article.png'),fullPage:true});
 const last=page.locator('.toc-rail a').last();await last.click();await page.waitForTimeout(1400);
 assert.equal(await last.getAttribute('aria-current'),'location');
 assert.ok(await page.evaluate(()=>scrollY)>200);
 await page.locator('#back-top').click();await page.waitForTimeout(700);assert.ok(await page.evaluate(()=>scrollY)<100);
 await page.locator('.site-header .brand').click();await page.waitForURL(base+'/');await settle(claudeCodeCount);
 await page.locator('#scene-open').click();await page.waitForURL('**/posts/**');await page.goBack();await settle(claudeCodeCount);
 await page.locator('.header-link').click();await page.waitForURL('**/blog/');await page.waitForTimeout(400);
 assert.equal(await page.locator('.blog-post').count(),events.length);
 assert.equal(await page.locator('.blog-group').count(),11);
 await page.screenshot({path:path.join(artifacts,'blog.png')});
 await page.locator('[data-blog-month="11"]').click();await page.waitForTimeout(800);assert.equal(await page.locator('[data-blog-month="11"]').getAttribute('aria-current'),'location');
 await page.locator('.blog-post').filter({hasText:'Claude Code'}).click();await page.waitForURL('**/posts/e-20260331-claude-code-leak/');
 await page.locator('.site-header .brand').click();await page.waitForURL(base+'/');await settle(claudeCodeCount);
 // Real static links, refreshed directly, including all draft pages.
 for(const e of events){const response=await page.request.get(`${base}/posts/${e.id.toLowerCase()}/`);assert.equal(response.status(),200,e.id);}
 await page.setViewportSize({width:390,height:844});await page.goto(`${base}/posts/e-20260130-openclaw/`);await page.waitForTimeout(400);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.locator('#archive-open').click();assert.equal(await page.locator('#archive-open').getAttribute('aria-expanded'),'true');
 await page.keyboard.press('Escape');assert.equal(await page.locator('#archive-open').getAttribute('aria-expanded'),'false');
 await page.screenshot({path:path.join(artifacts,'article-mobile.png')});
 await page.goto(base+'/blog/');await page.waitForTimeout(400);assert.equal(await page.locator('.blog-post').count(),events.length);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:path.join(artifacts,'blog-mobile.png')});
 await page.goto(base);await page.waitForTimeout(400);assert.equal(await page.locator('.tl-li').count(),events.length);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.screenshot({path:path.join(artifacts,'home-mobile.png')});
 // Language and appearance are full-page preferences, preserved across navigation.
 await page.locator('#language-toggle').click();await page.locator('#theme-toggle').click();
 assert.equal(await page.locator('html').getAttribute('lang'),'en');
 assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
 assert.match(await page.locator('.tl-li h2').nth(1).textContent(),/Apple/);
 await page.locator('.header-link').click();await page.waitForURL('**/blog/');
 assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
 assert.match(await page.locator('.blog-post h3').nth(1).textContent(),/Apple/);
 await page.locator('.blog-post').first().click();await page.waitForURL('**/posts/**');await page.waitForTimeout(400);
 assert.equal(await page.locator('.toc-inline summary').textContent(),'On this page');
 assert.equal(await page.locator('a[href="/"]').count(),1);
 assert.match(await page.locator('.site-header').evaluate(e=>getComputedStyle(e).backgroundColor),/23, 25, 28/);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.screenshot({path:path.join(artifacts,'dark-english-mobile.png')});
 await page.reload();assert.equal(await page.locator('html').getAttribute('lang'),'en');assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
 await page.locator('#language-toggle').click();await page.locator('#theme-toggle').click();
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:1440,height:900});await page.goto(base);assert.equal(await page.locator('.tl-svg').isVisible(),false);assert.equal(await page.locator('.tl-li').count(),events.length);
 assert.deepEqual(errors,[]);
 console.log(`Passed: all tests passed across all ${events.length} events!`);
 console.log('Review artifacts: ' + artifacts);
}finally{await browser.close();}
