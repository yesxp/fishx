# Tech Design — 鱼渔娱 (FishX)

---

## 技术栈

| 层 | 选型 | 版本 | 理由 |
|---|---|---|---|
| **前端框架** | Uni-app (Vue 3 + TypeScript) | Vue 3.4+ | 一套代码 → H5/小程序/App |
| **构建工具** | Vite (uni-app 插件) | — | 快速开发体验 |
| **UI 组件** | uni-ui + 自定义组件 | — | 基础走 uni-ui，视觉自定义 |
| **CSS** | SCSS + CSS 变量 | — | 主题色统一管理 |
| **状态管理** | Pinia | — | Vue 3 官方推荐 |
| **地图** | 高德地图 JS API 2.0 | — | H5 直接用，卫星图+标记 |
| **天气** | 和风天气 API | — | 免费 1000 次/天 |
| **AI 识鱼** | 腾讯云图像识别 | — | ¥0.01/次，淡水鱼 Top 20 |
| **后端** | uniCloud (云函数 + 云数据库) | — | 零运维，Uni-app 原生集成 |
| **存储** | uniCloud 云存储 | — | 渔获照片 |
| **登录** | 微信 OAuth (H5) / wx.login (小程序) | — | H5 微信内授权，降级手机号 |
| **部署** | Vercel (H5) | — | 自动 CI/CD，免费额度 |
| **代码仓库** | GitHub yesxp/fishx | — | 已建好 |

---

## 系统架构

```
┌─────────────────────────────────────────────────┐
│                   客户端 (Uni-app H5)             │
│                                                   │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐        │
│  │ 🏠首页 │  │ 🌤天时│  │ 🗺钓点│  │ 👤我的│        │
│  └──┬───┘  └──┬───┘  └──┬───┘  └──┬───┘        │
│     └─────────┴─────────┴─────────┘              │
│                       │                            │
│              ┌────────┴────────┐                   │
│              │   渔获照片底座    │                   │
│              │   (Catch Store)  │                   │
│              └────────┬────────┘                   │
└───────────────────────┼───────────────────────────┘
                        │
          ┌─────────────┼─────────────┐
          │             │             │
    ┌─────┴─────┐ ┌────┴────┐ ┌─────┴─────┐
    │  uniCloud  │ │ 高德地图 │ │ 天气API   │
    │ 云函数+数据库│ │ JS API  │ │ 和风天气   │
    └───────────┘ └─────────┘ └───────────┘
```

---

## 数据模型

### 核心集合（uniCloud 云数据库）

```javascript
// 用户表
user: {
  _id: string,           // uniCloud 自动生成
  _openid: string,       // 微信 openid
  nickname: string,
  avatar: string,
  phone: string,         // 手机号登录时
  catch_count: number,   // 冗余：渔获总数
  spot_count: number,    // 冗余：打卡钓点数
  created_at: Date,
  last_login_at: Date
}

// 渔获表 ⭐ 底座
catch: {
  _id: string,
  _openid: string,       // 发布者
  user_id: string,       // → user._id
  user_nickname: string, // 冗余：发布时昵称
  user_avatar: string,   // 冗余：发布时头像
  
  // 鱼种
  fish_type: string,     // AI 识别结果
  fish_name: string,     // 用户确认后的中文名
  confidence: number,    // AI 置信度 0-1
  is_manual: boolean,    // 是否手动选择（AI 不确定时）
  
  // 照片
  photo_url: string,     // 云存储 URL
  photo_thumb: string,   // 缩略图 URL
  
  // 位置
  location: {
    lat: number,
    lng: number,
    city: string,
    district: string,
    spot_id: string,     // 关联的钓点（可选）
    spot_name: string    // 冗余：钓点名
  },
  
  // 天气（拍照时自动抓取）
  weather: {
    temp: number,
    pressure: number,
    wind_level: number,
    condition: string,   // 晴/多云/阴/雨
    humidity: number
  },
  
  // 互动
  like_count: number,    // 冗余：点赞数
  comment_count: number, // 冗余：评论数
  
  // 时间
  caught_at: Date,       // 钓鱼时间（用户可改）
  created_at: Date,
  
  // 可见性
  is_public: boolean     // 是否公开（默认 true）
}

// 钓点表
spot: {
  _id: string,
  _openid: string,       // 创建者
  name: string,
  type: string,          // 野钓/黑坑/海钓/河流/湖泊
  location: {
    lat: number,
    lng: number,
    city: string,
    district: string
  },
  rating: number,        // 综合评分 0-5
  rating_count: number,  // 评分数
  catch_count: number,   // 冗余：该钓点渔获数
  latest_catch_photo: string, // 缓存：最近渔获照片
  description: string,   // 备注
  created_by: string,    // → user._id
  created_at: Date
}

// 点赞表
like: {
  _id: string,
  _openid: string,
  user_id: string,
  target_type: string,   // 'catch' | 'spot'
  target_id: string,
  created_at: Date
}

// 评论表
comment: {
  _id: string,
  _openid: string,
  user_id: string,
  user_nickname: string,
  user_avatar: string,
  target_type: string,   // 'catch' | 'spot'
  target_id: string,
  content: string,       // ≤100 字
  created_at: Date
}

// 天气缓存表
weather_cache: {
  _id: string,
  city: string,
  data: object,          // 和风天气返回的完整数据
  fishing_index: number, // 计算后的钓鱼指数
  updated_at: Date       // 30 分钟过期
}
```

