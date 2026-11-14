---
id: "e-20260424-deepseek-v4"
editorialStyle: reported
---

2026 年 4 月 24 日，深度求索（DeepSeek）发布并开源 DeepSeek-V4 Preview。该模型原生支持 100 万（1M）token 上下文窗口与最高 38.4 万 token 输出，API 采用分时段计费方案，非高峰时段输入每百万 token 0.15 美元，命中缓存降至 0.003 美元。模型发布紧随 OpenAI 4 月 23 日推出 [GPT-5.5 预览版](https://openai.com/index/gpt-5-5-preview)之后，其低廉的调用成本与长上下文能力引发了开发者社区的集中讨论。

发布初期，DeepSeek 开放了网页端体验与面向开发者的 API 接入，并在 Hugging Face 与 GitHub 上同步公开了模型架构细节与推理优化代码。

## 原生百万上下文与稀疏架构设计

长上下文处理通常受到注意力机制计算复杂度与键值缓存（KV Cache）显存占用的制约。在 [DeepSeek-V4 技术文档](https://github.com/deepseek-ai/DeepSeek-V4)中，团队介绍了针对长序列推演的底层架构改进：

模型采用了 DeepSeek 稀疏注意力（DeepSeek Sparse Attention, DSA）机制，在注意力计算中结合动态块稀疏选择，限制每个 token 仅需关注历史序列中最相关的局部块与关键枢纽点，从而将显存占用与计算开销由二次方复杂度降至近线性。配合此前在 V3 与 R1 中验证的多头潜在注意力（MLA），键值缓存通过低秩投影进行压缩，使得单节点在承载数十万 token 上下文时依然能够维持较高的吞吐效率。

在参数规模上，DeepSeek-V4 Preview 延续了超大规模混合专家（MoE）路线，总参数量达到 1.6 万亿（1.6T），但在每次前向传播时仅动态激活约 490 亿（49B）参数。为了解决大规模 MoE 在多节点通信中的瓶颈，模型部署采用了 DualPipe 双向流水线并行算法，在跨节点专家计算与张量传输之间实现完全重叠，降低了分布式推理的等待延迟。

## 分时计费策略与大幅度上下文缓存折扣

随着模型支持的上下文长度增加，频繁输入长文档或多轮代码库对 API 成本提出了更高要求。DeepSeek 在 V4 Preview 上推行了峰谷分时定价机制与上下文缓存折扣方案：

| 模型与时段 | 未命中缓存输入（每百万 token） | 命中缓存输入（每百万 token） | 补全输出（每百万 token） |
| --- | ---: | ---: | ---: |
| **DeepSeek-V4 Preview（非高峰）** | $0.15 | $0.003 | $0.60 |
| **DeepSeek-V4 Preview（高峰）** | $0.30 | $0.006 | $1.20 |
| **GPT-5.5 Preview（参考价格）** | $2.50 | $1.25 | $10.00 |

根据 [DeepSeek 官方 API 定价说明](https://api-docs.deepseek.com/quick_start/pricing)，系统将 UTC 01:00 至 04:00 以及 06:00 至 10:00 设为周内高峰时段，其余时间均为非高峰时段。如果开发者传入的提示词前缀与服务端缓存一致，系统自动应用高达 98% 的缓存折扣。对于日常维护多轮上下文的编程 Agent 或长文本分析应用，单次交互的有效成本显著低于传统商业闭源模型。

这一价格差在同周发布对比中尤为明显。OpenAI 在 4 月 23 日发布的 GPT-5.5 展现了长文本思考与推理能力，但调用单价高出数倍至数十倍。商业模型与开源模型在定价上的巨大落差，促使大量开发者转而测试 V4 Preview 在实际工程管线中的表现。

## 开发者社区反响与“梁圣”文化现象

V4 预览版上线后的数天内，全球开源社区与社交网络出现了密集的工具适配热潮。

在 [X（原 Twitter）与 Reddit 的技术版块](https://www.reddit.com/r/LocalLLaMA/)上，开发者相继分享了将 DeepSeek-V4 接入 Cursor、VS Code 插件、Aider 以及各类自托管 Agent 的测试配置。由于每百万 token 仅数美分的成本，许多个人开发者开始在本地环境全天候运行代码重构脚本与文档检索流水线。

由于短时间内涌入的调用流量呈指数级攀升，DeepSeek 开放平台的 API 服务在 4 月 25 日前后多次出现并发排队与响应延迟，官方随后通过限制每分钟请求数（RPM）逐步恢复稳定。

在中文技术社区与社交媒体上，用户自发创作了一系列与创始人梁文锋相关的迷因，将其戏称为“梁圣”。这一称谓最初源自量化投资圈与技术极客的调侃，随后演变为对 DeepSeek 长期推行平价开源策略的一种群体认同。社区用户以此表达对低廉算力供给的支持，同时也反映出开发者对前沿 AI 工具从高溢价向大众基础设施转化的诉求。

## 后续版本分化：从极简预览到分层矩阵

预览版发布后，DeepSeek 在随后的数月内逐步丰富了 V4 的产品形态：

2026 年 8 月，团队推出了正式旗舰版本 **DeepSeek-V4-Pro**。相较于追求极低单价的 Flash / Preview 系列，Pro 版本调高了 API 定价，重点强化了长程逻辑推理、复杂指令对齐以及针对多步 Agent 编排的稳健性。9 月，面向边缘计算与高吞吐交互的 **DeepSeek-V4.1-Flash** 上线，引入原生轻量多模态处理能力，完成了从单一低价模型向高低分层产品矩阵的过渡。

## 参考资料

- [DeepSeek 官方公告：DeepSeek-V4 Preview 上线与开源说明](https://github.com/deepseek-ai/DeepSeek-V4)，2026 年 4 月 24 日。
- [DeepSeek API 开放平台：分时计费与 Prompt Cache 定价规则](https://api-docs.deepseek.com/quick_start/pricing)，2026 年 4 月。
- [OpenAI：Introducing GPT-5.5 Preview](https://openai.com/index/gpt-5-5-preview)，2026 年 4 月 23 日。
- [Reddit r/LocalLLaMA：DeepSeek-V4 Preview 实际调用性能与长上下文测试讨论](https://www.reddit.com/r/LocalLLaMA/)，2026 年 4 月 25 日。
- [Hugging Face 官方模型仓库：deepseek-ai/DeepSeek-V4-Preview](https://huggingface.co/deepseek-ai)，2026 年 4 月。
