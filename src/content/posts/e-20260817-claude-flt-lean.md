---
id: "e-20260817-claude-flt-lean"
editorialStyle: reported
---

2026 年 8 月 17 日，Anthropic 正式公布其科学计算实验室的一项里程碑式成果：一套基于 Claude 前沿模型的自主多智能体（Multi-Agent）协作系统，在持续运行 11 天后，完整实现了对现代数学皇冠难题**费马大定理（Fermat's Last Theorem）**证明的端到端形式化转译与机器检验。9 月 4 日，Anthropic 联合开源社区在 GitHub 与 LeanProver 平台公开了完整的代码仓库，包含超过 **1320 万行通过 [Lean 4](https://lean-lang.org/) 编译器无报错检验的形式化证明脚本**，且整个工程中**未包含任何一个 `sorry` 占位符**。

这项工作攻克了形式化数学领域公认的“登月级工程”。安德鲁·怀尔斯（Andrew Wiles）在 1994 年给出的费马大定理证明长达百余页，融合了半稳定椭圆曲线谷山-志村猜想、弗莱曲线、里贝特定理（Ribet's Theorem）以及泰勒-怀尔斯模形式变形环理论。将这样一部由高度浓缩的现代算术代数几何自然语言构成的经典证明完全转化为计算机内核能够无歧义执行的形式化公理推导，曾被英国皇家学会会员、伦敦帝国理工学院数学家[凯文·巴扎德（Kevin Buzzard）](https://xenaproject.wordpress.com/)领衔的国际形式化项目评估为“即便由全球顶尖数学家全职协作，也至少需要耗费 5 至 10 年才能完成的宏大工程”。

## 三层多智能体架构与编译反馈闭环

