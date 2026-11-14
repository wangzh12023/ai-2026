import * as icons from 'simple-icons';
import fs from 'node:fs';
const names=['siGithub','siApple','siGooglegemini','siAnthropic','siDeepseek','siNvidia','siHuggingface','siKimi','siMeta','siBaidu'];
fs.mkdirSync('public/icons',{recursive:true});
for(const name of names){const icon=icons[name];fs.writeFileSync(`public/icons/${name}.svg`,icon.svg.replace('<svg ',`<svg fill="#${icon.hex}" `));}
const lobeNames=['gemini-color','openclaw-color','zhipu-color','qwen-color','bytedance-color','anthropic','claude-color','deepseek-color','sora-color','openai','nvidia-color','huggingface-color','kimi-color','meta-color','baidu-color'];
for(const name of lobeNames)fs.copyFileSync(`node_modules/@lobehub/icons-static-svg/icons/${name}.svg`,`public/icons/${name}.svg`);
