# FishX 项目交接包 — 新会话启动

## 项目状态
- **路径**: `~/yesxp/fishx`
- **分支**: main, commit `ab94603f`（已 push）
- **线上**: `fishx.lxapp.com`（Vercel 自动部署）
- **框架**: uni-app Vue3 + TS + Wot UI，锁 vue3 alpha tag

## 待解决问题
1. **右侧遮挡**：iPhone Safari 仍有右侧虚线框被截（commit ab94603f 加了全局 view reset，桌面 1280 视口已修复，但 iPhone 真机仍有问题）
2. 用户截图确认遮挡存在，agent-browser 无法模拟 iPhone viewport

## 已完成的修复
| commit | 修复 |
|---|---|
| da09c65b | FAB ripple 改 opacity（不 scale，溢出根因）|
| 5bb3dbbe | 全局 overflow-x:hidden on uni-page/html/body |
| ab94603f | 全局 uni-view box-sizing + min-width reset（App.vue 10 行）|

## 技术背景
- 根因：uni-app uvue.css 的 `uni-app uni-view` 选择器在 H5 编译产物不生效（根元素是 #app 不是 `<uni-app>`）
- App.vue 已加 reset：box-sizing:border-box / min-width:0 / flex-shrink:1 / flex-wrap:wrap
- 修复后桌面 1280 视口 6 页面都不溢出，但 iPhone 真机仍有问题
- 测试方式：agent-browser `viewport 393 852`（iPhone 尺寸）+ 截图

## 视觉规范
- iOS 浅紫渐变 #5865F2+#8B5CF6
- 玻璃感卡片 + Hero+chip 体系
- 原型参考：`~/yesxp/fishx/demo/fishx-ai-v3/*.html`

## 接下来可能要做的
1. 解决 iPhone 真机右侧遮挡（可能需要 CSS 容器查询或特定 iOS webkit 修复）
2. 继续 FishX V3 其他页面开发
3. Codex 实现 6 页面（交接包：`docs/handover-to-feishu.md`）

## 启动指令
新会话里发：
```
FishX 项目，读 ~/yesxp/fishx/docs/handover-to-feishu.md。
当前 commit ab94603f，右侧遮挡仍有问题（iPhone Safari），需要继续修复。
```
