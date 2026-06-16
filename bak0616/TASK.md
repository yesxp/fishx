# 鱼渔娱 — Discord Light Mode 像素级复刻

## 原则
清空现有 UI 代码，从零搭建。所有视觉元素严格按 Discord Light Mode 的真实值。

## 设计规范（从 22 张 Discord 截图提取）

### 颜色
```
页面背景: #F2F3F5
卡片背景: #FFFFFF
输入框背景: #E3E5E8
主文字: #060607
次文字: #4E5058
弱文字/占位符: #80848E
品牌色 Blurple: #5865F2
链接色: #5865F2
分隔线: #E3E5E8
成功/在线: #23A55A
警告/空闲: #F0B232
危险/忙碌: #F23F43
```

### 字体
```
font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
font-size 基准: 16px (32rpx)
行高: 1.4
```

### 字号
```
页面标题: 20px bold
区域标题: 12px 600 uppercase
正文: 16px 400
次要文字: 14px 400
最弱文字: 12px 400
按钮文字: 14px 600
输入框文字: 16px 400
```

### 圆角
```
卡片: 16px
按钮(全圆角): 9999px (pill)
输入框: 8px
头像: 50% (圆形)
小标签: 4px
```

### 阴影
```
卡片: 无阴影，靠背景色区分
弹窗: 0 8px 24px rgba(0,0,0,0.12)
```

### 按钮
**Primary (Blurple Pill):**
```
background: #5865F2
color: #FFFFFF
border-radius: 9999px
padding: 12px 24px
font-size: 14px
font-weight: 600
border: none
```

**Secondary (Outline):**
```
background: #FFFFFF
color: #060607
border: 1px solid #E3E5E8
border-radius: 9999px
```

**Text/Link:**
```
background: transparent
color: #5865F2
border: none
```

### 列表
```
背景: #FFFFFF
圆角: 16px
行内边距: 16px
分隔线: 1px #E3E5E8 (inset, margin-left: 16px)
行高: 48-56px
```

### 卡片
```
背景: #FFFFFF
圆角: 16px
无阴影 (靠 #F2F3F5 背景衬托)
内边距: 16px
```

### 输入框
```
背景: #E3E5E8
圆角: 8px
内边距: 12px 16px
文字色: #060607
占位符色: #80848E
无边框
聚焦: 无特殊变化
```

### Tab 切换 (Segmented Control)
```
容器: #E3E5E8 背景, 圆角 8px
未选中: 透明, 文字 #4E5058
选中: #FFFFFF 背景, 文字 #060607, 圆角 6px, 微阴影
```

### 切换开关
```
关闭: #80848E 背景, 白色滑块
开启: #5865F2 背景, 白色滑块
尺寸: 44x24px
```

### 单选按钮
```
未选中: 2px border #80848E, 无填充
选中: 2px border #5865F2, 内部填充 #5865F2, 白色对勾
```

### 头像
```
圆形, 无边框
状态指示器: 底部右侧, 8px圆点, 2px白色描边
在线: #23A55A
```

### 图标风格
```
线性图标, stroke-width: 1.5-2px
颜色: 继承文字色 或 #4E5058
大小: 20-24px
```

### 页面结构模式
**设置页模式:**
```
顶部: ← 返回 | 标题居中 | 右侧文字按钮(blue)
下方: 分段标题(灰色小字) + 白色卡片列表
每行: [图标] [标签] [值/chevron]
```

**个人资料页模式:**
```
顶部: 灰色区域 + 头像(带状态点) + 用户名 + 用户ID
下方: 编辑按钮(blurple pill) + Tab(主页/愿望单)
下方: 信息卡片列表
```

**空态模式:**
```
居中插图 + 标题 + 描述 + CTA按钮(blurple pill)
```

## 项目结构
```
src/
├── pages/
│   ├── index/index.vue      # 首页(渔获流)
│   ├── weather/index.vue    # 天时(钓鱼指数)
│   ├── map/index.vue        # 钓点(地图)
│   ├── mine/index.vue       # 我的(个人中心)
│   ├── login/index.vue      # 登录
│   ├── catch/create.vue     # 记录渔获
│   ├── catch/detail.vue     # 渔获详情
│   └── map/detail.vue       # 钓点详情
├── components/
│   ├── CatchCard.vue        # 渔获卡片
│   ├── WeatherMini.vue      # 指数条
│   ├── SpotCard.vue         # 钓点卡片
│   ├── FishBadge.vue        # 鱼种标签
│   ├── EmptyState.vue       # 空态
│   ├── LoadingSpinner.vue   # 加载
│   ├── LikeButton.vue       # 点赞
│   └── CommentList.vue      # 评论
├── uni.scss                 # 全局变量
├── pages.json               # 路由+tabBar
├── App.vue                  # 全局样式
└── static/tab/              # tabBar图标(SVG)
```

## 执行要求
1. 清空所有 .vue 文件的 `<style>` 和 `<template>`，保留 `<script>` 逻辑
2. 按 Discord 规范重写所有 UI
3. tabBar 图标用 SVG 线性风格
4. 全局背景 #F2F3F5，卡片 #FFFFFF
5. 所有交互加 :active 态
6. 完成后 git commit + push
