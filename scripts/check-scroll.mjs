import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const browser=await chromium.launch({channel:'chrome',headless:true});
const base=process.env.TEST_URL||'http://localhost:5173';
const count=page=>page.locator('#current-count').textContent();
const waitCount=(page,n)=>page.waitForFunction(n=>document.querySelector('#current-count').textContent===`${String(n).padStart(2,'0')} / 24`,n);
async function scenario(run){
 const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{await page.goto(base);await waitCount(page,1);await page.waitForTimeout(500);await run(page);assert.deepEqual(errors,[]);}finally{await page.close();}
}
try{
 await scenario(async page=>{
  for(let i=0;i<18;i++){await page.mouse.wheel(0,900-i*40);await page.waitForTimeout(65);}
  assert.equal(await count(page),'02 / 24','one decaying inertia tail stays at the next event');
  await page.waitForTimeout(140);
  for(const delta of [1200,900,600,300]){await page.mouse.wheel(0,delta);await page.waitForTimeout(70);}
  await waitCount(page,3);
  // Reverse immediately: no click, focus change or long pause to unlock input.
  await page.mouse.wheel(0,-1400);await waitCount(page,2);
 });
 await scenario(async page=>{
  for(let i=0;i<30;i++){await page.mouse.wheel(0,300);await page.waitForTimeout(65);}
  assert.ok(Number((await count(page)).slice(0,2))>=3,'deliberate sustained wheel input continues through nodes');
 });
 console.log('Passed: decaying inertia remains bounded; a renewed push after 140ms, immediate reversal, and sustained wheel input all continue without any click.');
}finally{await browser.close();}
