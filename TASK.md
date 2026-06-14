# 鱼渔娱 Discord 设计语言复刻

## 目标
将鱼渔娱 H5 App 的 UI 完整复刻为 Discord 风格。不要"借鉴"，要**像素级还原** Discord 的视觉语言：按钮、卡片、列表、字体、间距、颜色、图标、交互状态全部对齐 Discord。

## 设计规范（从 Discord Light Theme 提取）

### 颜色
```css
/* Discord Light Theme */
--background-primary: #FFFFFF;        /* 主内容区 */
--background-secondary: #F2F3F5;     /* 侧边栏/二级面板 */
--background-tertiary: #E3E5E8;      /* 输入框/最深层 */
--background-modifier-hover: rgba(79,84,92,0.08);
--background-modifier-active: rgba(79,84,92,0.16);
--background-modifier-selected: rgba(88,101,242,0.08);

/* 文字 */
--text-normal: #313338;              /* 主文字 */
--text-muted: #5C5E66;              /* 次要文字 */
--text-faint: #80848E;              /* 最淡文字 */
--header-primary: #313338;          /* 标题 */
--header-secondary: #5C5E66;        /* 副标题 */

/* 品牌色 */
--brand-500: #5865F2;               /* Blurple 主色 */
--brand-560: #4752C4;               /* Blurple hover */
--brand-600: #3C45A5;               /* Blurple active */

/* 状态色 */
--status-online: #23A55A;           /* 在线/成功 */
--status-idle: #F0B232;             /* 警告/空闲 */
--status-danger: #F23F43;           /* 错误/危险 */

/* 分隔线 */
--divider: rgba(79,84,92,0.08);     /* 列表分隔线 */
--divider-strong: rgba(79,84,92,0.12); /* 强分隔线 */
```

### 字体
```css
--font-primary: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
/* Discord 用 gg sans，移动端 fallback 到系统字体 */
/* 中文用 Noto Sans SC */
```

### 字号规范（Discord 原生）
| 元素 | 字号 | 字重 | 行高 | 颜色 |
|------|------|------|------|------|
| 页面大标题 | 20px | 700 | 24px | header-primary |
| 卡片标题 | 14px | 600 | 20px | header-primary |
| 正文 | 16px | 400 | 22px | text-normal |
| 次要文字 | 14px | 400 | 18px | text-muted |
| 时间戳 | 12px | 500 | 22px | text-muted |
| 标签文字 | 12px | 500 | 16px | text-muted |
| 按钮文字 | 14px | 500 | 16px | #FFFFFF |

### 圆角
| 元素 | 圆角 |
|------|------|
| 卡片 | 8px |
| 按钮 | 20px (pill) 或 4px (方形) |
| 输入框 | 4px |
| 头像 | 50% (圆形) |
| 标签/Tag | 20px (pill) |
| 下拉菜单 | 4px |

### 阴影
```css
/* Discord 的阴影极其克制 */
--shadow-low: 0 1px 2px rgba(0,0,0,0.06);    /* 卡片默认 */
--shadow-medium: 0 4px 8px rgba(0,0,0,0.12);  /* 浮动元素 */
--shadow-high: 0 8px 16px rgba(0,0,0,0.16);   /* 弹窗 */
```

### 按钮规范（Discord 原生）
**Primary Button (Blurple):**
```css
background: #5865F2;
color: #FFFFFF;
border: none;
border-radius: 20px;  /* pill */
padding: 8px 24px;
font-size: 14px;
font-weight: 500;
line-height: 16px;
/* hover */ background: #4752C4;
/* active */ background: #3C45A5;
/* disabled */ background: #5865F2; opacity: 0.5;
```

**Secondary Button (Ghost):**
```css
background: transparent;
color: #5865F2;
border: none;
/* hover */ background: rgba(88,101,242,0.08);
/* active */ background: rgba(88,101,242,0.16);
```

**Danger Button:**
```css
background: #F23F43;
color: #FFFFFF;
border-radius: 20px;
```

**Link Button:**
```css
background: transparent;
color: #5865F2;
border: none;
text-decoration: underline;
```

### 列表规范（Discord Inset List）
```css
.list-group {
  background: #FFFFFF;
  border-radius: 8px;
  overflow: hidden;
}
.list-item {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  min-height: 44px;
}
.list-item:active {
  background: rgba(79,84,92,0.08);
}
.list-divider {
  height: 1px;
  background: rgba(79,84,92,0.08);
  margin-left: 16px;  /* inset: 不到边 */
}
```

### 卡片规范
```css
.card {
  background: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
  padding: 16px;
}
```

### 标签/Tag 规范
```css
.tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 3px;
  background: rgba(79,84,92,0.08);
  color: #5C5E66;
  font-size: 12px;
  font-weight: 500;
}
.tag.active {
  background: #5865F2;
  color: #FFFFFF;
}
```

### 图标规范
Discord 使用线性图标，stroke-width: 2px，24x24 viewBox。
图标颜色继承文字色或使用 #80848E。

### 状态指示器
```css
.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid #FFFFFF;  /* 白色描边 */
}
.status-dot.online { background: #23A55A; }
.status-dot.idle { background: #F0B232; }
.status-dot.dnd { background: #F23F43; }
.status-dot.offline { background: #80848E; }
```

## 页面结构要求

### 4 个主页面全部重写：
1. **首页** — 顶部品牌栏（模糊紫logo+标题）+ 指数卡片 + 天气数据列表 + 标签筛选 + 渔获瀑布流
2. **天时** — 顶部标题 + 大字指数 + 天气数据列表 + 气压趋势图 + 时段列表 + 逐小时
3. **钓点** — 顶部标题 + 搜索栏 + 地图 + 钓点卡片
4. **我的** — 顶部标题 + 个人信息 + 统计 + 功能列表 + 设置列表 + 退出

### TabBar：
- Discord 底部导航风格
- 图标用 SVG 线性，24px
- 选中态：Blurple 色 + 底部指示条
- 未选中：#80848E

### 交互：
- 所有可点击元素加 `:active` 态 `background: rgba(79,84,92,0.08)`
- 按钮加 hover/active 态
- 列表项加按压反馈
- 标签切换有过渡动画

## 项目信息
- 路径：`/Users/jun/yesxp/fishx`
- 框架：Uni-app (Vue3 + TS + Vite)
- 构建：H5 模式，部署到 Vercel
- 分支：main
- 现有组件：CatchCard, WeatherMini, SpotCard, FishBadge, EmptyState, LoadingSpinner
- 现有页面：index, weather, map, mine, login, catch/create, catch/detail, map/detail

## 注意事项
- `uni.scss` 是全局样式变量，改了所有页面生效
- `pages.json` 控制 tabBar 配色
- TabBar 图标在 `src/static/tab/` 目录
- 所有组件在 `src/components/` 目录
- 不要删除现有功能逻辑，只改 UI 样式
- 保持所有数据绑定和事件处理不变
- 输出后推送 git，Vercel 会自动部署
