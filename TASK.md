# Task: 鱼渔娱 (FishX) MVP

> 技术设计文档：`wiki/projects/fish-app/design.md`
> PRD + Stories：`wiki/projects/fish-app/PRD.md` + `wiki/projects/fish-app/stories.md`

---

## 项目概述

鱼渔娱 — 钓鱼人的一站式轻量工具。底座是渔获照片，贯穿互动。Uni-app Vue3 H5 版。

## 技术栈

- Uni-app (Vue 3 + TypeScript + Vite)
- Pinia 状态管理
- SCSS + CSS 变量
- 高德地图 JS API 2.0
- uniCloud 云函数 + 云数据库
- 和风天气 API
- 腾讯云图像识别（AI 识鱼）

## 项目约定

- 目录结构：按 `design.md §模块划分`
- 组件命名：PascalCase（`CatchCard.vue`）
- 文件命名：kebab-case（`fish-species.ts`）
- CSS 变量：统一在 `uni.scss` 定义
- API 调用：统一封装在 `api/` 目录

---

## 任务列表

### Task 1: 项目初始化
**Story:** 基础  
**耗时:** ~2h

1. 删除现有 `index.html`（旧占位页）
2. 初始化 Uni-app 项目：`npx degit dcloudio/uni-preset-vue#vite-ts fishx`
3. 安装依赖：`pinia`、`@dcloudio/uni-ui`
4. 配置 `uni.scss` 全局样式变量（品牌色、圆角、阴影）
5. 配置 `pages.json`：4 个 TabBar（首页/天时/钓点/我的）+ 中间 "+" 按钮
6. 配置 `manifest.json`：应用名"鱼渔娱"、appid 占位
7. 创建空页面占位：`pages/index`、`pages/weather`、`pages/map`、`pages/mine`
8. 验证：`npm run dev:h5` 能跑起来，4 个 Tab 可切换

**文件:**
- 删除: `index.html`
- 新建: Uni-app 项目结构
- 修改: `uni.scss`、`pages.json`、`manifest.json`

---

### Task 2: 全局样式 + 品牌设计系统
**Story:** 基础  
**耗时:** ~2h  
**依赖:** Task 1

1. 定义 CSS 变量体系（`uni.scss`）：
   - 品牌色：主色蓝 `#2196F3`、辅色青 `#00BCD4`
   - 指数色：极佳绿 `#4CAF50`、良好黄绿 `#8BC34A`、一般黄 `#FFC107`、较差橙 `#FF9800`、不宜红 `#F44336`
   - 背景 `#F8FAFE`、卡片 `#FFFFFF`、文字 `#1A2B4A`、次要 `#6B7A99`
   - 圆角：卡片 `16px`、按钮 `12px`、标签 `100px`
2. 创建全局基础组件：
   - `EmptyState.vue`：空态插画 + 文字 + 操作按钮
   - `LoadingSpinner.vue`：加载动画（参考 uiverse.io 风格）
3. 验证：所有页面使用统一变量，视觉一致

**文件:**
- 修改: `src/uni.scss`
- 新建: `src/components/EmptyState.vue`、`src/components/LoadingSpinner.vue`

---

### Task 3: 用户登录 (S9)
**Story:** S9 — 微信登录  
**耗时:** ~3h  
**依赖:** Task 1

1. 创建 `stores/user.ts`（Pinia）：用户状态管理
2. 创建 `api/user.ts`：登录接口封装
3. 创建 `pages/login/index.vue`：
   - 微信环境：显示"微信授权登录"按钮
   - 非微信环境：降级为手机号验证码登录
4. 实现 uniCloud 登录流程：`uniCloud.callFunction('user-api', { action: 'login' })`
5. 登录态持久化：存储 token 到 `uni.setStorageSync`
6. 路由守卫：未登录 → 跳登录页
7. 验证：微信内打开能授权登录，登录后跳首页

**文件:**
- 新建: `src/stores/user.ts`、`src/api/user.ts`、`src/pages/login/index.vue`
- 修改: `src/pages.json`（添加 login 页面路由）

