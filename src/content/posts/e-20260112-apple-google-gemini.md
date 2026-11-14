---
id: "e-20260112-apple-google-gemini"
editorialStyle: reported
---

2026 年 1 月 12 日，苹果与 Google 确认多年合作：下一代 Apple Foundation Models 将基于 Gemini 模型和 Google 的云技术开发，用于未来的 Apple Intelligence 功能，其中包括计划在年内推出的个性化 Siri。双方的[联合声明](https://blog.google/company-news/inside-google/company-announcements/joint-statement-google-apple/)明确了技术供应方与产品方向，没有公布合作金额、具体模型版本和训练方案。

这次合作接续的是一项已经延期的产品承诺。苹果此前展示过让 Siri 理解手机中的个人信息、结合屏幕内容处理请求、再到相应应用中执行操作的能力。新协议确定了苹果接下来借助谁的模型技术完成这项工作。

## 从 Siri 延期到寻找外部模型

苹果在 [2024 年 WWDC 发布 Apple Intelligence](https://www.apple.com/newsroom/2024/06/introducing-apple-intelligence-for-iphone-ipad-and-mac/) 时，展示了一套深入操作系统的功能：写作工具可以改写、校对和概括文字，照片可以用自然语言搜索，Siri 则要进一步理解用户设备中的信息。用户询问母亲的航班何时落地，Siri 需要找到相关邮件里的航班信息，再查询实时状态。回答这类请求，既需要理解语言，也需要找到正确的数据，并调用后续服务。

这些功能的交付进度逐渐拉开。2025 年 3 月 7 日，苹果发言人 Jacqueline Roy 向 [Daring Fireball 提供声明](https://daringfireball.net/2025/03/apple_is_delaying_the_more_personalized_siri_apple_intelligence_features)，确认个性化 Siri 的开发需要比预期更长的时间。当时已经交付了键入 Siri、产品知识和 ChatGPT 接入；仍在开发的是对个人上下文的理解，以及在应用内和跨应用执行操作。

寻找外部供应方的消息随后出现。Bloomberg 在 [2025 年 8 月的原创报道](https://news.bloomberglaw.com/tech-and-telecom-law/apple-explores-using-google-gemini-ai-to-power-revamped-siri)中援引知情人士称，苹果正在与 Google 商谈定制 Siri 所需的模型，Google 已开始训练可在苹果服务器上运行的版本。11 月，Bloomberg 又在[关于拟议交易的报道](https://www.bloomberg.com/news/articles/2025-11-05/apple-plans-to-use-1-2-trillion-parameter-google-gemini-model-to-power-new-siri)中给出约每年 10 亿美元、涉及 1.2 万亿参数模型的数字。这些来自消息人士，1 月的联合公告确认了合作，没有确认金额与参数规模。

苹果自己的研发也在继续。其 [2025 年模型技术报告](https://machinelearning.apple.com/research/apple-foundation-models-tech-report-2025)介绍了约 30 亿参数的设备端模型，以及供 Private Cloud Compute 使用的服务器模型，并说明了图像理解、工具调用和开发者框架等能力。引入 Gemini 之后，这条研发路线增加了外部技术来源，后续产品仍使用 Apple Foundation Models 这一模型家族。

## Gemini 参与基础模型，苹果继续完成系统集成

Apple Foundation Models 承担语言理解、生成和推理等底层工作；Apple Intelligence 是围绕模型构建的系统功能；Siri 是用户发出请求、查看回答和执行操作的入口。1 月的[联合声明](https://blog.google/company-news/inside-google/company-announcements/joint-statement-google-apple/)把 Gemini 的位置放在基础模型开发这一层，再由这些模型支持 Siri 等功能。

后续公开的[第三代基础模型资料](https://machinelearning.apple.com/research/introducing-third-generation-of-apple-foundation-models)让合作内容具体起来。苹果介绍了与 Google 合作定制的五个模型：设备端包含通用的 AFM 3 Core 和面向更强硬件的 Core Advanced；云端包含处理常规任务的 AFM 3 Cloud、负责图像生成与编辑的 ADM 3 Cloud，以及用于复杂推理和多步工具调用的 AFM 3 Cloud Pro。它们根据任务和硬件分工，供同一套系统功能调用。

模型如何利用 Gemini，苹果还在 WWDC 会后做了解释。根据[在场记者 Gori.me 的记录](https://gori.me/en/apple/apple-news/167000/)，苹果使用 Gemini 前沿模型的输出改进自己的模型。参与训练与用户发出请求时直接调用 Gemini，是不同的运行安排；苹果对新 Siri 的解释把 Google 的作用放在模型开发过程中，并将实际执行的模型称为 AFM。

<figure>
  <a href="../../images/articles/apple-gemini/siri-ai-architecture.jpg" aria-label="查看 Siri AI 架构图完整尺寸"><img src="../../images/articles/apple-gemini/siri-ai-architecture.jpg" width="1306" height="1306" loading="lazy" alt="苹果公布的 Siri AI 架构图：基础模型位于系统调度器内部，外围连接个人上下文、屏幕感知、世界知识和应用动作。"></a>
  <figcaption>WWDC 2026 公布的 Siri AI 架构示意。图片版权归 Apple；<a href="https://www.apple.com/newsroom/2026/06/apple-introduces-siri-ai-a-profoundly-more-capable-and-personal-assistant/">原始发布页</a>。</figcaption>
</figure>

基础模型之外，苹果需要把请求连接到设备上的数据与操作。根据 [Siri AI 发布说明](https://www.apple.com/newsroom/2026/06/apple-introduces-siri-ai-a-profoundly-more-capable-and-personal-assistant/)，系统调度器调用本地的 Spotlight 索引与 App Toolbox，让 Siri 查找消息、邮件和照片，并执行相应动作。第三方应用接入 Spotlight 后，相关内容也可以参与个人上下文搜索。

苹果展示的用法包括，从朋友发过的消息中找出餐厅推荐，或根据当前屏幕上的聚餐信息讨论菜谱，再把菜谱存入备忘录。用户的请求省略了应用名、文件位置和操作步骤；系统需要补出这些信息，并把模型生成的计划落实为应用中的动作。

<figure class="article-figure-portrait">
  <a href="../../images/articles/apple-gemini/siri-personal-context.jpg" aria-label="查看 Siri 个人上下文演示完整尺寸"><img src="../../images/articles/apple-gemini/siri-personal-context.jpg" width="1306" height="1829" loading="lazy" alt="苹果演示截图：群聊讨论给宠物取名，Siri 根据聊天中原有名字 Rico 的信息推荐押韵的新名字。"></a>
  <figcaption>WWDC 2026 的个人上下文演示。图片版权归 Apple；<a href="https://www.apple.com/newsroom/2026/06/apple-introduces-siri-ai-a-profoundly-more-capable-and-personal-assistant/">原始发布页</a>。</figcaption>
</figure>

## 私有云扩展到 Google Cloud

1 月的公告说，Apple Intelligence 将继续在苹果设备与 Private Cloud Compute 上运行。PCC 是苹果为云端 AI 推理设计的系统。根据 [2024 年的安全说明](https://security.apple.com/blog/private-cloud-compute/)，需要更强算力的请求可以交给服务器处理；个人数据只用于完成当次计算，响应返回后不保留。服务器软件可以接受外部研究者检查，用户设备也会验证自己连接的运行环境。

2026 年 6 月，苹果[宣布将 PCC 扩展到第三方数据中心](https://security.apple.com/blog/expanding-pcc/)。其中 AFM 3 Cloud Pro 使用 Google Cloud 中的 NVIDIA GPU，处理复杂推理和多步工具调用。这给出了 Google 云技术在合作中的一个具体用途，也让 PCC 从最初全部基于苹果芯片的部署，扩展到新的硬件环境。

苹果称，它仍控制 PCC 软件，设备只信任由苹果以密码学方式批准的软件；[Google Cloud 的技术说明](https://cloud.google.com/blog/products/identity-security/powering-the-next-era-of-confidential-ai)则介绍了 Intel TDX、NVIDIA 机密计算和 Titan 芯片等隔离措施，用于保护计算中的数据。两家公司将这套环境描述为延续 PCC 保证的推理平台，外部研究者的验证能力也被列入设计要求。

## Google 获得系统入口，ChatGPT 保留扩展位置

这项协议给 Google 带来了 Gemini 应用以外的分发途径：模型技术可以通过苹果的 Siri 和系统功能到达用户。用户处理手机里的信息时，无需先安装 Gemini 或主动切换到 Google 的应用。对苹果而言，助手的界面、系统入口和应用连接继续由自己提供，基础模型开发与部分云端算力则引入 Google 的支持。

OpenAI 与苹果的合作在公告当天继续存在。[路透社向苹果求证后报道](https://www.reuters.com/business/google-apple-enter-into-multi-year-ai-deal-gemini-models-2026-01-12/)，ChatGPT 集成当时没有重大变化。苹果现行的 [iPhone 使用手册](https://support.apple.com/en-euro/guide/iphone/iph00fd3c8c2/ios)也保留了开启、关闭和连接 ChatGPT 账户的设置：用户可以决定发送哪些内容，以及是否允许 Siri 自动转交请求。Google 参与开发苹果的基础模型，ChatGPT 则作为可选的外部扩展提供服务。

争议集中在分发权进一步向 Google 集中的问题上。马斯克在 [1 月 12 日的 X 回复](https://x.com/elonmusk/status/2010785742427979894)中，援引 Google 已拥有 Android 和 Chrome，批评这项合作使权力过于集中；[路透社同时记录了这条发言](https://www.reuters.com/business/google-apple-enter-into-multi-year-ai-deal-gemini-models-2026-01-12/)。他的 xAI 也在竞争基础模型市场，因此这既是对分发格局的批评，也来自一个竞争者。

在 1 月 14 日起的 [Reddit r/apple 讨论串](https://www.reddit.com/r/apple/comments/1qcnf5b/google_geminipowered_siri_will_reportedly_have/)中，有用户直接写道“我们只关心什么时候能用”，也有人询问能否保证隐私，担心个人资料会进入 Google 系统。回复者贴出了联合声明中的 PCC 承诺。这里的分歧落在交付时间和数据处理上，与讨论哪家公司模型更强的竞争叙事有所不同。

## 从开发者测试到分批交付

2026 年 6 月 8 日，苹果[公布 Siri AI 并开放开发者测试](https://www.apple.com/newsroom/2026/06/apple-introduces-siri-ai-a-profoundly-more-capable-and-personal-assistant/)。除个人上下文、屏幕理解和更多应用操作外，苹果增加了独立的 Siri 应用，用来回看跨设备的对话记录。9 月 14 日，[Siri AI 开始随新系统向用户推出](https://www.apple.com/newsroom/2026/09/siri-ai-a-profoundly-more-capable-and-personal-assistant-is-here/)，首批以英语测试版提供，要求设备支持 Apple Intelligence。

10 月 26 日，苹果[随 27.2 系统更新增加法语、日语、韩语、葡萄牙语和西班牙语](https://www.apple.com/newsroom/2026/10/siri-ai-is-available-in-more-languages-starting-today/)。当时 Siri AI 仍标为测试版，欧盟的 iOS、iPadOS 和 watchOS 暂未开放。苹果还说明，部分依赖服务器模型的功能有每日使用额度，未来会提供付费扩展访问。这使实际使用范围进一步取决于语言、地区和服务额度。

中国市场采用另一条推出路径。[苹果 10 月 31 日的中国区公告](https://www.apple.com.cn/newsroom/2026/10/apple-intelligence-features-are-coming-to-users-in-china/)安排首批 Apple 智能功能于 11 月 4 日开始开发者测试，计划在 12 月随 iOS 27.3 正式推出，并在部分体验中接入阿里巴巴千问。公告明确，这批更新不含 Siri AI 和 WWDC 2026 公布的其他下一代功能。

## 参考资料

- [Google 与苹果联合声明，2026 年 1 月 12 日](https://blog.google/company-news/inside-google/company-announcements/joint-statement-google-apple/)
- [苹果：Apple Intelligence 首次发布，2024 年 6 月 10 日](https://www.apple.com/newsroom/2024/06/introducing-apple-intelligence-for-iphone-ipad-and-mac/)
- [Daring Fireball：苹果发言人关于个性化 Siri 延期的声明，2025 年 3 月 7 日](https://daringfireball.net/2025/03/apple_is_delaying_the_more_personalized_siri_apple_intelligence_features)
- [Bloomberg：苹果与 Google 商谈为 Siri 定制模型，2025 年 8 月 22 日](https://news.bloomberglaw.com/tech-and-telecom-law/apple-explores-using-google-gemini-ai-to-power-revamped-siri)
- [Bloomberg：苹果拟议中的 Siri 模型交易，2025 年 11 月 5 日](https://www.bloomberg.com/news/articles/2025-11-05/apple-plans-to-use-1-2-trillion-parameter-google-gemini-model-to-power-new-siri)
- [Apple Machine Learning Research：基础语言模型技术报告，2025 年 7 月](https://machinelearning.apple.com/research/apple-foundation-models-tech-report-2025)
- [Apple Machine Learning Research：第三代基础模型，2026 年 6 月 8 日](https://machinelearning.apple.com/research/introducing-third-generation-of-apple-foundation-models)
- [Gori.me：WWDC 会后技术说明会现场记录，2026 年 6 月 9 日](https://gori.me/en/apple/apple-news/167000/)
- [Apple Security Research：Private Cloud Compute 架构，2024 年 6 月 10 日](https://security.apple.com/blog/private-cloud-compute/)
- [Apple Security Research：扩展 Private Cloud Compute，2026 年 6 月 8 日](https://security.apple.com/blog/expanding-pcc/)
- [Google Cloud：面向苹果 PCC 的机密计算，2026 年 6 月](https://cloud.google.com/blog/products/identity-security/powering-the-next-era-of-confidential-ai)
- [路透社：合作公告与 ChatGPT 集成的后续安排，2026 年 1 月 12 日](https://www.reuters.com/business/google-apple-enter-into-multi-year-ai-deal-gemini-models-2026-01-12/)
- [苹果 iPhone 使用手册：ChatGPT 扩展的设置与数据处理](https://support.apple.com/en-euro/guide/iphone/iph00fd3c8c2/ios)
- [马斯克在 X 上对合作公告的回复，2026 年 1 月 12 日](https://x.com/elonmusk/status/2010785742427979894)
- [Reddit r/apple：用户对新 Siri 功能、交付时间及隐私的讨论，2026 年 1 月 14 日起](https://www.reddit.com/r/apple/comments/1qcnf5b/google_geminipowered_siri_will_reportedly_have/)
- [苹果：Siri AI 发布与开发者测试，2026 年 6 月 8 日](https://www.apple.com/newsroom/2026/06/apple-introduces-siri-ai-a-profoundly-more-capable-and-personal-assistant/)
- [苹果：Siri AI 开始向用户推出，2026 年 9 月 14 日](https://www.apple.com/newsroom/2026/09/siri-ai-a-profoundly-more-capable-and-personal-assistant-is-here/)
- [苹果：Siri AI 增加五种语言，2026 年 10 月 26 日](https://www.apple.com/newsroom/2026/10/siri-ai-is-available-in-more-languages-starting-today/)
- [苹果：中国市场首批 Apple 智能功能的推出安排，2026 年 10 月 31 日](https://www.apple.com.cn/newsroom/2026/10/apple-intelligence-features-are-coming-to-users-in-china/)