### 索引设计

```javascript
// catch 集合
{ location: "2dsphere" }     // 地理位置查询
{ created_at: -1 }           // 时间倒序
{ "location.spot_id": 1 }   // 按钓点查渔获

// spot 集合
{ location: "2dsphere" }     // 附近钓点
{ catch_count: -1 }          // 热门钓点

// like 集合
{ user_id: 1, target_type: 1, target_id: 1 }  // 查是否已赞
{ target_type: 1, target_id: 1 }               // 查某条的赞
```

---

## API 设计（云函数）

### 渔获模块

| 接口 | 方法 | 说明 | Story |
|---|---|---|---|
| `catch/list` | GET | 首页渔获流（分页+定位） | S1 |
| `catch/create` | POST | 发布渔获（含图片上传） | S5 |
| `catch/detail` | GET | 渔获详情 | S6 |
| `catch/delete` | DELETE | 删除自己的渔获 | S8 |
| `catch/my` | GET | 我的渔获列表 | S8 |

### 点赞/评论模块

| 接口 | 方法 | 说明 | Story |
|---|---|---|---|
| `interact/toggle-like` | POST | 点赞/取消 | S6 |
| `interact/comment` | POST | 发表评论 | S6 |
| `interact/comments` | GET | 评论列表（分页） | S6 |

### 钓点模块

| 接口 | 方法 | 说明 | Story |
|---|---|---|---|
| `spot/nearby` | GET | 附近钓点（地理围栏） | S4 |
| `spot/create` | POST | 标记新钓点 | S4 |
| `spot/detail` | GET | 钓点详情+渔获流 | S7 |
| `spot/checkin` | POST | 打卡 | S8 |

### 天气模块

| 接口 | 方法 | 说明 | Story |
|---|---|---|---|
| `weather/index` | GET | 钓鱼指数+天气数据 | S2, S3 |
| `weather/hourly` | GET | 逐小时鱼口预测 | S3 |
| `weather/catches` | GET | 这个天气下的渔获推荐 | S3 |

### AI 识鱼模块

| 接口 | 方法 | 说明 | Story |
|---|---|---|---|
| `ai/fish-identify` | POST | 上传图片→AI识别鱼种 | S5 |

### 用户模块

| 接口 | 方法 | 说明 | Story |
|---|---|---|---|
| `user/login` | POST | 微信/手机号登录 | S9 |
| `user/profile` | GET | 个人资料+统计 | S8 |

---

## 模块划分

