# 企业内部口语表达训练系统 使用文档（MVP）

## 1. 适用范围
本文档适用于本仓库 MVP 版本，覆盖以下内容：
- 本地环境初始化
- 依赖安装
- 本地启动与联调
- 编译与测试
- 角色使用流程（员工/主管/管理员）
- 常见问题处理

如果使用者没有开发经验，请优先使用：`docs/non-tech-guide.md`。

## 2. 目录结构
- `apps/api`：NestJS 后端服务
- `apps/admin-web`：管理后台（Vue3）
- `apps/mini`：小程序端业务代码（当前本地以 Vite Web 预览构建）
- `packages/shared-types`：共享类型
- `packages/ai-gateway`：LLM/ASR 网关层
- `docs`：数据库/API/部署/使用文档
- `deploy`：Docker Compose 与 K8s 配置

## 3. 环境要求
- Node.js `>= 20`
- npm `>= 10`
- corepack 可用（Node 自带）

## 4. 本地初始化
在仓库根目录执行：

```bash
COREPACK_HOME=/tmp/corepack corepack prepare pnpm@9.15.4 --activate
COREPACK_HOME=/tmp/corepack corepack pnpm install
```

## 5. 启动开发环境
分别打开三个终端：

### 5.1 启动后端 API
```bash
COREPACK_HOME=/tmp/corepack corepack pnpm --filter @asrllm/api dev
```
默认地址：`http://localhost:3000`

### 5.2 启动管理后台
```bash
COREPACK_HOME=/tmp/corepack corepack pnpm --filter @asrllm/admin-web dev
```
默认地址：`http://localhost:5174`

### 5.3 启动小程序端预览
```bash
COREPACK_HOME=/tmp/corepack corepack pnpm --filter @asrllm/mini dev
```
默认地址：`http://localhost:5173`
说明：该地址用于本地 H5 联调，不是微信真机页面。

### 5.4 生成微信小程序包（用于微信开发者工具）
```bash
COREPACK_HOME=/tmp/corepack corepack pnpm --filter @asrllm/mini build:mp-weixin
```
默认输出目录（原生模式）：
- `apps/mini/dist/build/mp-weixin`
- 或 `apps/mini/unpackage/dist/build/mp-weixin`

如果原生构建失败，`04` 脚本会自动回退到调试壳模式：
- `apps/mini/dist/build/mp-weixin-wrapper`

零基础用户建议直接双击：
- `scripts/easy/04-生成微信小程序包.command`

微信开发者工具导入图文步骤见：
- `docs/wechat-devtools-guide.md`

## 6. 编译与测试

### 6.1 全量编译
```bash
COREPACK_HOME=/tmp/corepack corepack pnpm -r build
```

### 6.2 全量测试
```bash
COREPACK_HOME=/tmp/corepack corepack pnpm -r test
```

## 7. 角色联调说明

## 7.1 员工端（EMPLOYEE）
流程：
1. 输入主题，选择风格（`STRUCTURED/STORY/EXEC_SUMMARY`）。
2. 生成大纲（打字机效果）。
3. 录音并提交 ASR。 
4. 查看优化文本和 Diff 理由。

员工端请求头示例：
- `x-role: EMPLOYEE`
- `x-user-id: u-emp-001`
- `x-user-name: 演示员工`

## 7.2 管理端（MANAGER）
功能：
- 看板：活跃度、时长、热门话题
- 检索：按部门/员工查询记录
- 下钻：查看单条记录详情

管理端请求头示例：
- `x-role: MANAGER`
- `x-user-id: u-mgr-001`

## 7.3 管理员（ADMIN）
功能：
- Prompt 版本创建/发布/回滚
- 物理删除任务触发
- 数据留存清理任务触发

管理员请求头示例：
- `x-role: ADMIN`
- `x-user-id: u-admin-001`

## 8. 常用接口
- `POST /api/v1/auth/wecom/login`
- `POST /api/v1/practices`
- `POST /api/v1/practices/{id}/outline/generate`
- `GET /api/v1/practices/{id}/outline/stream`
- `POST /api/v1/practices/{id}/recordings/presign`
- `POST /api/v1/practices/{id}/asr/jobs`
- `GET /api/v1/practices/{id}/asr/jobs/{jobId}`
- `POST /api/v1/practices/{id}/polish`
- `GET /api/v1/manager/dashboard`
- `GET /api/v1/manager/records`
- `GET /api/v1/manager/records/{recordId}`
- `GET /api/v1/admin/prompts`
- `POST /api/v1/admin/prompts`
- `POST /api/v1/admin/prompts/{id}/publish`
- `POST /api/v1/admin/prompts/rollback`
- `DELETE /api/v1/data/{entity}/{id}`
- `POST /api/v1/admin/retention/cleanup?days=90`

Swagger 地址：`http://localhost:3000/api/docs`

## 9. 私有化部署（简版）

### 9.1 本地基础依赖（Postgres/Redis/MinIO）
```bash
docker compose -f deploy/docker-compose.local.yml up -d
```

### 9.2 K8s 部署
按顺序执行：
```bash
kubectl apply -f deploy/k8s/namespace.yaml
kubectl apply -f deploy/k8s/configmap.yaml
kubectl apply -f deploy/k8s/secret.example.yaml
kubectl apply -f deploy/k8s/postgres.yaml
kubectl apply -f deploy/k8s/redis.yaml
kubectl apply -f deploy/k8s/minio.yaml
kubectl apply -f deploy/k8s/api.yaml
kubectl apply -f deploy/k8s/admin-web.yaml
kubectl apply -f deploy/k8s/ingress.yaml
kubectl apply -f deploy/k8s/retention-cronjob.yaml
```

## 10. 常见问题

### 10.1 `pnpm` 命令不存在
使用：
```bash
COREPACK_HOME=/tmp/corepack corepack prepare pnpm@9.15.4 --activate
```

### 10.2 网络导致安装失败（ENOTFOUND）
确认可访问 `https://registry.npmjs.org`，或配置企业代理后重试。

### 10.3 管理后台无测试文件导致测试失败
当前已设置 `--passWithNoTests`，如新增测试，请放到 `src/**/*.spec.ts`。

### 10.4 小程序端说明
- `apps/mini` 当前本地构建为 Vite Web 预览入口（用于本地联调与编译校验）。
- 真实微信小程序发布时，仍使用 `pages.json`、`manifest.json` 和小程序端代码进行打包发布。
