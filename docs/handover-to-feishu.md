# FishX 飞书继续开发 · 完整会话交接包

> **用途**：把当前元宝会话完整平移到飞书继续开发
> **时间**：2026-06-25
> **项目**：FishX（鱼渔娱）App · Uni-app H5
> **视觉风格**：iOS 浅紫，沿用 V2 蓝紫渐变

---

## 0. 一句话 TL;DR

> FishX = **工具 + 数据 + AI 参谋** · 2 Tab + 中央 FAB · V1 阶段只做**鱼获识别 + 文案打磨**· AI 靠后。风格沿用 V2（蓝紫渐变 + 玻璃感 + Hero+chip）。6 个页面原型已写完并部署到 EdgeOne，SQLite 已存 8 鱼种 + 表结构，**准备交给 Codex 实现**。

---

## 一、6 个页面原型（已全部部署）

| # | 页面 | EdgeOne 预览 | 核心内容 |
|---|---|---|---|
| 1 | **today（首页）** | https://mcp.edgeone.site/share/bENVMewVE46cRCmEOtLEA | Hero(天气+潮汐+建议) + AI 鱼小渔 + 我的鱼获 + 图鉴入口 |
| 2 | **catch-detail（鱼获详情）** | https://mcp.edgeone.site/share/YhCTQd5p8mSpXA3n7N8pq | 轮播图 + 鱼种百科摘要 + 字段 + 3 CTA + 5 风格文案 |
| 3 | **capture（拍照）** | https://mcp.edgeone.site/share/CuCKl537U_8zgStMRqROU | 取景框 + 分类切换 + loading 弹层 + 结果弹层（识别完成后会出） |
| 4 | **species-detail（鱼种图鉴）** | https://mcp.edgeone.site/share/IrpZKkpwtxxWGYSNsAVYv | 形色式长文页 + 一鱼一名 + 趣闻 + 钓法 + 食用 + 小百科 + 同科鱼 |
| 5 | **catch-list（鱼获库）** | https://mcp.edgeone.site/share/C87dUjrylhJSRJ83vwRaD | 筛选器 + 按月分组 + 鱼获卡片（含鱼种 chip） |
| 6 | **mine（我的）** | https://mcp.edgeone.site/share/YLSjCG8CdYgS97XYfPpmg | 用户+等级+统计 + 工具 4 格子(战报/文案/年报/图鉴) + 数据共享 + 时间线 |

> 所有页面本地源文件：`~/yesxp/fishx/demo/fishx-ai-v3/*.html`

---

## 二、视觉规范（沿用 V2）

### 色彩
```css
--b: #5865F2;       /* 主色 蓝 */
--b2: #8B5CF6;      /* 辅色 紫 */
--ink: #1C1C1E;     /* 主文字 */
--ink2: #3C3C43;    /* 次文字 */
--muted: #8E8E93;   /* 弱文字 */
--bg: #F2F3F7;      /* 页面背景 */
--card: #FFFFFF;    /* 卡片背景 */
--good: #34C759;    /* 成功/绿 */
--warn: #FF9500;    /* 警告/橙 */
--bad: #FF3B30;     /* 错误/红 */
--gold: #FFD700;    /* 金 */
--glass: rgba(255,255,255,.72);  /* 玻璃效果 */
```

### 组件规范
- **圆角**：卡片 24px / 按钮 14px / chip 100px
- **阴影**：`0 2px 6px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.06)`
- **背景**：渐变蓝紫 + 圆形 radial 装饰
- **按钮**：主按钮 = 蓝紫渐变；次按钮 = 白底边框；FAB = 圆形 64px 渐变 + ripple 动效
- **字体**：iOS 系统字体栈，-apple-system, "PingFang SC"

### 页面结构
- **状态栏**：54px
- **顶栏**：54px（不同页有变体：沉浸式顶栏用于物种详情）
- **Tabbar**：96px（底部，含 FAB 槽位）
- **FAB**：64px 圆形，居中凸起

---

## 三、已敲定的核心决策（20 条）

