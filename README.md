# 尺素 Letters & Longing

一个书信美学资料库，用精选内容、清晰来源和优雅阅读体验，帮助用户找到合适的书信表达。

| 首页句库                           | 开头馆                                   |
| ---------------------------------- | ---------------------------------------- |
| ![首页预览](docs/preview-home.png) | ![开头馆预览](docs/preview-openings.png) |

## 功能

- **句库** — 3000 条精选书信短句，支持关键词搜索与标签筛选
- **开头馆** — 按关系、情绪、语言筛选书信开头表达
- **结尾馆** — 按关系、情绪、语言筛选书信结尾表达
- **世界书信馆** — 精选公开信全文，含背景、来源与摘录
- **专题** — 编辑型内容专题，串联短句与信件
- **本地全文搜索** — 基于 Fuse.js，无需服务器
- **一键复制** — 复制短句，带反馈动效
- **来源溯源** — 每条内容均注明来源、版权状态

## 技术栈

| 层次 | 技术                                                            |
| ---- | --------------------------------------------------------------- |
| 框架 | [Next.js 14](https://nextjs.org/) (静态导出 `output: "export"`) |
| 样式 | [Tailwind CSS 3](https://tailwindcss.com/)                      |
| 搜索 | [Fuse.js](https://www.fusejs.io/)                               |
| 图标 | [Lucide React](https://lucide.dev/)                             |
| 语言 | TypeScript                                                      |
| 部署 | Cloudflare Pages                                                |

纯静态站点，无数据库，无服务器 API，无登录系统。

## 项目结构

```
.
├── app/                    # Next.js App Router 页面
│   ├── page.tsx            # 首页句库
│   ├── openings/           # 开头馆
│   ├── closings/           # 结尾馆
│   ├── letters/            # 世界书信馆
│   ├── topics/             # 专题
│   ├── excerpts/[id]/      # 短句详情
│   └── relations/[slug]/   # 情谊分类
├── components/             # React 组件
│   ├── search/             # 搜索与句库
│   ├── filters/            # 筛选器
│   ├── excerpts/           # 短句卡片
│   └── letters/            # 信件卡片
├── data/                   # 内容数据 (JSON)
│   ├── excerpts.json       # 短句 (~3000 条)
│   ├── letters.json        # 信件
│   ├── topics.json         # 专题
│   ├── tags.json           # 标签
│   └── sources.json        # 来源
├── lib/                    # 工具函数
│   ├── content/            # 数据读取层
│   └── search/             # 搜索索引构建
├── scripts/                # 构建脚本
│   ├── validate-data.ts    # 数据校验
│   ├── build-search-index.ts
│   └── build-sitemap.ts
└── docs/                   # 产品与技术文档
```

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
# → http://localhost:3000

# 构建（含数据校验、搜索索引、sitemap）
npm run build

# 类型检查
npm run typecheck

# 数据校验
npm run validate:data
```

## 内容数据

内容数据位于 `data/` 目录，均为 JSON 格式，由 Codex 负责研究、整理和维护。

**版权状态字段：**

| 值             | 含义       |
| -------------- | ---------- |
| `PublicDomain` | 公版       |
| `OpenLicensed` | 开放授权   |
| `Quotation`    | 合理短引用 |
| `SiteCuration` | 本站整理   |

每条内容均须有来源说明；历史原文、翻译、整理、白话解释须加以区分。

## 部署

项目配置为静态导出，可直接部署到 Cloudflare Pages、GitHub Pages、Vercel 等静态托管平台：

```bash
npm run build
# 产物位于 out/ 目录
```

线上地址：[letters-longing](https://wanxb.github.io/letters-longing/)
