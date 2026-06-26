# Deferred Tasks (iOS Safari 摄像头 + 其它已知问题)

## 📱 拍照流 iOS Safari 摄像头 (P0)

**状态**：deferred，等待用户在真机测试最新部署（commit `c1143ead`）

**问题**：iOS Safari 拍照页取景框取不到摄像头实时视频流

**已尝试方案**（全部已部署）：

| Commit | 改动 | 结果 |
|---|---|---|
| `a54c9e97` | 首次实现 video + getUserMedia | 报 `setAttribute is not a function` |
| `31cd9eea` | 移除冗余 setAttribute，加轮询 + onMounted 自动启动 | 报 "video 元素未就绪" |
| `c1143ead` | 改用 `document.getElementById` 绕过 uni-app H5 ref 代理 | 等待真机验证 |

**根因**：uni-app H5 编译器包装原生 HTML 元素（类似 `<view>` → `<uni-view>`），Vue ref 返回的不是浏览器原生 `HTMLVideoElement`，是有 `value` 但没 `setAttribute/play` 方法的代理对象。

**最终方案**：用 `id="cameraVideoEl"` + `document.getElementById('cameraVideoEl')` 直接拿 DOM，绕过 ref 代理。

**真机测试步骤**：
1. iPhone Safari → 无痕模式（清缓存）
2. 访问 fishx.lxapp.com
3. 点中央蓝色相机按钮 → 进入拍照页
4. 弹权限 → 允许
5. 预期：摄像头实时画面出现

**降级方案**（如还失败）：
- 改用 `<input type="file" accept="image/*" capture="environment">` 调起原生相机
- 失去实时预览，但稳定可靠

## 其它 deferred

- Vercel 部署触发慢（GitHub push 后需 2-4 分钟才更新 CDN），CLI 无 token 不可手动触发
- 视觉 token 全面统一（部分页面圆角/阴影细节）
- App.vue font-family 改为 -apple-system 优先
- fish_species 表 spot_geo 字段精度优化