| # | 决策 | 内容 |
|---|---|---|
| 1 | 风格 | iOS 浅紫沿用 V2（蓝紫渐变 + 玻璃感 + Hero+chip） |
| 2 | 页面架构 | 5 主页面 + 1 物种页 + 3 弹层（拍照 loading / 结果 / 补字段） |
| 3 | 拍照流 | 拍照 → loading（1-3s）→ **结果弹层**（不跳页）→ 补字段抽屉 → 保存 |
| 4 | 鱼种识别 | 第一张为主图（primary_photo_index=0），可切换 |
| 5 | 重量字段 | **选填**（AI 估算 + 后补），不强制必填 |
| 6 | spot_geo | **必填**（EXIF 自动读 → 失败手动选点），地图基础 |
| 7 | 鱼种图鉴 | 形色式纯知识页，**不混"我的战绩"**——单独页面 |
| 8 | 两表关系 | **鱼种表（共享） + 鱼获表（私有）独立**，通过视图 JOIN |
| 9 | 文案素材库 | 鱼种表 `copywriting_seeds` JSON 字段（5 风格 × 3 句） |
| 10 | 鱼种覆盖 | V1 = 8 种（鲫/鲤/草/鲈/翘嘴/罗非/鲶/鳊） |
| 11 | AI 鱼小渔 V1 | 跑公共数据（天气/潮汐/通用知识），**不挂鱼获数据** |
| 12 | 文案工具位置 | 整合到**鱼获详情页**（5 风格卡 + 编辑 + 复制） |
| 13 | 副标题 | 钩子式疑问句（"为什么叫 XX 鱼？"）形色式 |
| 14 | 一鱼一名 | 必有 section（名字由来 + 俗名） |
| 15 | 鱼种图鉴 section | 数据库驱动（鱼种简介/趣闻/钓法/食用/小百科），不是固定模板 |
| 16 | 存储 | 开发期全 **SQLite**；生产期 TCB MongoDB 集合 |
| 17 | 我的战绩 | 单独页面 = 单鱼种鱼获列表筛选视图 |
| 18 | 鱼获时间线 | 按月分组（沿用 V2 设计） |
| 19 | 鱼种关联 | `related_species` 字段（鲤科 4 种互相推荐） |
| 20 | AI 识别 V1 | 百度动物识别 API（中文、便宜、免训练） |

---

## 四、数据 / 文件结构

### 项目目录
```
~/yesxp/fishx/
├── docs/
│   ├── DATABASE.md                  # MongoDB 集合定义（生产期）
│   ├── schema.dev.sql               # SQLite DDL（开发期）★
│   ├── fish-species-seed.sql        # 8 鱼种种子数据 ★
│   ├── development-storage.md       # SQLite → TCB 迁移策略 ★
│   ├── handover-to-feishu.md        # 本文档
│   ├── PRD.md / design.md / stories.md / TENCENT_CLOUD.md
│   └── dev.sqlite                   # 本地数据库（gitignore）
├── demo/fishx-ai-v3/                # V3 原型（最新）★
│   ├── today.html
│   ├── catch-list.html
│   ├── catch-detail.html
│   ├── capture.html
│   ├── mine.html
│   └── species-detail.html
├── demo/fishx-ai-v2/                # V2 原型（旧参考）
│   ├── today-v2.2.html              # V2 视觉风格基准
│   ├── capture.html
│   └── mine.html
└── src/                              # Uni-app 项目（Codex 实现）
    ├── pages/
    ├── api/
    ├── stores/
    └── ...
```

★ = 飞书启动后**优先看**的

### Git 状态
- 已 commit + push 到 `yesxp/fishx`（main 分支）
- 最新 commit: `a60bcd7b feat(data): 8 鱼种百科 + SQLite schema + 存储策略文档`

---

## 五、SQLite 数据结构

### `fish_species` 表（8 行已入库）

| 字段 | 类型 | 说明 |
|---|---|---|
| id | TEXT | sp-001 ~ sp-008 |
| zh_name | TEXT | 中文名 |
| emoji | TEXT | 🐟 / 🐠 / 🐡 / 🎏 |
| common_names | TEXT | JSON 数组 |
| scientific_name | TEXT | 学名 |
| family | TEXT | 科属 |
| difficulty | TEXT | 易/中/难 |
| water_layer | TEXT | 上/中/下/底层 |
| feeding | TEXT | 杂食/肉食/草食 |
| season | TEXT | JSON 数组 |
| weight_range | TEXT | "0.2-1.0kg" |
| distribution | TEXT | 分布水域 |
| **subtitle** | TEXT | **钩子疑问句**（"为什么叫 XX？"） |
| description | TEXT | 鱼种简介 |
| one_fish_one_name | TEXT | 名字由来 |
| fun_facts | TEXT | 钓鱼趣闻 |
| taste | TEXT | 食用价值 |
| tactics | TEXT | 钓法技巧 |
| **copywriting_seeds** | TEXT | **JSON: 5 风格 × 3 句种子文案** |
| related_species | TEXT | JSON 数组 |

### `catches` 表（待用户录入）

| 字段 | 类型 | 必填 | 来源 |
|---|---|---|---|
| id | TEXT | ✓ | 系统 |
| user_id | TEXT | ✓ | 系统 |
| species_id | TEXT FK | ✓ | AI 识别 |
| photo_urls | TEXT JSON | ✓ | 系统 |
| primary_photo_index | INT | ✓ | 默认 0 |
| weight_estimated_g | INT | — | AI 拍照估算 |
| weight_g | INT | **— 选填** | 用户确认 |
| weight_confirmed | INT | — | 0/1 |
| species_confidence | REAL | — | 0-1 |
| species_corrected | INT | — | 静默收集反哺 |
| caught_at | TEXT | ✓ | EXIF |
| spot_geo_lat | REAL | **✓ 必填** | EXIF/手动 |
| spot_geo_lng | REAL | **✓ 必填** | EXIF/手动 |
| spot_name | TEXT | — | 钓点 |
| weather | TEXT JSON | — | 和风 API |
| method | TEXT | — | 台钓/路亚... |
| bait | TEXT JSON | — | 饵料多选 |
| mood_tags | TEXT JSON | — | 得意/谦虚/... |
| note | TEXT | — | 200 字 |

