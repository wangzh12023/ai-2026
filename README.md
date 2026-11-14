# AI 2026

24 个主事件的竖向时间线，以及各自的独立文章页。白色背景、Google 四色轨迹，品牌图标使用现成资产。

```sh
npm ci
npm run dev
```

预览地址：`http://localhost:5173`。`npm run build` 生成 `dist/`，可部署到支持静态网站的服务器。Node.js 22.12+。

## 编辑内容

- 首页日期、标题、摘要：`src/events.json`。
- 文章正文：`src/content/posts/` 中对应的 Markdown。已建立 24 个空白章节骨架，没有补写事件新闻。
- 二、三级标题自动生成文章右侧目录；左侧按月份、事件排列。
- 文件名决定路由，请保留；修改正文不需要调整页面代码。
- 本地原稿导入工具：`node scripts/content.mjs`，仅适用于同时持有原始稿件的工作目录，不会覆盖文章正文。

正文支持 Markdown 段落、链接、图片、引用、表格及代码块。文章沿用首页字体与配色。添加图片时填写替代文本，图片放入 `public/` 后使用 `/图片文件名` 引用。

## 动画与导航

滚轮、上下按钮、月份和事件索引共用同一条滚动路径。文字与图标按路径距离渐隐、渐入，轻微同向位移；停止后吸附到阅读节点。小球使用半透明渐变，镜头稍后跟随并缓缓追平。长距离跳转时暂隐正文，避免中间标题连续闪烁。

文章链接是普通 URL，支持直接打开和刷新。返回时间线会恢复阅读位置。章节链接平滑滚动，目录自动高亮。手机和系统“减少动态效果”模式使用自然滚动列表。

## 复用与来源

- [EmiraIT — Scroll-Drawn SVG Timeline](https://codepen.io/sainul/pen/bNqMpXq)：原作者标明 MIT。原始 JS 保存在 `references/scroll-drawn-timeline.js`；辅助函数直接提取，保留 SVG 路径绘制、路径点取样、摄像机变换、GSAP ScrollTrigger 与 Lenis 的结构，调整为竖向单事件阅读。
- [AstroSage](https://github.com/chintak/astro-sage)：MIT。`TableOfContents.astro` 和 `sage-prose.css` 直接复用；调整中文标签、字体色彩变量、固定页眉偏移，以及页底目录高亮。原许可证见 `references/licenses/ASTROSAGE-MIT.txt`。
- [Thibaud Frere — Research Article Template](https://github.com/tfrere/research-article-template)（CC BY 4.0）及其[展示站](https://tfrere-research-article-template-site.hf.space/)：侧边导航视觉参考。使用短线标记、当前项展开及紧凑层级；未复制展示站完整源码。
- [Google AI Journey](https://ai.google/our-ai-journey/)：白底、四色及留白参考，未使用其业务源码或插画。
- [Material 同轴过渡](https://m2.material.io/design/motion/the-motion-system.html)、[运动机制](https://m3.material.io/styles/motion/overview/how-it-works)：关联内容的同向位移、淡入淡出与跟随节奏参考。网页实现使用 GSAP 与 Lenis。
- [Lobe Icons](https://github.com/lobehub/lobe-icons)（MIT）、[Simple Icons](https://simpleicons.org/)（CC0）及品牌官网资产：图标直接本地使用，来源和许可见 [public/icons/SOURCES.md](public/icons/SOURCES.md)。品牌标识归各自持有人。

图标无运行时 CDN。`node scripts/icons.mjs` 提取依赖库图标，`node scripts/fetch-icons.mjs` 下载已确认的官网资产。

## 验证

先启动开发服务，再执行：

```sh
npm run check:browser
```

使用本机 Google Chrome。检查动画中间帧的文字/图标透明度、小球屏幕位移、月份和上下按钮的连续滚动、缩放后事件保留、24 个文章路由、两侧目录、章节滚动、返回位置、手机布局与减少动态效果。截图与运动采样保存在脚本输出的临时目录。

内容沿用用户提供的本地事件清单，此项目未重新核验事件事实。原始编辑稿不包含在仓库内。
