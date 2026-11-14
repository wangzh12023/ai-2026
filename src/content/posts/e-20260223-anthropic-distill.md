---
id: "e-20260223-anthropic-distill"
editorialStyle: reported
---

2026 年 2 月 23 日，Anthropic 公开指控 DeepSeek、月之暗面和 MiniMax 利用 Claude 的回答训练自己的模型。它在[公告](https://www.anthropic.com/news/detecting-and-preventing-distillation-attacks)中给出的规模是约 2.4 万个虚假账户、超过 1600 万次交互，指控涉及违反服务条款和绕过地域访问限制。[当日路透社报道](https://www.reuters.com/world/china/chinese-companies-used-claude-improve-own-models-anthropic-says-2026-02-23/)同时记录，三家公司尚未回应其置评请求。

Anthropic 在中国不提供 Claude 的商业访问。它指控三家公司通过虚假账户和代理服务绕过访问限制，再把取得的输出用于训练竞争模型。公司担心，这会降低竞争者的研发成本，也可能让模型能力在没有原有安全措施的情况下流向其他用途。

## 蒸馏已经是一条公开的训练路线

知识蒸馏用一个模型的输出指导另一个模型训练。Hinton、Vinyals 和 Dean 在 [2015 年的论文](https://arxiv.org/abs/1503.02531)里讨论的是，把多个模型共同作出的预测教给一个更便于部署的模型。教师给出的信息越丰富，学生可学习的内容就越多；输出还可以包含各个类别的预测概率，而非仅有一个最终标签。

在语言模型场景中，教师可以生成问题的解答、解题过程或代码，把这些材料整理成训练样本，再用来微调学生模型。[DeepSeek-R1 技术报告](https://arxiv.org/html/2501.12948v2#A6)就公开说明了这类做法：用 R1 产生的数据训练以 Qwen、Llama 为基础的较小模型，发布六个蒸馏版本。使用自家教师模型的输出，已经是开发和发布产品的一部分。

通过商业接口取得文本，则涉及另一层授权。[Anthropic 的输出使用说明](https://support.claude.com/en/articles/12326764-can-i-use-my-outputs-to-train-an-ai-model)把这条界线写得很明确：客户拥有其输入所产生的输出，服务条款仍限制用它训练与 Anthropic 竞争的模型。页面列举的允许用途包括情感分类、信息提取等专用工具，禁止用途包括通用聊天和开放式文本生成模型。

[Google 2 月 12 日的威胁报告](https://cloud.google.com/blog/topics/threat-intelligence/distillation-experimentation-integration-ai-adversarial-use)披露了一次超过十万条提示词的活动，目标是取得 Gemini 的推理过程，在其他语言中复现相关能力。Google 称，观察到的这类提取来自世界各地的企业和研究者；它自己的云平台也提供有授权的蒸馏产品。

## Anthropic 披露了账户和流量层面的指控

[2 月 23 日公告](https://www.anthropic.com/news/detecting-and-preventing-distillation-attacks)把三组活动分别列出：

| 被指控公司 | Anthropic 报告的交互次数 | 公告列举的目标 |
| --- | ---: | --- |
| DeepSeek | 超过 15 万次 | 推理、按评分标准评价答案、敏感问题改写 |
| 月之暗面 | 超过 340 万次 | 工具调用、代码与数据分析、操作电脑和视觉任务 |
| MiniMax | 超过 1300 万次 | 编程 Agent、工具使用与任务编排 |

Anthropic 给出的归属依据包括 IP 关联、请求元数据、基础设施线索，以及部分行业伙伴的交叉信息。它认为，协调出现的账户、大量重复结构的提示词和对少数能力的集中索取，构成了面向训练的数据采集模式。公告还描述了代理商分散转售访问的方式：单个账户被封后，其他账户可以接替流量。

其中一个具体例子是要求 Claude 根据已经完成的答案，设想并逐步写出背后的推理。训练方由此得到可供学习的过程文本。公告没有公开三家公司完整的数据集、训练日志或复现审计；它展示的是 Anthropic 依赖服务端观测作出的归属判断，未测出这些输出分别贡献了竞争模型多少能力。

[路透社对公告的报道](https://www.reuters.com/world/china/chinese-companies-used-claude-improve-own-models-anthropic-says-2026-02-23/)保留了另一项细节：Anthropic 称，它在 MiniMax 的活动仍进行时发现了这批流量，发布新模型后，对方在 24 小时内把接近一半流量转向新模型。这是 Anthropic 判断采集活动会随产品发布调整的依据。

## 争论集中在训练材料和竞争边界

客户把输出积累成训练数据后，可以用来训练自己的模型，逐渐减少对原服务的依赖。Anthropic 的[官方说明](https://support.claude.com/en/articles/12326764-can-i-use-my-outputs-to-train-an-ai-model)也直接把培养竞争者列为限制模型训练的理由。

在 [r/LocalLLaMA 的当日讨论](https://www.reddit.com/r/LocalLLaMA/comments/1rcpmwn/comment/o6zvs0r/)中，用户 ziphnor 把模型公司使用外部数据训练，与其限制别人学习模型输出放在一起，质疑两种立场是否一致。同一讨论中的 bigh-aus 更重视开放权重能让社区继续使用和改进模型，怀疑安全理由是否也在维护封闭产品的商业利益。

Anthropic 从发布公告时就主张由政府采取措施，[路透社记录的原文立场](https://www.reuters.com/world/china/chinese-companies-used-claude-improve-own-models-anthropic-says-2026-02-23/)是：大规模蒸馏也依赖先进芯片，出口限制因此能够同时约束训练和蒸馏。

## 美国政府介入与中方回应

4 月 23 日，白宫科技政策办公室发布 [NSTM-4《美国 AI 模型的对抗性蒸馏》](https://www.whitehouse.gov/wp-content/uploads/2026/04/NSTM-4.pdf)。文件由办公室主任 Michael Kratsios 签发，称美国政府掌握了主要位于中国的外国实体开展工业规模蒸馏的信息，并承认有正当用途的蒸馏是 AI 生态的一部分。文件列出的行动是向美国 AI 公司共享信息、推动企业协调防御、共同制定识别和处置办法，以及研究追责措施。

9 月 8 日，NSA、CISA 和 FBI 联合发布网络安全公告。[NSA 的发布说明](https://www.nsa.gov/Press-Room/Press-Releases-Statements/Press-Release-View/Article/4592113/nsa-and-others-warn-china-based-ai-companies-are-distilling-us-frontier-ai-mode/)将跨模型供应商、云平台和基础设施分散操作列为防御困难，提出整个服务链条需要合作。此时议题已从一家公司的账户滥用调查，扩大为美国安全机构对模型能力转移的正式判断。

中国商务部在 [9 月 9 日答记者问](https://www.mofcom.gov.cn/xwfb/xwfyrth/art/2026/art_1439afbf24d941bfaefba078aacf340c.html)中反对这些指控，认为美方把行业技术和商业问题政治化，并批评宽泛的地域限制和双重标准。回应强调中国开源模型也被美国公司使用，表示愿意开展专业讨论，若以打击蒸馏为名遏压中国企业，将采取反制措施。

## 客户请求转发带来的隐私问题

9 月 10 日，Anthropic 在[新的威胁调查报告](https://www.anthropic.com/threat-intelligence-report-september-2026)中指控，月之暗面把部分客户请求转发给 Claude，再将回答呈现给自己的用户，同时保存部分交互用于提取推理记录。它描述的方法是保存 Claude 返回的推理签名，在新会话中再次提交，诱导模型写出原本受保护的完整推理。这也解释了后续接口为什么要限制推理记录跨会话、跨账户流转。

Anthropic 称，转发内容中包含客户的内部代码和有效访问凭据，但它不知道月之暗面是否告知客户，请求会被转交给 Anthropic。用户提交给一个模型服务的业务资料，由此可能被另一个供应商处理。

## 防护开始改变开发者拿到的推理文本

10 月 12 日，Anthropic [公布反蒸馏措施的后续报告](https://www.anthropic.com/news/distillation-defenses)。其中一项实验用 Claude Opus 4.8 的输出训练一个预训练 Claude 模型：使用完整推理记录时，学生在 SWE-bench Verified 编程评测中得到 80.4%；改用推理摘要时，得到 71.8%。实验针对的是训练材料的信息量，说明了服务商为何把保护重点放在推理文本上。

<figure>
  <a href="../../images/articles/anthropic-distillation/reasoning-transcripts.png" aria-label="查看完整尺寸实验图"><img src="../../images/articles/anthropic-distillation/reasoning-transcripts.png" width="1920" height="1080" loading="lazy" alt="Anthropic 实验图：完整推理记录训练的学生模型得分80.4%，推理摘要训练得分71.8%，评测为SWE-bench Verified。" /></a>
  <figcaption>图为 Anthropic 2026 年 10 月公布的自家实验，比较两种材料对自家学生模型的训练效果。来源：<a href="https://www.anthropic.com/news/distillation-defenses">Anthropic 后续报告</a>，图片版权归 Anthropic。</figcaption>
</figure>

报告描述的措施包括限制推理记录跨账户和跨模型使用、识别提取请求，以及对反复尝试的账户限流或封禁。Anthropic 估计，自家平台上被提取的推理 token 数量降低了约 90% 至 99%；这是平台自身的观测结果。公司同时承认，部分正常开发者需要更新集成，请求可能被误判，被防护拦截的特定请求也开始计费。

## 参考资料

- [Anthropic：Detecting and preventing distillation attacks](https://www.anthropic.com/news/detecting-and-preventing-distillation-attacks)，2026 年 2 月 23 日。三家公司、交互次数和流量归属依据的原始公告。
- [Reuters：Chinese AI companies 'distilled' Claude to improve own models, Anthropic says](https://www.reuters.com/world/china/chinese-companies-used-claude-improve-own-models-anthropic-says-2026-02-23/)，2026 年 2 月 23 日。记录当日采访与回应情况。
- [Hinton、Vinyals、Dean：Distilling the Knowledge in a Neural Network](https://arxiv.org/abs/1503.02531)，2015 年。知识蒸馏的经典研究。
- [DeepSeek-AI：DeepSeek-R1 技术报告](https://arxiv.org/html/2501.12948v2#A6)。其公开蒸馏模型的训练方法。
- [Anthropic：Can I use my Outputs to train an AI model?](https://support.claude.com/en/articles/12326764-can-i-use-my-outputs-to-train-an-ai-model)，2026 年 3 月 16 日。输出使用和竞争模型训练政策说明。
- [Google：GTIG AI Threat Tracker](https://cloud.google.com/blog/topics/threat-intelligence/distillation-experimentation-integration-ai-adversarial-use)，2026 年 2 月 12 日。另一家模型服务商的提取活动观测。
- [r/LocalLLaMA：ziphnor 等用户的讨论](https://www.reddit.com/r/LocalLLaMA/comments/1rcpmwn/comment/o6zvs0r/)，2026 年 2 月。仅用于呈现参与者观点。
- [白宫科技政策办公室：NSTM-4](https://www.whitehouse.gov/wp-content/uploads/2026/04/NSTM-4.pdf)，2026 年 4 月 23 日，PDF。
- [NSA：联合网络安全公告发布说明](https://www.nsa.gov/Press-Room/Press-Releases-Statements/Press-Release-View/Article/4592113/nsa-and-others-warn-china-based-ai-companies-are-distilling-us-frontier-ai-mode/)，2026 年 9 月 8 日。
- [中国商务部：就美发布相关网络安全公告答记者问](https://www.mofcom.gov.cn/xwfb/xwfyrth/art/2026/art_1439afbf24d941bfaefba078aacf340c.html)，2026 年 9 月 9 日。
- [Anthropic：Detecting and countering misuse of AI: September 2026](https://www.anthropic.com/threat-intelligence-report-september-2026)，2026 年 9 月 10 日。关于请求转发、推理提取和客户数据的后续指控。
- [Anthropic：Strengthening our defenses against distillation attacks](https://www.anthropic.com/news/distillation-defenses)，2026 年 10 月 12 日。防护措施、实验图和副作用说明。
