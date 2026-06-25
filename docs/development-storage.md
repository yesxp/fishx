# FishX 开发期存储策略

## 核心决策：**全部 SQLite 一致性**（不再用 JSON）

> 原因：JSON 文件大、难维护、迁移麻烦。SQLite 统一存储便于查询、版本管理、迁移。

## 当前架构

```
开发期（现在）                          生产期（TCB 迁移后）
┌──────────────────────┐                ┌──────────────────────┐
│ docs/dev.sqlite      │  ──────►   │ TCB fish_species 集合  │
│ ├─ fish_species       │  ──────►   │ TCB catches 集合        │
│ └─ catches            │  ──────►   │ TCB 云存储 COS          │
└──────────────────────┘                └──────────────────────┘
         │
         │ + schema.dev.sql（建表 DDL）
         │ + fish-species-seed.sql（8 鱼种种子数据）
```

## 文件清单

| 文件 | 作用 |
|---|---|
| `docs/dev.sqlite` | SQLite 数据库文件（开发期持久化） |
| `docs/schema.dev.sql` | 建表 DDL（fish_species + catches + 2 视图） |
| `docs/fish-species-seed.sql` | 8 鱼种种子数据 INSERT |
| `docs/dev.sqlite.bak` | （可选）备份文件 |

## 初始化 / 重置

```bash
# 全新初始化
rm -f docs/dev.sqlite
sqlite3 docs/dev.sqlite < docs/schema.dev.sql
sqlite3 docs/dev.sqlite < docs/fish-species-seed.sql

# 验证
sqlite3 docs/dev.sqlite "SELECT count(*) FROM fish_species;"
# 应该返回 8
```

## 表结构概要

### fish_species（鱼种百科 · 8 行）

```sql
-- 关键字段
id                  -- sp-001
zh_name             -- 鲫鱼
emoji               -- 🐟
common_names        -- JSON 数组
scientific_name     -- 学名
difficulty          -- 易/中/难
water_layer         -- 底层/中下层/中上层/中层
feeding             -- 杂食/肉食/草食/...
season              -- JSON 数组
subtitle            -- 钩子疑问句
description         -- 简介
one_fish_one_name   -- 名字由来
fun_facts           -- 钓鱼趣闻
taste               -- 食用价值
tactics             -- 钓法技巧
copywriting_seeds   -- JSON: {得意:[], 谦虚:[], ...}
related_species     -- JSON 数组
```

### catches（鱼获记录 · 用户私有）

```sql
-- 关键字段
species_id              -- FK → fish_species.id
photo_urls              -- JSON 数组
primary_photo_index     -- 主图下标
weight_estimated_g      -- AI 拍照估算
weight_g                -- 用户确认后
weight_confirmed        -- 0/1
species_corrected       -- 0/1（静默收集反哺）
spot_geo_lat / _lng     -- EXIF / 手动
weather                 -- JSON
mood_tags               -- JSON
```

### 视图（运行时计算，不存表）

| 视图 | 用途 |
|---|---|
| `v_catches_with_species` | 鱼获 + 鱼种摘要 JOIN（详情页用） |
| `v_species_user_stats` | 鱼种解锁 + 战绩统计（"我的战绩"页用） |

## API 设计（src/api/）

```typescript
// src/api/species.ts
import db from '@/docs/dev.sqlite?raw'  // Vite 静态资源加载

export async function getAllSpecies() {
  return db.query('SELECT * FROM fish_species ORDER BY id')
}

export async function getSpeciesById(id: string) {
  return db.query('SELECT * FROM fish_species WHERE id = ?', [id])
}

export async function getRelatedSpecies(ids: string[]) {
  return db.query(
    `SELECT * FROM fish_species WHERE id IN (${ids.map(() => '?').join(',')})`,
    ids
  )
}

// src/api/catch.ts
export async function createCatch(data: CatchInput) {
  return db.query(
    `INSERT INTO catches (id, user_id, species_id, photo_urls, ...)
     VALUES (?, ?, ?, ?, ...)`,
    [data.id, data.userId, data.speciesId, JSON.stringify(data.photoUrls), ...]
  )
}

export async function getUserCatches(userId: string, limit = 20) {
  return db.query(
    `SELECT * FROM v_catches_with_species
     WHERE user_id = ? ORDER BY caught_at DESC LIMIT ?`,
    [userId, limit]
  )
}

export async function getSpeciesUserStats(userId: string) {
  return db.query(
    `SELECT * FROM v_species_user_stats WHERE user_id = ?`,
    [userId]
  )
}
```

## TCB 迁移路径

### 1. 数据导出（开发期结束前）

```bash
# 导出 fish_species 为 JSON（一次性）
sqlite3 docs/dev.sqlite -json \
  "SELECT * FROM fish_species" > fish_species.json

# 导出 catches 为 JSON（一次性）
sqlite3 docs/dev.sqlite -json \
  "SELECT * FROM catches" > catches.json
```

### 2. 导入到 TCB

```javascript
// scripts/migrate-to-tcb.js
const tcb = require('@cloudbase/node-sdk')
const fs = require('fs')
const app = tcb.init({ secretId, secretKey, envId })
const db = app.database()

// 鱼种导入
const species = JSON.parse(fs.readFileSync('fish_species.json'))
for (const s of species) {
  await db.collection('fish_species').add(s)
}

// 鱼获导入
const catches = JSON.parse(fs.readFileSync('catches.json'))
for (const c of catches) {
  await db.collection('catches').add(c)
}
```

### 3. SQLite → MongoDB 字段映射

| SQLite | MongoDB | 备注 |
|---|---|---|
| TEXT PRIMARY KEY | _id | 直接转 |
| TEXT (JSON 数组) | Array | JSON.parse |
| TEXT (JSON 对象) | Object | JSON.parse |
| REAL | Number | 直接转 |
| INTEGER (0/1) | Boolean | `=== 1` |
| TEXT (datetime) | Date | new Date() |

## 集合权限（生产期）

| 集合 | 权限 | 理由 |
|---|---|---|
| `fish_species` | ADMINWRITE | 百科数据，管理员可写，全员可读 |
| `catches` | PRIVATE | 私有记录，仅创建者可读写 |
| `spots` | READONLY | 见 TENCENT_CLOUD.md |

## 数据校对 TODO

- [ ] 8 种鱼副标题钩子 - 用户 review
- [ ] 8 种鱼俗名/地方叫法 - 用户补充
- [ ] 8 种鱼钓鱼窗口/季节细节 - 用户校正
- [ ] V1.1 加 6 种鱼（青鱼/黑鱼/鲢鳙/黄颡鱼/鳜鱼/马口）
- [ ] V2 加 20 种海鱼+南方特色种
- [ ] copywriting_seeds 优化（结合真实使用反馈）
