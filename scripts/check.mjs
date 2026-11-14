import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { chromium } from '@playwright/test';
const base=process.env.TEST_URL||'http://localhost:5173';
const artifacts=await fs.mkdtemp(path.join(os.tmpdir(),'ai-2026-review-'));
const events=JSON.parse(await fs.readFile(new URL('../src/events.json',import.meta.url)));
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900},recordVideo:{dir:artifacts,size:{width:1440,height:900}}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const settle=async count=>{await page.waitForFunction(n=>document.querySelector('#current-count')?.textContent===`${String(n).padStart(2,'0')} / 24`&&Number(getComputedStyle(document.querySelector('.event-copy')).opacity)>.99&&Number(getComputedStyle(document.querySelector('.event-stage')).opacity)>.99,count);await page.waitForTimeout(700);};
 await page.goto(base);await settle(1);
 assert.equal(await page.locator('#scene-title').textContent(),events[0].title);
 await page.screenshot({path:path.join(artifacts,'home.png')});
 // Sample real frames: fade, camera follow, and traveler must all move continuously.
 await page.evaluate(()=>{window.motionSamples=[];let n=0;const tick=()=>{const el=document.querySelector('.tl-cam>g:last-child'),svg=document.querySelector('.tl-svg');window.motionSamples.push({opacity:Number(getComputedStyle(document.querySelector('.event-copy')).opacity),icon:Number(getComputedStyle(document.querySelector('.event-identity')).opacity),orbY:el.getBoundingClientRect().y-svg.getBoundingClientRect().y,scroll:scrollY});if(n++<130)requestAnimationFrame(tick);};requestAnimationFrame(tick);});
 await page.locator('#next').click();await settle(2);await page.waitForTimeout(700);
 const frames=await page.evaluate(()=>window.motionSamples);
 assert.ok(frames.some(f=>f.opacity>.05&&f.opacity<.9),'text has intermediate opacity');
 assert.ok(frames.some(f=>f.icon>.05&&f.icon<.9),'brand has intermediate opacity');
 assert.ok(Math.max(...frames.map(f=>f.orbY))-Math.min(...frames.map(f=>f.orbY))>25,'traveler moves down inside viewport');
 assert.ok(frames.filter(f=>f.scroll>5&&f.scroll<700).length>4,'next travels across intermediate scroll positions');
 await fs.writeFile(path.join(artifacts,'motion-samples.json'),JSON.stringify(frames));
 await page.screenshot({path:path.join(artifacts,'second.png')});
 await page.locator('[data-month="11"]').click();await page.waitForTimeout(120);
 assert.notEqual(await page.locator('#current-count').textContent(),'22 / 24','month does not teleport');
 await settle(22);
 await page.setViewportSize({width:1000,height:600});await settle(22);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.screenshot({path:path.join(artifacts,'narrow.png')});
 await page.setViewportSize({width:1440,height:900});await settle(22);
 await page.locator('#index-open').click();await page.locator('#search').fill('Claude Code');assert.equal(await page.locator('.event-index li').count(),1);
 await page.locator('[data-jump]').click();await settle(6);
 await page.locator('#scene-open').click();await page.waitForURL('**/posts/e-20260331-claude-code-leak/');await page.waitForTimeout(500);
 assert.equal(await page.locator('.article-title h1').textContent(),events[5].title);
 assert.equal(await page.locator('.archive-month a').count(),24);
 assert.equal(await page.locator('.toc-rail a').count(),5);
 assert.equal(await page.locator('.archive-month a[aria-current="page"]').count(),1);
 await page.screenshot({path:path.join(artifacts,'article.png'),fullPage:true});
 const last=page.locator('.toc-rail a').last();await last.click();await page.waitForTimeout(800);
 assert.equal(await last.getAttribute('aria-current'),'location');
 assert.ok(await page.evaluate(()=>scrollY)>200);
 await page.locator('#back-top').click();await page.waitForTimeout(700);assert.ok(await page.evaluate(()=>scrollY)<100);
 await page.locator('.article-title [data-home-return]').click();await page.waitForURL(base+'/');await settle(6);
 await page.locator('#scene-open').click();await page.waitForURL('**/posts/**');await page.goBack();await settle(6);
 // Real static links, refreshed directly, including all draft pages.
 for(const e of events){const response=await page.request.get(`${base}/posts/${e.id.toLowerCase()}/`);assert.equal(response.status(),200,e.id);}
 await page.setViewportSize({width:390,height:844});await page.goto(`${base}/posts/e-20260130-openclaw/`);await page.waitForTimeout(400);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.locator('#archive-open').click();assert.equal(await page.locator('#archive-open').getAttribute('aria-expanded'),'true');
 await page.keyboard.press('Escape');assert.equal(await page.locator('#archive-open').getAttribute('aria-expanded'),'false');
 await page.screenshot({path:path.join(artifacts,'article-mobile.png')});
 await page.goto(base);await page.waitForTimeout(400);assert.equal(await page.locator('.tl-li').count(),24);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.screenshot({path:path.join(artifacts,'home-mobile.png')});
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:1440,height:900});await page.goto(base);assert.equal(await page.locator('.tl-svg').isVisible(),false);assert.equal(await page.locator('.tl-li').count(),24);
 assert.deepEqual(errors,[]);
 console.log('Passed: text/icon fade frames, rolling orb, smooth next/month/index, resize retention, 24 article routes, both TOCs, smooth anchors, return position/history, mobile, reduced motion, no runtime errors.');console.log('Review artifacts: '+artifacts);
}finally{await browser.close();}
