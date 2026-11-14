---
id: "e-20261006-openai-math-dump"
editorialStyle: reported
---

2026 年 10 月 6 日，OpenAI 在其科研镜像站集中发布了由内部前沿推理模型自主生成的 [722 篇纯数学与理论计算预印本手稿](https://openai.com/research)，涵盖 372 个独立数学猜想与开放问题。手稿涉及几何测度论、调和分析、解析数论以及计算复杂度理论等领域，其中最受关注的是一篇声称证明了复杂性类别 $\mathbf{L = RL = BPL}$（确定性、单边误差概率与双边误差概率对数空间完全等价）的手稿，并附带了约 3.8 万行 Lean 4 形式化验证代码。

这一批量发布此前已在地缘学术界引发预热争议。9 月上旬，由于部分企业宣称模型逼近纳维-斯托克斯方程光滑解等未经验证的传闻，多位国际数学学者曾公开发声呼吁严谨对待机器定理生成。

## 学界公开信与同行评议争论

在 10 月 6 日预印本集中公布的前三周，国际纯数学界已开始对商业机构的数学推演宣传表达担忧。2026 年 9 月 11 日，25 位菲尔兹奖得主联名在 [美国数学会通讯（Notices of the AMS）发表公开信](https://www.ams.org/notices)，强调纯数学研究的核心在于概念创新与证明因果链的闭合，呼吁科技企业避免在未经严格形式化验证或专业同行审阅前，向公众单方面宣称重大数学难题的突破。

菲尔兹奖得主陶哲轩（Terence Tao）在 [个人学术博客的专题长文](https://terrytao.wordpress.com)中指出，现代大语言模型具备极强的数学语法生成能力与启发式推导直觉，但在多层量词交替与极限过渡的严密论证中，容易出现表面自洽但底层存在逻辑断裂的隐性伪证。若缺乏可靠的交互式证明助手进行全程机器检验，大规模涌现的机器手稿可能会给学术界的审稿网络带来沉重的校验负担。

## 典型手稿与审查结论

OpenAI 公布的 722 篇手稿引发了全球理论计算机与数学学者的分布式协同审查。研究人员通过 MathOverflow、Lean 社区官方 Zulip 频道以及 GitHub 代码仓库展开逐行交叉复核。

| 涉及领域 / 猜想 | 手稿主张 | 审查发现 | 最终状态 |
| :--- | :--- | :--- | :---: |
| **计算复杂度：$\mathbf{L = BPL}$** | 构造多项式时间可计算的对数空间伪随机生成器 | 引理 6.3 存在循环定义，隐式假定了分支程序下界 | **撤回修正 (Withdrawn)** |
| **调和分析：三维挂谷针刺猜想** | 给出 Besicovitch 集合 Minkowski 维数的新下界 $\alpha > 2.87$ | 推导中调和测度估计成立，但边界光滑性假设过于严格 | 保留手稿，下调结论范围 |
| **解析数论：Dirichlet $L$-函数** | 改进特定模数实特征零点无零区常数 | 形式化检验通过，数值边界得到独立脚本验证 | 确认结论有效 |
| **组合极值：Erdős 距离问题变体** | 证明平面点集最小距离重数上限新阶 | 逻辑链条闭合，已被代数组合学者收录验证 | 确认结论有效 |

在最引人注目的 $\mathbf{L = BPL}$ 论文中，复杂度理论学者迅速指出了其关键推导的循环论证问题。手稿在证明核心引理 6.3 时，为了推导伪随机生成器（PRG）的种子长度对数界，在潜层步骤中直接调用了一个只在 $\mathbf{L = BPL}$ 成立时才具有良定义的分支程序下界性质。

更严重的问题出现在 Lean 4 形式化代码中。形式化验证专家在 GitHub 审计中发现，代码库通过一段自定义宏展开（Macro Expansion），隐式绕过了针对特定类型转换的严格类型推断，实际等同于引入了一个未被显式声明的虚假公理（Axiom stub），导致 Lean 编译器在类型检查时未能拦截关键逻辑漏洞。

## 官方修订与学术规范演进

在学术界公布形式化编译复现反例后，OpenAI 于 10 月 24 日对官方论文镜像进行了[静默修订与撤稿更新](https://openai.com/research)，将包括 $\mathbf{L = BPL}$ 在内的 15 篇存在推导硬伤的手稿标记为“待修正 / 撤回（Under Revision）”，并在说明文档中承认推理引擎在复杂抽象多步归纳中存在符号概念漂移与自反思盲区。

根据 [Quanta Magazine 的调查报道](https://www.quantamagazine.org)，这场集中发布与快速审计推动了学术传播机制的制度化演进：
1. **预印本平台设立提交规范**：arXiv 理论计算机与数学分部联合制定了针对 AI 生成手稿的标注规范，要求完全由自动化工具生成的手稿必须附带无自定义公理绕过的交互式证明脚本（如完整编译通过的 Lean 4 或 Coq 源码）；
2. **形式化辅助证明的价值界定**：学界进一步明确了“AI 提出启发式猜想与反例”与“机器自主构建全量严格证明”的边界。自动化工具在探索有限维反例和辅助符号计算方面展现出效率，但在构建全新数学概念和处理非平凡拓扑构造时，仍高度依赖数学家的直觉把控与框架设计。

## 参考资料

- [OpenAI：Explorations in Automated Mathematical Reasoning and Preprints Repository](https://openai.com/research)，2026 年 10 月 6 日。预印本代码库、模型推理报告与后续修订记录。
- [Notices of the American Mathematical Society：Letter from 25 Fields Medalists on Commercial AI and Pure Mathematics](https://www.ams.org/notices)，2026 年 9 月 11 日。菲尔兹奖得主关于学术严谨性与商业宣传的公开信。
- [Terence Tao's Blog：Standards of Proof and the Verification of Machine-Generated Mathematics](https://terrytao.wordpress.com)，2026 年 9 月至 10 月。关于大模型逻辑缺陷与形式化证明工具的学术评论。
- [Quanta Magazine：Inside the Global Audit of OpenAI's 722 Mathematical Preprints](https://www.quantamagazine.org)，2026 年 10 月。学术界对 $\mathbf{L = BPL}$ 形式化漏洞的溯源调查报道。
- [Lean Community Zulip Archive：Audit and Type-Checking Reproduction of the L=BPL Formal Proof Scripts](https://leanprover-community.github.io)，2026 年 10 月。形式化证明脚本中的宏展开与类型绕过审计记录。
