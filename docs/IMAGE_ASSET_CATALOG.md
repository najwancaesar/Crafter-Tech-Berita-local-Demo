# Shangbao Indonesia — Local Image Asset Catalog

## 1. Overview & Directory Organization

This catalog details all local raster and vector image assets integrated into the **Shangbao Indonesia** frontend reconstruction prototype (`c:\laragon\www\shangbao-reconstruction`).

The directory structure is normalized to standard lowercase naming conventions for full compatibility with Linux-based Docker environments in **CrafterCMS 4.x**:

- `assets/images/articles/`: 36 editorial photographs for news articles and hero carousel.
- `assets/images/sidebar/`: 2 promotional and financial graphics (`e-paper2.jpg`, `finance.jpg`) plus SVG fallback.
- `assets/images/brand/`: Core branding assets (Shangbao masthead logo, Google Play badge, App Store badge).
- `assets/images/banners/`: Header advertising banners (`head-ad-banner.svg`).
- `assets/images/backgrounds/`: CSS decorative background texture artwork (`texture-vignette.svg`).
- `assets/images/placeholders/`: Neutral SVG fallback placeholders (`hero-placeholder.svg`, `news-placeholder.svg`).

---

## 2. Editorial & Sidebar Raster Asset Inventory (38 Assets)

