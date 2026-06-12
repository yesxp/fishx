# Codex 项目部署指南

## 环境总览

| 组件 | 值 |
|---|---|
| GitHub SSH | `~/.ssh/id_ed25519` |
| Vercel 账号 | yesxp（GitHub OAuth） |
| 自定义域名 | `*.lxapp.com`（国内访问，Vercel 统一配置） |
| Codex CLI | v0.139.0 |
| 编码模型 | Agnes AI（via codeproxy:8787） |

## 部署架构

```
每个项目 = 一个 GitHub 仓库 + 一个 Vercel 项目 + lxapp.com 子域名
```

- GitHub：`yesxp/<项目名>`
- 域名：`<项目名>.lxapp.com`（国内访问）
- Vercel 默认域名 `<项目名>.vercel.app` 仍可用（国外访问）

## 项目列表

| 项目名 | GitHub 仓库 | 域名 | 技术栈 | 说明 |
|---|---|---|---|---|
| fishx | `yesxp/fishx` | `fishx.lxapp.com` | HTML/CSS/JS | FishX 钓鱼应用着陆页（建设中） |
| yescode | `yesxp/yescode` | `yescode.lxapp.com` | HTML/CSS/JS | 项目目录/待定 |

> 新增项目：用户建 GitHub 仓库 + Vercel Import + 配置 lxapp.com 子域名

## 标准部署流程

```bash
# 1. Codex 写代码
bash ~/.hermes/scripts/codex-run.sh /tmp/<项目名> "读取 TASK.md 执行"

# 2. 推送到 GitHub → Vercel 自动部署
bash ~/.hermes/scripts/deploy.sh /tmp/<项目名> <项目名>

# 3. 访问: <项目名>.lxapp.com
```

## 新项目 Checklist

- [ ] 用户：GitHub 建仓库（Public）+ Vercel Import + 配置 lxapp.com 子域名（1分钟）
- [ ] 用户：告诉 Hermes 仓库名
- [ ] Hermes：写 TASK.md → Codex 执行 → 验收 → 推送 → 交付 `<项目名>.lxapp.com`

## 技术约束

- 纯前端（HTML/CSS/JS/React/Vue/uni-app H5）
- Vercel 免费版只支持 Public 仓库
- 自定义域名在 Vercel 项目 Settings → Domains 添加 `*.lxapp.com`
- uni-app：`npm install --legacy-peer-deps`，Build: `npm run build:h5`，Output: `dist/build/h5`

## Vercel 域名配置

每个新项目部署后，需在 Vercel 控制台：
1. 进入项目 → Settings → Domains
2. 添加 `<项目名>.lxapp.com`
3. DNS 配置：CNAME → `cname.vercel-dns.com`
