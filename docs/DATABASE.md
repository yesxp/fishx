# 鱼渔娱 - 数据库设计

## 数据库：MongoDB (腾讯云开发)

### 1. spots (钓点表)

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | string | 主键，自动生成 |
| name | string | 钓点名称 |
| type | string | 类型: lake/river/pond/wild/sea |
| lat | number | 纬度 |
| lng | number | 经度 |
| address | string | 详细地址 |
| province | string | 省 |
| city | string | 市 |
| district | string | 区 |
| description | string | 描述 |
| fish_types | string[] | 鱼种列表 |
| images | string[] | 图片URL |
| tags | string[] | 标签: ["收费","黑坑","路亚","台钓","海钓"] |
| emoji | string | 图标emoji |
| rating | number | 评分 (0-5) |
| review_count | number | 评价数 |
| catch_count | number | 渔获数 |
| is_paid | boolean | 是否收费 |
| is_pit | boolean | 是否黑坑 |
| created_by | string | 创建者ID |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |

**索引：**
- `lat, lng` - 地理位置查询
- `type` - 类型筛选
- `city` - 城市筛选
- `created_at` - 时间排序

---

### 2. catches (渔获表)

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | string | 主键 |
| spot_id | string | 关联钓点ID |
| user_id | string | 用户ID |
| fish_type | string | 鱼种 |
| weight | number | 重量(kg) |
| length | number | 长度(cm) |
| images | string[] | 图片URL |
| description | string | 描述 |
| weather | object | 当天天气快照 |
| caught_at | timestamp | 捕获时间 |
| created_at | timestamp | 创建时间 |

**索引：**
- `spot_id` - 钓点关联查询
- `user_id` - 用户渔获查询
- `caught_at` - 时间排序

---

### 3. reviews (评价表)

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | string | 主键 |
| spot_id | string | 关联钓点ID |
| user_id | string | 用户ID |
| rating | number | 评分 (1-5) |
| content | string | 评价内容 |
| images | string[] | 图片URL |
| created_at | timestamp | 创建时间 |

---

### 4. users (用户表 - 云开发自动管理)

腾讯云开发自动管理用户表，包含：
- openid
- 昵称
- 头像
- 手机号
- 创建时间

---

## 数据来源

1. **手动录入** - 后台管理/APP内创建
2. **用户上传** - 发布渔获时自动关联/创建钓点
3. **高德地图API** - 后期导入公共钓点数据
