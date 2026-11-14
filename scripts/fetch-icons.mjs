import fs from 'node:fs/promises';
const assets={
 'openclaw-official.svg':'https://openclaw.ai/brand/openclaw-mascot.svg',
 'unitree-official.svg':'https://www.unitree.com/images/0079f8938336436e955ea3a98c4e1e59.svg',
 'material-policy.svg':'https://raw.githubusercontent.com/google/material-design-icons/master/symbols/web/policy/materialsymbolsrounded/policy_48px.svg',
 'europe.svg':'https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Europe.svg',
};
for(const [name,url] of Object.entries(assets)){
 const response=await fetch(url,{headers:{'User-Agent':'AI2026/1.0 (local asset download)'},signal:AbortSignal.timeout(20000)});
 if(!response.ok)throw new Error(`${name}: ${response.status}`);
 const svg=await response.text();
 if(!svg.includes('<svg')||svg.includes('<html'))throw new Error(`Invalid SVG: ${name}`);
 await fs.writeFile(`public/icons/${name}`,svg);console.log(name,url);
}
