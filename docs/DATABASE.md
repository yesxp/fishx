# 鱼渔娱 - 数据库设计

## 数据库：MongoDB (腾讯云开发)

> **开发期**：**全部 SQLite**（见 `schema.dev.sql` + `fish-species-seed.sql`）
> **生产期**：TCB MongoDB 集合
> **存储策略说明**：见 `development-storage.md`
>
> **核心决策**：不再用 JSON 文件，全部 SQLite 统一管理，迁移到 TCB 时再导出 JSON 一次性导入。

---

### 1. fish_species (鱼种百科) ✨ 新增

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | string | 主键，如 `sp-001` |
| zh_name | string | 中文名（鲫鱼） |
| emoji | string | 鱼图标（🐟） |
| common_names | string[] | 俗名（["鲫瓜子","月鲫"]） |
| scientific_name | string | 学名（Carassius auratus） |
| family | string | 科属 |
| difficulty | enum | 难度：易/中/难 |
| water_layer | enum | 水层：上层/中上层/中层/中下层/底层/全层 |
| feeding | enum | 食性：草食/肉食/杂食/杂食偏肉/杂食偏植/滤食 |
| season | string[] | 季节：["春","夏","秋","冬"] |
| weight_range | string | 体重区间（"0.2-1.0kg"） |
| distribution | string | 分布水域 |
| subtitle | string | 副标题（钩子式疑问句） |
| description | string | 鱼种简介 |
| one_fish_one_name | string | 名字由来 |
| fun_facts | string | 钓鱼趣闻 |
| taste | string | 食用价值 |
| tactics | string | 钓法技巧 |
| copywriting_seeds | object | 5 风格 × N 句种子文案 |
| illustration_url | string | 标准照 URL（V1.1） |
| related_species | string[] | 关联鱼种 ID |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |

**索引：**
- `zh_name` - 搜索
- `family` - 同科推荐
- `distribution` - 地域筛选

**权限：** ADMINWRITE（百科数据，管理员可写，全员可读）

**V1 数据：** 8 种（鲫鱼/鲤鱼/草鱼/鲈鱼/翘嘴/罗非/鲶鱼/鳊鱼），见 `fish-species-v1.json`

---

### 2. catches (渔获表) ✨ 字段完善

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | string | 主键，UUID |
| user_id | string | 用户 ID |
| species_id | string | 关联 fish_species._id |

**核心数据**
| photo_urls | string[] | 1-9 张鱼获照片 |
| primary_photo_index | int | 主图下标（AI 识别用） |
| weight_estimated_g | int | AI 拍照估算（克） |
| weight_g | int | **用户确认/修改后的实际重量（克）** |
| weight_confirmed | bool | 用户是否确认（默认 false） |

**AI 识别**
| species_confidence | float | 0-1 置信度 |
| species_candidates | array | top3 候选 `[{id, name, conf}]` |
| species_corrected | bool | **用户是否改过 AI 结果（静默收集反哺）** |

**时间**
| caught_at | timestamp | 鱼获时间（EXIF / 拍照） |
| created_at | timestamp | 记录创建时间 |
| updated_at | timestamp | 更新时间 |

**环境（必填 spot_geo）**
| spot_geo | geo | **{ type: "Point", coordinates: [lng, lat] }** |
| spot_name | string | 钓点名称 |
| spot_id | string | 关联 spots._id（V2） |
| weather | object | `{temp, pressure, wind_dir, wind_level, desc}` |
| tide | object | 海钓用 `{height, trend}` |

**钓法（选填）**
| method | enum | 台钓/路亚/筏钓/矶钓/手竿 |
| bait | string[] | 饵料多选 |
| rig | string | 线组 |

**心情（选填）**
| mood_tags | string[] | ["得意","谦虚","搞笑","专业","极简"] |
| note | string(200) | 自由备注 |

**分享**
| share_count | int | 分享次数 |
| shared_at | timestamp | 最后分享时间 |
| user_copywriting | object | 用户编辑过的文案（**不进共享库**） |

**索引：**
- `user_id, species_id` - 单鱼种战绩
- `user_id, caught_at DESC` - 时间线
- `spot_geo` (2dsphere) - 地图查询
- `user_id, created_at DESC` - 我的列表

**权限：** PRIVATE（仅创建者可读写）

---

### 3. spots (钓点表)

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | string | 主键 |
| name | string | 钓点名称 |
| type | enum | lake/river/pond/wild/sea |
| location | geo | `{ type: "Point", coordinates: [lng, lat] }` |
| address | string | 详细地址 |
| province | string | 省 |
| city | string | 市 |
| district | string | 区 |
| description | string | 描述 |
| fish_types | string[] | 鱼种列表 |
| images | string[] | 图片URL |
| tags | string[] | 标签 |
| rating | number | 评分 (0-5) |
| catch_count | int | 渔获数 |
| is_paid | bool | 是否收费 |
| is_pit | bool | 是否黑坑 |
| created_by | string | 创建者ID |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |

**索引：**
- `location` (2dsphere) - 地理位置
- `type` - 类型筛选
- `city` - 城市筛选

**权限：** READONLY

---

### 4. reviews (评价表) - V2

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | string | 主键 |
| spot_id | string | 关联钓点 |
| user_id | string | 用户 |
| rating | number | 评分 (1-5) |
| content | string | 评价内容 |
| images | string[] | 图片 |
| created_at | timestamp | 创建时间 |

**权限：** READONLY

---

### 5. users (用户表 - 云开发自动管理)

腾讯云开发自动管理用户表，包含：openid、昵称、头像、手机号、创建时间

---

## 关键设计决策

| 决策 | 方案 | 理由 |
|---|---|---|
| 鱼获 vs 鱼种 | **两表独立 + JOIN** | 形色模式：百科是知识，鱼获是记录，不混 |
| 重量必填？ | **选填**（AI 估算 + 后补） | 拍照估算不准，强制必填增加录入阻力 |
| spot_geo 必填？ | **必填** | 地图功能基础，EXIF 自动读 |
| 多张照片识别？ | **主图 1 张 AI 识别** | VL 模型单图最准，多图融合成本高 |
| 鱼种图片存哪？ | 鱼种表存 `illustration_url` + COS 存标准照 | CDN 友好 |
| 鱼获图片存哪？ | COS，DB 存 fileID | 减少 DB 体积 |

## V1 范围

| 模块 | V1 状态 | 数据源 |
|---|---|---|
| fish_species | ✅ 8 种 | JSON 静态 |
| catches | ✅ 完整字段 | SQLite → TCB |
| spots | ⏸ 暂不开 | 用户私有收藏 |
| reviews | ⏸ 暂不开 | V2 社区 |

## 数据来源

1. **手动录入** - 后台管理/APP内创建
2. **用户上传** - 发布渔获时自动关联/创建钓点
3. **高德地图API** - 后期导入公共钓点数据
4. **和风天气** - 拍照时自动读天气
5. **百度动物识别** - 拍照时调用识别鱼种