| # | Filename | Canonical Path | Dimensions | Ratio | Visual Subject / Scene Description | Target Category | Matched Article ID & Headline | Placement | Confidence |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `Gas station.jpg` | `assets/images/articles/Gas station.jpg` | 700x430 | 1.63 | 加油站与油枪特写（Pertamina SPBU 红色加油泵） | 财经 (Economy) | `economy-1793073564`: 北塔米纳增加燃油供应 并延长加油站营业时间 | Hero Slide 1 / Category Lead | **High (Exact Match)** |
| 2 | `Gold antara.jpg` | `assets/images/articles/Gold antara.jpg` | 700x430 | 1.63 | Antam 黄金条块与贵金属检验（Antara 通讯社金条实拍） | 财经 (Economy) | `economy-1793073483`: 今日Antam金价暴涨 1克价格255万盾 | Hero Slide 2 / Lead Story | **High (Exact Match)** |
| 3 | `Air plane.jpg` | `assets/images/articles/Air plane.jpg` | 700x430 | 1.63 | 民航客机机坪准备与飞行（AirAsia / 商业民航） | 财经 (Economy) | `economy-1793071177`: 交通部计划2026/2027年圣诞节和新年期间 将机票价格降低11%-13% | Hero Slide 3 / Lead Story | **High (Exact Match)** |
| 4 | `Corporate human.jpg` | `assets/images/articles/Corporate human.jpg` | 700x430 | 1.63 | 印尼人民银行 (BRI) 柜台业务与小额信贷服务专员 | 金融 (Financial) | `financial-1793069962`: BRI前8个月发放KUR达144.59万亿盾，惠及276万借款人 | Hero Slide 4 / Lead Story | **High (Exact Match)** |
| 5 | `Moneyfestation.jpg` | `assets/images/articles/Moneyfestation.jpg` | 700x430 | 1.63 | 印尼盾币钞票（Rupiah）整理与外汇货币储备 | 金融 (Financial) | `financial-1793069151`: 印尼央行持续监测盾币汇率 应对市场波动 | Hero Slide / Story Grid | **High (Exact Match)** |
| 6 | `Bank of china.jpg` | `assets/images/articles/Bank of china.jpg` | 1063x614 | 1.73 | 中国银行雅加达分行外景与中印尼本币双边金融交易 | 金融 / 国外新闻 | `financial-1793069437`: 印尼央行：2026年本币交易额目标达550亿美元 | Hero Slide 5 / Lead Story | **High (Exact Match)** |
| 7 | `Market modal.jpg` | `assets/images/articles/Market modal.jpg` | 700x430 | 1.63 | 印尼证券交易所 (IDX - Pasar Modal) 电子行情大屏 | 金融 (Financial) | `financial-1793068056`: 印尼股市周二开盘下跌15.13点 | Story Grid / Lead Story | **High (Exact Match)** |
| 8 | `Mrs. puji.jpg` | `assets/images/articles/Mrs. puji.jpg` | 700x430 | 1.63 | 印尼国会议长普安·马哈拉妮 (Puan Maharani) 公开发言 | 政治 (Politics) | `politics-1793023446`: 普安呼吁加强医院基础设施 应对森林与土地火灾导致患者激增 | Category Lead Story | **High (Exact Match)** |
| 9 | `Forek Hulu Migas.jpg` | `assets/images/articles/Forek Hulu Migas.jpg` | 700x430 | 1.63 | 印尼上游油气特别工作组 (SKK Migas) 论坛与天然气管道管网 | 政治 (Politics) | `politics-1792920849`: 新加坡总理回应印尼削减天然气供应 对这类地缘与能源供应风险早有准备 | Story Grid | **High (Exact Match)** |
| 10 | `Meet up.jpg` | `assets/images/articles/Meet up.jpg` | 700x430 | 1.63 | 内阁秘书与政府高官双边工作会谈 | 政治 (Politics) | `politics-1792764653`: 内阁秘书接见海洋与渔业部长 讨论加强红白渔村项目建设进展 | Story Grid | **High (Exact Match)** |
| 11 | `President moment.jpg` | `assets/images/articles/President moment.jpg` | 600x340 | 1.76 | 普拉博沃·苏比延多总统 (Prabowo Subianto) 官方国政演讲特写 | 政治 (Politics) | `politics-1792679463`: 印尼经济世界排名第7位 普拉博沃称财富必须公平分配 | Hero Carousel / Lead Story | **High (Exact Match)** |
| 12 | `President - moment 2.jpg` | `assets/images/articles/President - moment 2.jpg` | 700x430 | 1.63 | 普拉博沃总统出席多国高级防务合作签署会 | 政治 (Politics) | `politics-1792679561`: 印尼、土耳其、卡塔尔、巴基斯坦 共同签署防务合作协议 | Story Grid | **High (Exact Match)** |
| 13 | `BEM Ui Dukuh atas.jpg` | `assets/images/articles/BEM Ui Dukuh atas.jpg` | 700x430 | 1.63 | 雅加达红白大楼前学生与市民集会（肃贪会 KPK 外景） | 法律 (Law) | `hukum-1792767922`: 印尼肃贪委员会 调查前人民协商会议秘书长 | Category Lead Story | **High (Exact Match)** |
| 14 | `Security road.jpg` | `assets/images/articles/Security road.jpg` | 700x430 | 1.63 | 跨国执法合作与道路安全巡防设备检查 | 法律 (Law) | `hukum-1792665126`: 澳大利亚表示支持印尼打击网络诈骗 | Story Grid | **High (Thematic Match)** |
| 15 | `Police jobs - 4.jpg` | `assets/images/articles/Police jobs - 4.jpg` | 700x430 | 1.63 | 三宝垄警方经济犯罪调查与油料违规查扣发布会 | 法律 (Law) | `hukum-1792678077`: 三宝垄燃油分销违规案 预计造成65亿盾国家损失 | Story Grid | **High (Exact Match)** |
| 16 | `Police jobs-3.jpg` | `assets/images/articles/Police jobs-3.jpg` | 700x430 | 1.63 | 中爪哇省警察厅打击赌博和非法无证酒类案件证物通报 | 法律 (Law) | `hukum-1792505458`: 中爪哇省警察破获赌博和无证酒类交易案 | Story Grid | **High (Exact Match)** |
| 17 | `Police jobs.jpg` | `assets/images/articles/Police jobs.jpg` | 600x340 | 1.76 | 西爪哇警方刑侦发布会（捣毁地下硬性非法制毒工厂实物） | 法律 (Law) | `hukum-1792334834`: 西爪哇警方捣毁日产能800万粒的非法硬性毒品工厂 | Story Grid | **High (Exact Match)** |
| 18 | `Police jobs -2.jpg` | `assets/images/articles/Police jobs -2.jpg` | 376x183 | 2.05 | 警务人员执法行动与犯罪防控警戒条 | 法律 (Law) | `editorial-1792677606`: 社论：印尼央行力保盾币稳定 实体经济生产力需提升 | Category Fallback Pool | **Category-Pool** |
| 19 | `Cleaning service machine.jpg` | `assets/images/articles/Cleaning service machine.jpg` | 700x430 | 1.63 | 雅加达环卫机械化作业车与垃圾清运综合治理 | 首都动态 (Metropolitan) | `metropolitan-1793024041`: 雅京省政府将提供3620亿盾 作为班塔尔格邦垃圾处理场补偿金 | Category Lead Story | **High (Exact Match)** |
| 20 | `Suhut.jpg` | `assets/images/articles/Suhut.jpg` | 700x430 | 1.63 | 雅加达省长候选人普拉莫诺 (Pramono Anung) 社区视察 | 首都动态 (Metropolitan) | `metropolitan-1792942444`: 历经25年许可斗争后 Pramono为基督复临安息日会教堂揭幕 | Story Grid | **High (Exact Match)** |
| 21 | `Infrastruktur relationship.jpg` | `assets/images/articles/Infrastruktur relationship.jpg` | 600x340 | 1.76 | 雅加达省政府与企业界共建基础设施工程签约 | 首都动态 (Metropolitan) | `metropolitan-1792936002`: 普拉莫诺赞赏雅京省政府 不使用地方预算改善基础设施 | Story Grid | **High (Exact Match)** |
| 22 | `Road Improvement Project.jpg` | `assets/images/articles/Road Improvement Project.jpg` | 700x430 | 1.63 | 道路铺设与城市主干道提升工程（沥青摊铺与工程机械） | 首都动态 (Metropolitan) | `metropolitan-1792936918`: 凭借以服务为导向经营理念 雅加达银行荣获市场数字化4.0奖项 | Story Grid | **Thematic Match** |
| 23 | `Train.jpg` | `assets/images/articles/Train.jpg` | 700x430 | 1.63 | 雅加达轻轨 (LRT Jakarta) 红色车厢高架运行 | 首都动态 (Metropolitan) | `metropolitan-1792764926`: 雅京省政府在达南塔拉支持下 测算轻轨网络延伸工程建设成本 | Story Grid | **High (Exact Match)** |
| 24 | `England country.jpg` | `assets/images/articles/England country.jpg` | 700x430 | 1.63 | 英国议会大厦与大本钟（英国国会及伦敦泰晤士河） | 评论 (Opinion) | `opinion-1784816528`: 英国政府豪夺英钢：既输了面子，又输了里子 | Lead Story | **High (Exact Match)** |
| 25 | `Plane.jpg` | `assets/images/articles/Plane.jpg` | 700x430 | 1.63 | 印尼空军C-130大力神运输机盐料人工降雨（灭火抗旱作业） | 社会 (Society) | `society-1793022678`: 印尼空军部署超级美洲狮直升机 参与扑灭拉武山森林和土地火灾 | Category Lead / Reference Featured | **High (Exact Match)** |
| 26 | `Community.jpg` | `assets/images/articles/Community.jpg` | 700x430 | 1.63 | 印尼华人社团宗亲宗祠祭祖典礼现场 | 华社 (Chinese Community) | `chinese-community-1792771332`: 雅加达廖氏宗亲会2026年秋祭祭祖典礼 荣获二项MURI证书 | Story Grid | **High (Exact Match)** |
| 27 | `Speech.jpg` | `assets/images/articles/Speech.jpg` | 700x430 | 1.63 | 印尼中华总商会商务会晤与政商嘉宾主旨演讲 | 华社 (Chinese Community) | `chinese-community-1792771116`: 厦门市思明区侨乡经济促进会代表团拜访印尼中华总商会 寻找商机 共话发展 | Story Grid | **High (Exact Match)** |
| 28 | `Speech-2.jpg` | `assets/images/articles/Speech-2.jpg` | 700x430 | 1.63 | 中印尼圆桌论坛专家主题演讲与交流 | 华社 (Chinese Community) | `chinese-community-1792770737`: "环球南方对话•中国印尼圆桌论坛"雅加达成功举行 | Story Grid | **High (Exact Match)** |
| 29 | `Teamwork relationships.jpg` | `assets/images/articles/Teamwork relationships.jpg` | 700x430 | 1.63 | 校企产学研合作与两国双园战略合作签约 | 华社 (Chinese Community) | `chinese-community-1792770527`: 福建技术师范学院携手印尼IPK集团共建海外实训基地 服务中印尼“两国双园”人才需求 | Story Grid | **High (Exact Match)** |
| 30 | `Images-2.jpg` | `assets/images/articles/Images-2.jpg` | 700x430 | 1.63 | 雅加达太阳城文艺晚会舞台演出（李莉师生音乐盛宴） | 华社 (Chinese Community) | `chinese-community-1792942692`: 李莉师生演唱会雅加达隆重举行 师生同台放歌 共享音乐盛宴 | Category Lead Story | **High (Exact Match)** |
| 31 | `PKD.jpg` | `assets/images/articles/PKD.jpg` | 700x430 | 1.63 | 印尼城市政府协会 (APEKSI) 地方治理与文化大会合影 | 教育与文化 (Culture) | `pendidikan-kebudayaan-1792159968`: APEKSI文化论坛 为加强政府间的合作平台 | Category Lead Story | **High (Exact Match)** |
| 32 | `National working reference.jpg` | `assets/images/articles/National working reference.jpg` | 700x430 | 1.63 | 印尼国家文化遗产展厅 Prajnaparamita 揭幕仪式 | 教育与文化 (Culture) | `pendidikan-kebudayaan-1791905274`: 印尼文化部长为Prajnaparamita展厅揭幕 | Story Grid | **High (Exact Match)** |
| 33 | `Bolts material.jpg` | `assets/images/articles/Bolts material.jpg` | 700x430 | 1.63 | 工业制造金属配件与机械加工管件材料 | 财经 (Economy) | `economy-1793049934`: 截至 2026 年 8 月 PGN实现29,574吨二氧化碳当量减排 | Story Grid | **Thematic Match** |
| 34 | `Export textile.jpg` | `assets/images/articles/Export textile.jpg` | 700x430 | 1.63 | 纺织服装出口制造与国际贸易集装箱货品 | 财经 (Economy) | `economy-1793049878`: 2026年上半年营收增长17% BWPT对2026年下半年前景表乐观 | Story Grid | **Thematic Match** |
| 35 | `Sir purbaya.jpg` | `assets/images/articles/Sir purbaya.jpg` | 700x430 | 1.63 | 存款保障署 (LPS) 主席普尔巴亚·尤迪·萨德瓦 (Purbaya Yudhi Sadewa) | 社论 (Editorial) | `editorial-1793022053`: 社论：未发放贷款额如此高 或许有三种原因存在 | Category Lead Story | **High (Exact Match)** |
| 36 | `Images - 3.jpg` | `assets/images/articles/Images - 3.jpg` | 700x430 | 1.63 | 中印尼高层战略对话机制全景 | 评论 (Opinion) | `opinion-1788183062`: 全面战略对话机制对中印尼有多重要？ | Category Lead Story | **High (Exact Match)** |
| 37 | `e-paper2.jpg` | `assets/images/sidebar/e-paper2.jpg` | 600x340 | 1.76 | 《印度尼西亚商报》官方电子报移动平板宣传画 (E-Paper 推广图) | 侧边栏推广卡片 (Sidebar Promo) | `sidebar-epaper-promo`: 印尼商报电子报 (E-Paper) 随时随地掌上阅读 | Sidebar Persistent Widget | **High (Brand Asset)** |
| 38 | `finance.jpg` | `assets/images/sidebar/finance.jpg` | 600x340 | 1.76 | 商报金融行情板块红色折线看板（“行情”看板图） | 侧边栏市场组件 (Sidebar Market) | `sidebar-finance-widget`: 市场行情看板 · 每日最新汇率与股指动态 | Sidebar Persistent Widget | **High (Brand Asset)** |

