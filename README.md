# 企业内部口语表达训练系统（MVP）

本仓库实现了以下交付件：

- `apps/mini`: UniApp 微信小程序端（主题->大纲->录音->ASR->Diff复盘）
- `apps/admin-web`: Vue3 管理后台（看板、记录详情、Prompt配置中心）
- `apps/api`: NestJS(Fastify) 后端（统一AI网关、业务API、权限、删除任务）
- `packages/shared-types`: 前后端共享类型与DTO
- `packages/ai-gateway`: LLM/ASR适配层（腾讯默认实现，可扩展）
- `docs`: 数据库/API/部署/使用文档
- `scripts/easy`: 零基础双击脚本（首次安装/启动/停止/健康检查/生成微信包）
- `deploy/k8s`: K8s示例清单（私有化部署）

## 快速开始

先启用并使用 `pnpm`：

```bash
COREPACK_HOME=/tmp/corepack corepack prepare pnpm@9.15.4 --activate
COREPACK_HOME=/tmp/corepack corepack pnpm install
```

启动服务：

```bash
COREPACK_HOME=/tmp/corepack corepack pnpm dev:api
COREPACK_HOME=/tmp/corepack corepack pnpm dev:admin
COREPACK_HOME=/tmp/corepack corepack pnpm dev:mini
```

编译与测试：

```bash
COREPACK_HOME=/tmp/corepack corepack pnpm -r build
COREPACK_HOME=/tmp/corepack corepack pnpm -r test
```

详细使用说明见：`docs/usage-guide.md`

零基础操作手册见：`docs/non-tech-guide.md`

微信开发者工具导入图文手册见：`docs/wechat-devtools-guide.md`

零基础推荐入口（按顺序双击）：
- `scripts/easy/00-首次安装.command`
- `scripts/easy/01-启动系统.command`
- `scripts/easy/02-停止系统.command`
- `scripts/easy/03-健康检查.command`
- `scripts/easy/04-生成微信小程序包.command`

## 默认联调账号（通过请求头模拟）

- 员工：`x-role: EMPLOYEE`
- 主管：`x-role: MANAGER`
- 管理员：`x-role: ADMIN`

## API文档

后端启动后访问：

- Swagger UI: `http://localhost:3000/api/docs`
- Base URL: `http://localhost:3000/api/v1`
