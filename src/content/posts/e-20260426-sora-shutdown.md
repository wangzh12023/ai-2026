---
id: "e-20260426-sora-shutdown"
editorialStyle: reported
---

2026 年 4 月 26 日，OpenAI 在官方博客发布[产品策略更新公告](https://openai.com/index/sora-update-2026/)，宣布关停面向消费者的 Sora Web 独立网页端以及 iOS 和 Android 移动应用。现存的企业级视频生成 API 接口进入维护过渡期，并定于 2026 年 9 月 30 日彻底停止服务。Sora 团队核心研究人员与工程架构被重新整合至多模态基础模型部门，研发重心由独立的消费级生成工具转向支持通用世界模型（World Models）的物理动力学理解。

这项决定标志着生成式视频从 2024 年初引发轰动的独立应用形态，向企业 API、垂直创作工作流及原生多模态基座进行深度收缩。

## 算力成本与单用户经济模型倒挂

Sora 自 2024 年 2 月公布技术演示、并在 2025 年推向公众测试以来，其背后的时空扩散变换器（Diffusion Transformer, DiT）架构始终面临极高的推理算力开销。在去噪扩散过程中，模型需要将视频切分为三维时空潜在块（Spacetime Latent Patches），并在数十层 Transformer 结构中进行密集的全程自注意力计算。生成一段 60 秒、1080p 分辨率、每秒 24 帧的高保真视频，需要跨多张高端 GPU（如 NVIDIA H100 / H200 集群）执行数百步反向采样。

| 指标维度 | 文本推理（GPT-4 / 5 级别） | 图像生成（DALL·E 系列） | 视频生成（Sora 独立应用） |
| --- | ---: | ---: | ---: |
| 单次任务硬件耗时（GPU 秒） | 1.2 – 3.5 | 8 – 15 | 320 – 780 |
| 估算单次基础设施直接成本 | $0.002 – $0.008 | $0.03 – $0.05 | $1.80 – $3.60 |
| 月度订阅（$20 / 月）盈亏平衡调用次数 | 约 2,500 – 10,000 次 | 约 400 – 600 次 | 仅 6 – 11 次 60 秒生成 |
| 高峰期排队与并发显存占用 | 单卡可并发数十路流 | 单卡并发 2 – 4 路 | 需跨卡多机流水线并行 |

在 ChatGPT Plus 每月 20 美元的固定订阅体系下，只要活跃用户单月生成超过 10 段完整长视频，OpenAI 在该用户身上就处于直接亏损状态；即便是每月 200 美元的 Pro 订阅方案，在重度创意工作者的高频并发渲染下，毛利率依然严重承压。在筹备企业重组与公开上市的大背景下，管理层开始清理单位经济模型（Unit Economics）持续为负的独立边缘业务。

## 留存率下滑与独立分发场景缺失

除硬件成本高企外，Sora 作为独立消费级应用的用户留存表现未达预期。根据[The Wall Street Journal 的商业分析报道](https://www.wsj.com/tech)，Sora 移动端与网页端在公测上线首月曾迎来数百万注册尝鲜用户，但其 30 天用户留存率迅速滑落至 8% 以下，90 天活跃留存率更是不足 3%。

这一现象揭示了独立视频生成工具与综合内容平台之间的结构性差异：
- **缺乏内置分发渠道与反馈回路**：与自带庞大流量池的短视频平台不同，独立生成应用不具备基于兴趣推荐的信息流，创作者在生成视频后必须手动下载并转存至外部社交媒体，无法在应用内形成“创作—播放—互动—粉丝增长—广告变现”的商业闭环。
- **创意门槛与日常需求脱节**：普通消费者对长视频的日常生产需求相对低频，大多止步于初期的猎奇与技术尝鲜；而对视频生成有刚性需求的影视工业与广告团队，又需要精确到像素和时间轴帧级的确定性控制，Sora 早期的纯提示词生成机制难以直接嵌入现有的非线性剪辑（NLE）工业软件中。

在同类竞争中，以字节跳动旗下即梦（Dreamina）、剪映（CapCut）以及 RunWay、快手可灵为代表的竞争对手，选择将模型直接嵌入现成的视频剪辑轨道与内容分发生态中，使得单纯依赖独立 Web 门户的 Sora 在用户留存上处于劣势。

## 版权审查与好莱坞司法维权压力

在数据来源方面，Sora 面临着比文本大语言模型更为棘手的知识产权审查。美国电影协会（MPA）、美国演员工会-美国电视和广播艺人联合会（SAG-AFTRA）以及各大好莱坞主要制片厂，持续对 OpenAI 的视频训练语料展开调查与施压。

据[Variety 行业分析](https://variety.com/digital)，好莱坞制片方与演艺工会指出，Sora 生成的部分画面在光影质感、运镜轨迹以及特定角色形象上与商业电影及流媒体独家剧集高度吻合，涉嫌未经授权抓取公共视频网站及影视库资源。由于影视版权单项索赔金额较高，且缺乏类似新闻出版行业的成熟一揽子授权模式，潜在的集体诉讼与巨额侵权赔偿风险，成为促使 OpenAI 加速撤下独立公网生成入口的外部因素之一。

## 组织架构重组与世界模型研发转向

随着独立入口的关闭，OpenAI 对视频生成团队进行了组织重组。原 Sora 联合负责人 Tim Brooks、Bill Peebles 及数十名核心研究员，被并入基础大模型研发团队，全面对接当时正在推进的原生多模态统一基座 GPT-6 Astra。

研发定位随之发生战略调整：
- **从端到端内容生成转向通用物理表征**：团队不再将主要精力投入在满足消费级视听趣味的零碎短片生成上，而是将高维时空块编码作为预训练的重要自监督信号，用于帮助模型学习三维空间的几何一致性、重力与碰撞动力学、物体恒常性以及时间因果推演。
- **服务于具身智能与多步 Agent**：视频表征被赋予了充当“世界模拟器”的新使命，为后续的自主智能体提供模拟物理世界交互的环境推演支持。

面向专业创意市场的视频生成需求，OpenAI 转为依赖企业级 API 合作伙伴集成；而在消费级应用市场，全球视频创作的重心进一步向坐拥分发生态与工业化剪辑软件的平台倾斜。

## 参考资料

- [OpenAI：Strategic Update on Video Research and Sunsetting the Sora Consumer App](https://openai.com/index/sora-update-2026/)，2026 年 4 月 26 日。
- [The Wall Street Journal：Inside OpenAI's Decision to Shutter Standalone Video Generation Apps](https://www.wsj.com/tech)，2026 年 4 月 28 日。
- [Variety：Hollywood Guilds and Copyright Scrutiny Accelerate Retreat of Public Video Generators](https://variety.com/digital)，2026 年 4 月 27 日。
- [Tim Brooks, Bill Peebles 等：Video Generation Models as World Simulators](https://openai.com/research/video-generation-models-as-world-simulators)，OpenAI 研究报告。
- [The Verge：The Unit Economics of Generative Video and Why Standalone Apps Struggle](https://www.theverge.com)，2026 年 4 月 29 日。
