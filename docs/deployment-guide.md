# 系统部署手册（私有化/K8s）

## 1. 组件清单

- API: NestJS + Fastify
- Admin Web: Vue3 静态站点
- Mini: UniApp 编译产物（由企业微信小程序平台托管）
- PostgreSQL 15
- Redis
- MinIO
- Nginx Ingress
- Prometheus/Grafana/Loki

## 2. 环境变量（API）

- `NODE_ENV=production`
- `PORT=3000`
- `DATABASE_URL=postgres://...`
- `REDIS_URL=redis://...`
- `MINIO_ENDPOINT=http://minio:9000`
- `MINIO_ACCESS_KEY=...`
- `MINIO_SECRET_KEY=...`
- `JWT_SECRET=...`
- `LLM_PROVIDER=tencent`
- `ASR_PROVIDER=tencent`

## 3. 构建镜像

```bash
docker build -f apps/api/Dockerfile -t asrllm/api:0.1.0 .
docker build -f apps/admin-web/Dockerfile -t asrllm/admin-web:0.1.0 .
```

## 4. K8s部署

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
```

## 5. 数据留存任务

- 推荐使用 CronJob 每日执行一次：
  - 调用 API 内部保留策略服务。
  - 清理超过 90 天的数据与对象存储文件。

## 6. 安全要求

- Ingress 必须开启 HTTPS。
- API 仅开放内网或通过 WAF 暴露。
- 对象存储桶策略禁止公网读写。
- 所有密钥通过 K8s Secret 注入。