---

### Task 4: 天时 — 钓鱼指数 (S2, S3)
**Story:** S2 首页指数 + S3 天时详情  
**耗时:** ~4h  
**依赖:** Task 2

1. 创建 `utils/weather-index.ts`：钓鱼指数算法（加权评分）
2. 创建 `api/weather.ts`：和风天气 API 封装 + uniCloud 天气缓存
3. 创建 `stores/weather.ts`：天气数据状态
4. 创建 `pages/weather/index.vue`（天时主页）：
   - 大字钓鱼指数 0-100 + 颜色变化
   - 一句话建议文案
   - 核心数据：气温/气压/风力/天气/水温
   - 气压趋势折线图（使用 `ucharts` 或纯 CSS）
   - 最佳出钓时段（颜色标记）
   - 逐小时鱼口条形图
   - 底部：这个天气下的渔获推荐（3-6 张卡片）
5. 首页顶部指数条：`WeatherMini.vue` 组件
6. 验证：打开天时页能看到完整天气+指数+图表

**文件:**
- 新建: `src/utils/weather-index.ts`、`src/api/weather.ts`、`src/stores/weather.ts`
- 新建: `src/pages/weather/index.vue`、`src/components/WeatherMini.vue`

---

### Task 5: 渔获拍照 + AI 识鱼 (S5)
**Story:** S5 — 拍照记录  
**耗时:** ~5h  
**依赖:** Task 3

1. 创建 `utils/image-compress.ts`：图片压缩到 <500KB
2. 创建 `utils/fish-species.ts`：Top 20 淡水鱼种列表
3. 创建 `api/ai.ts`：腾讯云图像识别接口（通过 uniCloud 云函数代理，避免前端暴露密钥）
4. 创建 `api/catch.ts`：渔获 CRUD 接口
5. 创建 `pages/catch/create.vue`：
   - 拍照/相册选择
   - 图片压缩 → 上传云存储
   - AI 识别 → 显示鱼种+置信度
   - 置信度 <70% → 提示用户确认
   - 自动填充：时间/GPS 定位/当前天气
   - 保存按钮 → 创建 catch 记录
   - "仅自己可见"开关
6. 验证：拍照→AI 返回鱼种→自动填表→保存成功

**文件:**
- 新建: `src/utils/image-compress.ts`、`src/utils/fish-species.ts`
- 新建: `src/api/ai.ts`、`src/api/catch.ts`
- 新建: `src/pages/catch/create.vue`

---

### Task 6: 首页渔获瀑布流 (S1)
**Story:** S1 — 首页渔获流  
**耗时:** ~4h  
**依赖:** Task 4（需要天气数据）、Task 5（需要渔获数据）

1. 创建 `stores/catch.ts`：渔获列表状态
2. 创建 `components/CatchCard.vue`：
   - 渔获照片（缩略图）
   - 鱼种标签 `FishBadge.vue`
   - 钓点名 + 时间
   - 天气小标
   - ❤️ 点赞数 + 💬 评论数
3. 创建 `components/FishBadge.vue`：鱼种标签组件
4. 创建 `pages/index/index.vue`：
   - 顶部：WeatherMini 指数组件
   - 瀑布流：双列交错布局（CSS columns 或 Masonry）
   - 下拉刷新 + 滚动加载更多
   - 点击卡片 → 跳转渔获详情
5. 首页为空态：EmptyState + "去钓鱼吧！"引导
6. 验证：首页加载渔获流，双列瀑布流，点击跳转

**文件:**
- 新建: `src/stores/catch.ts`、`src/components/CatchCard.vue`、`src/components/FishBadge.vue`
- 修改: `src/pages/index/index.vue`

---

### Task 7: 渔获详情 + 互动 (S6)
**Story:** S6 — 渔获详情+互动  
**耗时:** ~4h  
**依赖:** Task 5

