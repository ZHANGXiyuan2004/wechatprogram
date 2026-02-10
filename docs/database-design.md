# 数据库设计文档（MVP）

## 1. 表结构

### 1.1 users
- `id` (PK, varchar)
- `name` (varchar)
- `department_id` (varchar, index)
- `department_name` (varchar)
- `title` (varchar, nullable)
- `level` (varchar, nullable)
- `tags` (jsonb)
- `role` (enum: EMPLOYEE/MANAGER/ADMIN)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 1.2 departments
- `id` (PK, varchar)
- `name` (varchar)
- `parent_id` (varchar, nullable, index)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 1.3 practices
- `id` (PK, varchar)
- `user_id` (FK -> users.id, index)
- `topic` (varchar)
- `status` (enum: DRAFT/OUTLINE_DONE/RECORDING_DONE/ASR_DONE/POLISH_DONE)
- `created_at` (timestamp, index)
- `updated_at` (timestamp)

### 1.4 outlines
- `id` (PK, varchar)
- `practice_id` (FK -> practices.id, unique)
- `style` (enum: STRUCTURED/STORY/EXEC_SUMMARY)
- `content` (text)
- `prompt_tokens` (int)
- `completion_tokens` (int)
- `latency_ms` (int)
- `created_at` (timestamp)

### 1.5 recordings
- `id` (PK, varchar)
- `practice_id` (FK -> practices.id, index)
- `object_key` (varchar)
- `duration_sec` (int)
- `content_type` (varchar)
- `upload_status` (enum: PENDING/UPLOADED)
- `created_at` (timestamp)

### 1.6 asr_jobs
- `id` (PK, varchar)
- `practice_id` (FK -> practices.id, index)
- `recording_id` (FK -> recordings.id, index)
- `status` (enum: PENDING/RUNNING/SUCCESS/FAILED/TIMEOUT)
- `text` (text, nullable)
- `segments` (jsonb, nullable)
- `error_message` (text, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 1.7 polish_results
- `id` (PK, varchar)
- `practice_id` (FK -> practices.id, unique)
- `source_text` (text)
- `polished_text` (text)
- `changes` (jsonb)
- `score` (int)
- `created_at` (timestamp)

### 1.8 prompt_templates
- `id` (PK, varchar)
- `module` (enum: OUTLINE/POLISH/COACH/TEAM_INSIGHT, index)
- `version` (int)
- `content` (text)
- `published` (boolean, index)
- `created_by` (varchar)
- `created_at` (timestamp)
- unique: (`module`, `version`)

### 1.9 prompt_audit_logs
- `id` (PK, varchar)
- `prompt_template_id` (FK -> prompt_templates.id)
- `module` (enum)
- `action` (enum: CREATE/PUBLISH/ROLLBACK)
- `operator` (varchar)
- `detail` (varchar)
- `created_at` (timestamp, index)

### 1.10 deletion_jobs
- `id` (PK, varchar)
- `entity` (varchar)
- `entity_id` (varchar)
- `status` (enum: PENDING/RUNNING/DONE/FAILED)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## 2. 数据留存策略

- 默认保留 90 天。
- 超期由定时任务执行物理删除：先删业务主表，再删对象存储文件。
- 管理员可手动触发单条物理删除，记录在 `deletion_jobs`。

## 3. 安全与合规

- 所有敏感字段通过 TLS 传输。
- 对象存储启用 SSE。
- 删除动作必须审计，审计日志最少保留 180 天（可配置）。