### 视图
- `v_catches_with_species` — 鱼获 + 鱼种摘要 JOIN
- `v_species_user_stats` — 鱼种解锁 + 战绩统计（运行时计算）

---

## 六、Codex 启动指令模板

> **复制这段给 Codex：**

```
【项目】
- 路径：~/yesxp/fishx
- 框架：Uni-app Vue3 + TS + Vite
- 部署：wxap.cn/fishx（H5 首发）
- Wot UI 组件库：已装 @wot-ui/ui

【设计参考（必看）】
- V3 原型（最新）：~/yesxp/fishx/demo/fishx-ai-v3/*.html
- V2 风格基准：~/yesxp/fishx/demo/fishx-ai-v2/today-v2.2.html
- 6 个页面的 EdgeOne 预览见 docs/handover-to-feishu.md

【数据】
- 开发期：SQLite ~/yesxp/fishx/docs/dev.sqlite
- Schema：~/yesxp/fishx/docs/schema.dev.sql
- 8 鱼种种子：~/yesxp/fishx/docs/fish-species-seed.sql
- 未来生产：TCB MongoDB 集合（看 DATABASE.md）

【6 个页面清单（按 P0 → P1 顺序）】
1. today 首页（hero + AI 鱼小渔 + 我的鱼获 + 鱼种图鉴入口）
2. catch/list 鱼获库（筛选器 + 按月分组）
3. catch/detail 鱼获详情（轮播 + 鱼种摘要 + 字段 + 3 CTA + 5 风格文案）
4. capture 拍照（取景框 + 分类切换 + loading + 结果弹层 + 补字段抽屉）
5. species/detail 鱼种图鉴（形色式长文页 + 小百科 + 最近钓获 + 同科鱼）
6. mine 我的（用户 + 等级 + 统计 + 工具 4 格子 + 数据共享 + 时间线）

【视觉铁律】
- 严格按 V3 原型实现
- 沿用 V2 蓝紫渐变 + 玻璃感 + Hero+chip 体系
- CSS 变量从原型复制
- iOS 浅紫调

【技术铁律】
- 只改指定文件，不顺手改其他
- 不要用 wd-tabbar 替换原生 tabBar
- 不要用 wd-navbar fixed（H5 safe-area 问题）
- 完成后立即构建+提交+推送
- 用 Wot UI 组件 + 自定义 CSS

【交付】
每个页面：vue 文件路径 + 截图/EdgeOne 预览 URL
```

---

## 七、当前进度

| 阶段 | 状态 |
|---|---|
| **产品定位** | ✅ 敲定（工具+数据双引擎，AI 靠后） |
| **页面架构** | ✅ V3 5 页 + 3 弹层定稿 |
| **数据字段** | ✅ 鱼种表 + 鱼获表定稿（11 决策点全部敲定） |
| **SQLite Schema** | ✅ 跑通（fish_species + catches + 2 视图） |
| **8 鱼种种子数据** | ✅ 全部入库 |
| **V3 原型 HTML × 6** | ✅ 全部写完 + 全部部署到 EdgeOne |
| **TCB 迁移路径** | ✅ SQLite → MongoDB 一次性导入 |
| **Codex 实现** | ⏸ **下一步：等 Hermes 启动后交给 Codex** |

---

## 八、Codex 启动后的 5 步流程

1. **Hermes 读本文件** → 加载完整上下文
2. **Codex 接收指令**（用第六节模板）
3. **逐页实现**（P0 → P1 顺序），每页构建+提交+推送
4. **每页完成 → EdgeOne 部署 → 视觉验证**（用 browser_vision）
5. **全部完成 → 整合测试 → 用户验收**

---

## 九、关键提醒

| 事项 | 提醒 |
|---|---|
| 8 鱼种校对 | 文案素材 / 习性 / 副标题钩子等需要用户 review，Codex 不要自作主张改 |
| AI 鱼小渔 V1 | 只接公共 API（天气/潮汐/通用知识），**不接鱼获数据** |
| AI 鱼种识别 V1 | 用百度动物识别 API，不要自建模型 |
| 文案工具 V1 | 5 风格种子 + LLM 润色，**不直接给用户看种子** |
| 鱼种副标题 | 必须是疑问句钩子，**不要改成陈述句** |
| 我的战绩 | 不要塞进鱼种图鉴页，**单独页面** |
| 文案打磨 | 整合在鱼获详情页，**不要独立页面** |

---

## 十、飞书启动后第一句话

```
@Hermes 这是 FishX V3 项目交接包。
请读 ~/yesxp/fishx/docs/handover-to-feishu.md
加载上下文后，从第六节"Codex 启动指令"开始执行。
```

**Hermes 收到后**：
1. 读本文档
2. 加载元宝会话上下文（如有需要）
3. 启动 Codex 实现流程
4. 逐页 review 用户原型的视觉
5. 按 P0 → P1 实现 6 个页面

---

**飞书见。**