1. 创建 `api/interact.ts`：点赞/评论接口
2. 创建 `components/LikeButton.vue`：点赞按钮（❤️ 切换+计数）
3. 创建 `components/CommentList.vue`：评论列表（时间倒序+输入框）
4. 创建 `pages/catch/detail.vue`：
   - 大图展示
   - 鱼种+天气+地点+时间
   - 点赞按钮
   - 评论列表+输入框（≤100字）
   - 分享按钮（生成图片卡片）
   - 查看钓点 → 跳转钓点详情
   - 查看作者主页
5. 验证：点赞实时更新、评论提交后显示

**文件:**
- 新建: `src/api/interact.ts`、`src/components/LikeButton.vue`、`src/components/CommentList.vue`
- 新建: `src/pages/catch/detail.vue`

---

### Task 8: 钓点地图 (S4, S7)
**Story:** S4 地图 + S7 钓点详情  
**耗时:** ~5h  
**依赖:** Task 5（需要渔获数据做气泡）

1. 创建 `api/spot.ts`：钓点 CRUD 接口
2. 创建 `stores/spot.ts`：钓点数据状态
3. 创建 `utils/amap.ts`：高德地图初始化封装
4. 创建 `pages/map/index.vue`：
   - 高德地图全屏
   - 定位 → 加载附近钓点标记
   - 标记为渔获照片气泡（最近一张渔获缩略图）
   - 点击标记 → 弹出 SpotCard 卡片
   - 搜索钓点（名称搜索）
   - 长按空白处 → "标记钓点"面板
   - 标准/卫星底图切换
5. 创建 `components/SpotCard.vue`：钓点卡片（名/评分/渔获数/距离）
6. 创建 `pages/map/detail.vue`：
   - 钓点名称+类型+评分+渔获数
   - 渔获时间线（该钓点所有渔获瀑布流）
   - 打卡按钮
   - 导航按钮（调起地图导航）
   - 分享按钮
7. 验证：地图加载、钓点标记显示、点击查看详情

**文件:**
- 新建: `src/api/spot.ts`、`src/stores/spot.ts`、`src/utils/amap.ts`
- 新建: `src/pages/map/index.vue`、`src/pages/map/detail.vue`、`src/components/SpotCard.vue`

---

### Task 9: 个人中心 (S8)
**Story:** S8 — 个人中心  
**耗时:** ~3h  
**依赖:** Task 6（需要渔获数据）

1. 创建 `pages/mine/index.vue`：
   - 头像+昵称
   - 统计卡片：总渔获/最常钓的鱼/去过几个钓点
   - "我的渔获"列表（复用 CatchCard 瀑布流）
   - "我的钓点"列表
   - 设置：定位授权、通知、清除缓存、关于
2. 个人主页（查看他人）：复用个人中心，去掉设置
3. 验证：显示统计数据、渔获列表可跳转详情

**文件:**
- 新建: `src/pages/mine/index.vue`

---

### Task 10: 联调 + 打磨 + 部署
**Story:** 全部  
**耗时:** ~4h  
**依赖:** Task 1-9

1. 全流程联调：登录→首页→天时→拍照→发布→钓点→互动→我的
2. 空态处理：每个页面的空态展示
3. 加载态：骨架屏/Loading
4. 错误处理：网络异常、API 失败的友好提示
5. 图片懒加载优化
6. 响应式适配（移动端为主）
7. 配置 Vercel 部署：`vercel.json` + 构建命令 `npm run build:h5`
8. 推送 GitHub → Vercel 自动部署
9. 验证：Vercel 上线，手机浏览器可访问

**文件:**
- 修改: 各页面完善
- 新建: `vercel.json`

---

## 完成标准

- [ ] 4 个 Tab 可正常切换
- [ ] 首页渔获瀑布流可加载
- [ ] 天时页显示钓鱼指数+天气数据
- [ ] 拍照 → AI 识鱼 → 自动填表 → 保存
- [ ] 钓点地图显示标记+渔获气泡
- [ ] 点赞/评论正常工作
- [ ] 个人中心显示我的渔获
- [ ] 微信登录可用
- [ ] Vercel 部署成功
- [ ] 移动端体验流畅
- [ ] 无 console error

---

*文档版本：v1.0 | 创建日期：2026-06-13*