---

## 3. Vector (SVG) Asset Inventory (8 Assets)

| # | Filename | Canonical Path | ViewBox / Size | Category / Purpose | Visual Content Description |
|---|---|---|---|---|---|
| 1 | `logo-shangbao.svg` | `assets/images/brand/logo-shangbao.svg` | 680x90 | Branding | 商报红底反白主标识与「加强全民团结促经济繁荣」报头报标 |
| 2 | `google-play-badge.svg` | `assets/images/brand/google-play-badge.svg` | 156x50 | Branding / Mobile App | Google Play 官方下载徽章矢量复刻 |
| 3 | `app-store-badge.svg` | `assets/images/brand/app-store-badge.svg` | 156x50 | Branding / Mobile App | Apple App Store 官方下载徽章矢量复刻 |
| 4 | `head-ad-banner.svg` | `assets/images/banners/head-ad-banner.svg` | 960x90 | Advertising Banner | 印尼商报全媒体推广与广告招商顶部通栏横幅 |
| 5 | `texture-vignette.svg` | `assets/images/backgrounds/texture-vignette.svg` | 1920x1080 | Page Decor | 页面左右两侧深色暗纹光晕渐变背景纹理 |
| 6 | `hero-placeholder.svg` | `assets/images/placeholders/hero-placeholder.svg` | 960x514 | Fallback Placeholder | 轮播头条默认几何建筑新闻占位图 (Ratio ~1.87) |
| 7 | `news-placeholder.svg` | `assets/images/placeholders/news-placeholder.svg` | 400x260 | Fallback Placeholder | 分类列表默认新闻占位图 (Ratio 1.54) |
| 8 | `market-trends.svg` | `assets/images/sidebar/market-trends.svg` | 320x180 | Sidebar Fallback | 侧边栏市场行情备用矢量插图 |

---

## 4. Fallback Hierarchy & CrafterCMS Readiness

In the client-side runtime (`assets/js/images.js`), images resolve according to a 4-tier waterfall fallback strategy:

1. **Priority 1 (Direct ID Match):** `assets/images/articles/<articleId>.jpg` or `.png`
2. **Priority 2 (Deterministic Mapping):** Look up `window.SHANGBAO_IMAGES[articleId]` in `assets/js/images.js`
3. **Priority 3 (Category Round-Robin Pool):** Retrieve candidate image from `window.SHANGBAO_IMAGE_POOL` via consistent hashing of the article ID
4. **Priority 4 (Neutral SVG Placeholder):** Fallback to `assets/images/placeholders/news-placeholder.svg` (or `hero-placeholder.svg`)

### CrafterCMS FreeMarker Template Mapping
When migrated to CrafterCMS 4.x:
- Editorial images map to content model field `<photo type="image">` under `/static-assets/images/articles/`.
- Sidebar promotional banners map to component content type `/site/components/sidebar-promo.xml` with `<image>` element pointing to `/static-assets/images/sidebar/`.
- Category articles dynamically reference images through FreeMarker macros: `<@renderArticleCard article=item />`.
