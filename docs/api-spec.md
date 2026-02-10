# API接口文档（MVP）

Base URL: `/api/v1`

## 1. 认证

### POST `/auth/wecom/login`
请求：
```json
{ "code": "employee|manager|admin-xxx" }
```
响应：
```json
{ "accessToken": "mock-jwt-...", "user": { "id": "u-emp-001", "role": "EMPLOYEE" } }
```

## 2. 练习流程

### POST `/practices`
创建练习草稿。

### POST `/practices/{id}/outline/generate`
生成结构化大纲。

### GET `/practices/{id}/outline/stream`
SSE 流式输出。事件：`{ chunk }`，结束：`{ done: true }`。

### POST `/practices/{id}/recordings/presign`
获取录音上传签名。

### POST `/practices/{id}/asr/jobs`
发起 ASR 任务。

### GET `/practices/{id}/asr/jobs/{jobId}`
查询 ASR 状态与转写文本。

### POST `/practices/{id}/polish`
返回优化文本与 Diff：
```json
{
  "sourceText": "...",
  "polishedText": "...",
  "changes": [
    {
      "type": "REPLACE",
      "originalSpan": { "start": 2, "end": 4 },
      "newText": "该项",
      "reasonTag": "商务词替换",
      "reason": "替换为更正式的商务表达。"
    }
  ]
}
```

## 3. 管理端

### GET `/manager/dashboard`
查询练习统计。

### GET `/manager/records`
按部门/员工检索练习记录。

### GET `/manager/records/{recordId}`
查看单条记录详情（录音对象键、原文、优化文、Diff）。

## 4. 管理员配置

### GET `/admin/prompts`
获取 Prompt 模板与审计日志。

### POST `/admin/prompts`
新增 Prompt 版本。

### POST `/admin/prompts/{id}/publish`
发布指定版本。

### POST `/admin/prompts/{id}/rollback`
按模块+版本回滚。

## 5. 数据删除

### DELETE `/data/{entity}/{id}`
创建物理删除任务并返回执行结果。

## 6. 留存清理

### POST `/admin/retention/cleanup?days=90`
管理员触发留存清理任务。

## 7. 鉴权头

MVP联调使用请求头模拟身份：
- `x-role`: `EMPLOYEE` / `MANAGER` / `ADMIN`
- `x-user-id`
- `x-user-name`