```
src/
├── pages/
│   ├── index/              # 🏠 首页（渔获流）
│   │   └── index.vue
│   ├── weather/            # 🌤️ 天时
│   │   ├── index.vue       # 天时主页
│   │   └── detail.vue      # 天时详情
│   ├── map/                # 🗺️ 钓点
│   │   ├── index.vue       # 钓点地图
│   │   └── detail.vue      # 钓点详情
│   ├── mine/               # 👤 我的
│   │   └── index.vue
│   ├── catch/              # 渔获相关
│   │   ├── create.vue      # 拍照发布
│   │   └── detail.vue      # 渔获详情
│   └── login/              # 登录
│       └── index.vue
├── components/
│   ├── CatchCard.vue       # 渔获卡片（首页流用）
│   ├── CatchDetail.vue     # 渔获详情弹窗
│   ├── FishBadge.vue       # 鱼种标签
│   ├── WeatherMini.vue     # 天气小卡片
│   ├── SpotMarker.vue      # 钓点地图标记
│   ├── SpotCard.vue        # 钓点卡片
│   ├── CommentList.vue     # 评论列表
│   ├── LikeButton.vue      # 点赞按钮
│   └── EmptyState.vue      # 空态组件
├── stores/
│   ├── user.ts             # 用户状态
│   ├── catch.ts            # 渔获数据
│   ├── spot.ts             # 钓点数据
│   └── weather.ts          # 天气数据
├── api/
│   ├── catch.ts            # 渔获接口
│   ├── spot.ts             # 钓点接口
│   ├── weather.ts          # 天气接口
│   ├── interact.ts         # 点赞/评论接口
│   ├── ai.ts               # AI 识鱼接口
│   └── user.ts             # 用户接口
├── utils/
│   ├── fish-species.ts     # 鱼种列表 Top 20
│   ├── weather-index.ts    # 钓鱼指数算法
│   ├── image-compress.ts   # 图片压缩
│   └── format.ts           # 格式化工具
├── static/
│   ├── icons/              # TabBar 图标
│   └── images/             # 空态插画
├── uniCloud-aliyun/        # 云函数目录
│   └── cloudfunctions/
│       ├── catch-api/
│       ├── spot-api/
│       ├── weather-api/
│       ├── interact-api/
│       ├── ai-api/
│       └── user-api/
├── App.vue
├── main.ts
├── pages.json              # 路由+TabBar 配置
├── manifest.json           # Uni-app 配置
├── uni.scss                # 全局样式变量
└── vite.config.ts
```

---

## 关键技术方案

### 1. 钓鱼指数算法

```typescript
// utils/weather-index.ts
function calculateFishingIndex(weather: WeatherData): number {
  const factors = [
    { value: weather.pressure,     weight: 0.30, ideal: [1000, 1025] },
    { value: weather.temp,         weight: 0.20, ideal: [15, 30] },
    { value: weather.windLevel,    weight: 0.15, ideal: [1, 3] },
    { value: weather.tempRange,    weight: 0.15, ideal: [0, 8] },   // 日温差
    { value: weather.condition,    weight: 0.10, ideal: ['多云','阴'] },
    { value: weather.rain,         weight: 0.10, ideal: [0, 5] },   // mm
  ]
  
  let score = 0
  for (const f of factors) {
    const ratio = getIdealRatio(f.value, f.ideal)
    score += ratio * f.weight * 100
  }
  return Math.round(Math.max(0, Math.min(100, score)))
}
```

### 2. 图片上传流程

```
用户选图 → 前端压缩到 <500KB → 上传到云存储 → 返回 URL
                                                    ↓
                              同时调用 AI 识鱼 → 返回鱼种+置信度
                                                    ↓
                              用户确认 → 创建 catch 记录
```

### 3. 地图钓点加载

```
用户打开地图 → 获取定位 → 计算可视区域边界
                              ↓
                    查询 catch 表中该区域最近渔获
                              ↓
                    聚合为钓点气泡（spot 表 + catch 最新照片）
                              ↓
                    渲染高德地图标记
```

### 4. 首页渔获流加载

```
打开首页 → 获取定位城市 → 查询 catch 表
  条件：is_public=true, 按 created_at 倒序
  范围：先全国热门，后按距离排序
  分页：每页 20 条，游标分页
  关联：查询 user 表获取头像昵称（或用冗余字段）
```

---

## 部署架构

```
GitHub (yesxp/fishx)
  ↓ push main
Vercel (自动构建)
  ↓ npm run build:h5
CDN (Vercel Edge)
  ↓ 用户访问
H5 页面
  ↓ API 调用
uniCloud 云函数（阿里云）
  ├── 云数据库（MySQL 兼容）
  └── 云存储（图片）
```

---

## 技术风险

| 风险 | 影响 | 缓解 |
|---|---|---|
| uniCloud 免费额度 | 云函数 5 万次/天，数据库 2GB | MVP 足够，超出后升级 |
| 高德 JS API 限额 | 5000 次/天（未认证） | 申请开发者认证（免费 30 万/天） |
| AI 识鱼准确率 | 低准确率影响体验 | V1 仅 Top 20 淡水鱼 + 置信度显示 |
| H5 定位权限 | 用户拒绝 | 降级为城市选择 |
| 图片加载速度 | 卫星图+渔获大图 | 缩略图优先，懒加载 |
| 跨端兼容 | Uni-app 各端差异 | V1 专注 H5，暂不考虑小程序 |

---

*文档版本：v1.0 | 创建日期：2026-06-13 | 作者：Hermes × 鱼渔娱*
