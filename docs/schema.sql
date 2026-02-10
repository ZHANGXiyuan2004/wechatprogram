-- PostgreSQL schema for enterprise oral expression training system (MVP)

CREATE TYPE role AS ENUM ('EMPLOYEE', 'MANAGER', 'ADMIN');
CREATE TYPE outline_style AS ENUM ('STRUCTURED', 'STORY', 'EXEC_SUMMARY');
CREATE TYPE practice_status AS ENUM ('DRAFT', 'OUTLINE_DONE', 'RECORDING_DONE', 'ASR_DONE', 'POLISH_DONE');
CREATE TYPE asr_job_status AS ENUM ('PENDING', 'RUNNING', 'SUCCESS', 'FAILED', 'TIMEOUT');
CREATE TYPE prompt_module AS ENUM ('OUTLINE', 'POLISH', 'COACH', 'TEAM_INSIGHT');

CREATE TABLE users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  department_id VARCHAR(64) NOT NULL,
  department_name VARCHAR(128) NOT NULL,
  title VARCHAR(128),
  level VARCHAR(64),
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  role role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE departments (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  parent_id VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE practices (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL REFERENCES users(id),
  topic VARCHAR(255) NOT NULL,
  status practice_status NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_practices_user_id ON practices(user_id);
CREATE INDEX idx_practices_created_at ON practices(created_at);

CREATE TABLE outlines (
  id VARCHAR(64) PRIMARY KEY,
  practice_id VARCHAR(64) NOT NULL UNIQUE REFERENCES practices(id),
  style outline_style NOT NULL,
  content TEXT NOT NULL,
  prompt_tokens INT NOT NULL DEFAULT 0,
  completion_tokens INT NOT NULL DEFAULT 0,
  latency_ms INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE recordings (
  id VARCHAR(64) PRIMARY KEY,
  practice_id VARCHAR(64) NOT NULL REFERENCES practices(id),
  object_key VARCHAR(255) NOT NULL,
  duration_sec INT NOT NULL,
  content_type VARCHAR(64) NOT NULL,
  upload_status VARCHAR(16) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_recordings_practice_id ON recordings(practice_id);

CREATE TABLE asr_jobs (
  id VARCHAR(64) PRIMARY KEY,
  practice_id VARCHAR(64) NOT NULL REFERENCES practices(id),
  recording_id VARCHAR(64) NOT NULL REFERENCES recordings(id),
  status asr_job_status NOT NULL,
  text TEXT,
  segments JSONB,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_asr_jobs_practice_id ON asr_jobs(practice_id);
CREATE INDEX idx_asr_jobs_recording_id ON asr_jobs(recording_id);

CREATE TABLE polish_results (
  id VARCHAR(64) PRIMARY KEY,
  practice_id VARCHAR(64) NOT NULL UNIQUE REFERENCES practices(id),
  source_text TEXT NOT NULL,
  polished_text TEXT NOT NULL,
  changes JSONB NOT NULL,
  score INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE prompt_templates (
  id VARCHAR(64) PRIMARY KEY,
  module prompt_module NOT NULL,
  version INT NOT NULL,
  content TEXT NOT NULL,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  created_by VARCHAR(128) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(module, version)
);
CREATE INDEX idx_prompt_templates_module_pub ON prompt_templates(module, published);

CREATE TABLE prompt_audit_logs (
  id VARCHAR(64) PRIMARY KEY,
  prompt_template_id VARCHAR(64) NOT NULL REFERENCES prompt_templates(id),
  module prompt_module NOT NULL,
  action VARCHAR(32) NOT NULL,
  operator VARCHAR(128) NOT NULL,
  detail VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_prompt_audit_logs_created_at ON prompt_audit_logs(created_at);

CREATE TABLE deletion_jobs (
  id VARCHAR(64) PRIMARY KEY,
  entity VARCHAR(64) NOT NULL,
  entity_id VARCHAR(64) NOT NULL,
  status VARCHAR(16) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
