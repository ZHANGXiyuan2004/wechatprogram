import {
  AsrJobStatus,
  DiffReasonTag,
  DiffType,
  OutlineStyle,
  PracticeStatus,
  PromptModule,
  Role
} from './enums.js';

export interface UserProfile {
  id: string;
  name: string;
  departmentId: string;
  departmentName: string;
  title?: string;
  level?: string;
  tags?: string[];
  role: Role;
}

export interface CreatePracticeRequest {
  topic: string;
}

export interface Practice {
  id: string;
  userId: string;
  topic: string;
  status: PracticeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateOutlineRequest {
  style: OutlineStyle;
  level?: string;
  backgroundTags?: string[];
}

export interface DiffChange {
  type: DiffType;
  originalSpan: { start: number; end: number };
  newText: string;
  reasonTag: DiffReasonTag;
  reason: string;
}

export interface OutlineGenerateResponse {
  outlineId: string;
  practiceId: string;
  style: OutlineStyle;
  content: string;
  latencyMs: number;
}

export interface CreateRecordingPresignRequest {
  fileName: string;
  contentType: string;
  durationSec: number;
}

export interface CreateRecordingPresignResponse {
  recordingId: string;
  uploadUrl: string;
  objectKey: string;
}

export interface CreateAsrJobRequest {
  recordingId: string;
}

export interface AsrSegment {
  startMs: number;
  endMs: number;
  text: string;
}

export interface AsrJob {
  id: string;
  practiceId: string;
  recordingId: string;
  status: AsrJobStatus;
  text?: string;
  segments?: AsrSegment[];
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PolishRequest {
  sourceText: string;
}

export interface PolishResponse {
  sourceText: string;
  polishedText: string;
  changes: DiffChange[];
}

export interface PromptTemplate {
  id: string;
  module: PromptModule;
  version: number;
  content: string;
  published: boolean;
  createdBy: string;
  createdAt: string;
}

export interface PromptAuditLog {
  id: string;
  promptTemplateId: string;
  module: PromptModule;
  action: 'CREATE' | 'PUBLISH' | 'ROLLBACK';
  operator: string;
  createdAt: string;
  detail: string;
}

export interface DashboardSummary {
  totalPracticeCount: number;
  activeEmployeeCount: number;
  avgDurationSec: number;
  topTopics: Array<{ topic: string; count: number }>;
}

export interface RecordItem {
  practiceId: string;
  employeeName: string;
  departmentName: string;
  topic: string;
  durationSec: number;
  status: PracticeStatus;
  createdAt: string;
}

export interface ManagerRecordDetail {
  practice: Practice;
  recording?: {
    recordingId: string;
    objectKey: string;
    durationSec: number;
  };
  asrText?: string;
  polishedText?: string;
  changes?: DiffChange[];
}

export interface DeleteDataRequest {
  entity: 'practice' | 'recording' | 'user';
  id: string;
}

export interface DeleteJob {
  id: string;
  entity: string;
  entityId: string;
  status: 'PENDING' | 'RUNNING' | 'DONE' | 'FAILED';
  createdAt: string;
  updatedAt: string;
}

export interface PromptResolveInput {
  module: PromptModule;
  version?: number;
  variables: Record<string, string>;
}

export interface LlmGenerateInput {
  module: PromptModule;
  prompt: string;
  stream?: boolean;
  idempotencyKey?: string;
}

export interface LlmGenerateOutput {
  text: string;
  latencyMs: number;
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
  };
}

export interface AsrTranscribeInput {
  objectKey: string;
  language?: string;
  idempotencyKey?: string;
}

export interface AsrTranscribeOutput {
  text: string;
  segments: AsrSegment[];
  latencyMs: number;
}