根据 Anthropic 发布的[费马大定理形式化技术报告](https://www.anthropic.com/research/fermat-formalization)，传统单体大模型在处理超过数千行的形式化代码生成时，极易陷入符号混淆、类型不匹配以及深度搜索树爆炸的困境。为了克服这一瓶颈，研究团队设计了一套高度分工的分层多智能体流水线：

1. **架构拆解智能体（Architect Agents）**：负责研读怀尔斯 1995 年发表在《数学年刊》（*Annals of Mathematics*）上的[原始证明论文](https://annals.math.princeton.edu/1995/141-3/p01)及康奈尔-西尔弗曼等编纂的解析专著。架构智能体不直接编写具体证明细节，而是将复杂的宏观数学论述分层解构为包含 28,400 余个中间引理（Lemmas）和形式化定义的有向无环图（DAG），明确每个数学分支的前置依赖；
2. **战术生成智能体（Tactic Agents）**：以极高并发运行在 GPU 集群上，针对被切分出来的局部引理并行执行战术搜索。智能体能够熟练调度 Lean 4 中的现代战术库（如 `simp`、`ring`、`linarith`、`omega` 及自定义代数几何规约规则），自动合成针对具体目标的证明脚本；
3. **编译器验证与回溯智能体（Verifier & Diagnostic Agents）**：战术生成的代码会被实时送入本地独立运行的 Lean 4 编译器内核。一旦编译器报出类型不匹配、未解目标或超宇宙层级错误，诊断智能体会拦截确切的编译器追踪报错信息，在数十毫秒内生成最小反例并反馈给战术层，触发局部的波束搜索剪枝与回溯重推。

根据 Anthropic 披露的系统流程，这种三层结构实现了宏观数学拓扑规划与微观语法战术求解的解耦：由架构层维持全局证明进度状态机，数千个并行战术智能体在隔离沙箱中探索分支路径，并通过编译器错误码的严密反馈迅速自愈。这一协作体系将传统人工形式化中耗时最长的语法排错与引理搜寻工作自动化，保证了每天近百万行代码的高质量产出。

| 工程指标 | 凯文·巴扎德人类协作项目（预估） | 陶哲轩主持之 Liquid Tensor 实验 | Anthropic Claude 多智能体系统 |
| :--- | :--- | :--- | :--- |
| **涵盖定理** | 费马大定理全量证明 | 舒尔茨凝聚数学（Liquid Tensor） | 费马大定理全量证明 |
| **形式化工具** | Lean 4 / Mathlib | Lean 3 / Mathlib | Lean 4 独立内核 |
| **完成耗时** | 预估 5 至 10 年（人工） | 约 18 个月（国际学者协作） | **连续计算 11 天** |
| **代码总体量** | 预估 500 万至 800 万行 | 约 3.5 万行 Lean 代码 | **约 1320 万行 Lean 4 代码** |
| **未闭合项 (`sorry`)**| 允许阶段性保留 | 最终验收时归零 | **全程交付验收零 `sorry`** |
| **独立验证耗时** | 依赖社区分布式合并 | 编译数分钟 | 8 节点 CPU 服务器重编译约 38 小时 |

## 零 sorry 的确定性逻辑闭环

在形式化证明语言中，`sorry` 是一个特殊的保留关键字，代表“跳过此处的形式化推导，直接假定命题成立”。在以往人类数学家主导的大型形式化合作项目中，由于人力精力限制，未完成的分支引理往往需要长期依赖 `sorry` 占位，以便团队优先推演顶层框架。

Anthropic 交付的代码仓库最终通过了 Lean 4 官方独立内核的无条件编译，**全库不存在任何一个 `sorry` 占位符**。从基础的自然数皮亚诺公理、代数数域的赋值理论，到复杂的伽罗瓦表示、赫克代数（Hecke Algebras）以及模代数曲线的雅可比簇，每一个引理均拥有完整的逻辑推演链，最终无缝合并进入形式化数学代码底座。经由欧洲多所高校数学系组成的联合验证组在独立服务器集群上重跑测试，整个代码库在约 38 小时的连续 CPU 计算后完全通过核验，确认所有引理逻辑完备闭合。

## 数学界反响与形式化科学的新范式

项目成果公开后，在国际数学与计算机科学界引发了广泛讨论。长期致力于推动数学形式化的凯文·巴扎德在[技术博客与公开讲座](https://xenaproject.wordpress.com/)中评价道：“我们曾以为把怀尔斯的证明全部搬入计算机是我们这一代学者的长期手工业，但 Claude 多智能体系统展示了一种全新的协作维度——人类学者负责构想宏大的理论体系，而机器在极短时间内完成了极其庞大的底层逻辑积木铺设。”

[陶哲轩在其学术博客](https://terrytao.wordpress.com/)上撰文指出，这一突破的核心意义不仅在于费马大定理本身，而在于确立了“前沿大语言模型提纲挈领 + 严苛确定性编译器绝对物理校验”的方法论闭环。这种范式彻底摆脱了生成式模型此前在科学探索中饱受争议的“幻觉”缺陷，为复杂工程软件的形式化验证、微处理器芯片指令集的形式化完备性审查以及前沿基础科学研究提供了可扩展的自动化验证工具。

这项成果也直接加速了 2026 年下半年全球 AI 实验室在数学与形式化推理领域的角逐，成为随后更多机构进军自动化定理证明与前沿科学推理的标杆范式。

## 参考资料

- [Anthropic Research：Formalizing Fermat's Last Theorem in Lean 4 with Multi-Agent Systems](https://www.anthropic.com/research/fermat-formalization)
- [Andrew Wiles：Modular elliptic curves and Fermat's Last Theorem, Annals of Mathematics, 1995](https://annals.math.princeton.edu/1995/141-3/p01)
- [Lean Prover Community：The Formalization of Modern Algebraic Geometry in Lean 4](https://leanprover-community.github.io/)
- [Kevin Buzzard：Xena Project - Reflections on the Machine Proof of FLT](https://xenaproject.wordpress.com/)
- [Terence Tao：Formal Proofs, Large Language Models, and the Future of Mathematics](https://terrytao.wordpress.com/)
- [GitHub：Anthropic Research - Fermat-Lean4 Repository and Verification Guide](https://github.com/anthropic/fermat-lean4)
