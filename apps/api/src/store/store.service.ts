import {
  AsrJob,
  AsrJobStatus,
  DashboardSummary,
  DiffChange,
  DiffReasonTag,
  DiffType,
  ManagerRecordDetail,
  OutlineStyle,
  Practice,
  PracticeStatus,
  PromptAuditLog,
  PromptModule,
  PromptTemplate,
  RecordItem,
  Role,
  UserProfile
} from '@asrllm/shared-types';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

interface Department {
  id: string;
  name: string;
  parentId?: string;
}

interface OutlineRecord {
  id: string;
  practiceId: string;
  style: OutlineStyle;
  content: string;
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
  createdAt: string;
}

interface RecordingRecord {
  id: string;
  practiceId: string;
  objectKey: string;
  uploadUrl: string;
  durationSec: number;
  contentType: string;
  uploadStatus: 'PENDING' | 'UPLOADED';
  createdAt: string;
}

interface PolishRecord {
  id: string;
  practiceId: string;
  sourceText: string;
  polishedText: string;
  changes: DiffChange[];
  score: number;
  createdAt: string;
}

export interface DeletionJob {
  id: string;
  entity: string;
  entityId: string;
  status: 'PENDING' | 'RUNNING' | 'DONE' | 'FAILED';
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class InMemoryStoreService {
  readonly departments: Department[] = [
    { id: 'dep-001', name: '产品研发部' },
    { id: 'dep-002', name: '市场运营部' }
  ];

  readonly users: UserProfile[] = [
    {
      id: 'u-emp-001',
      name: '演示员工',
      departmentId: 'dep-001',
      departmentName: '产品研发部',
      title: '产品经理',
      level: 'P5',
      tags: ['toB', 'SaaS'],
      role: Role.EMPLOYEE
    },
    {
      id: 'u-mgr-001',
      name: '演示主管',
      departmentId: 'dep-001',
      departmentName: '产品研发部',
      title: '部门主管',
      level: 'M1',
      tags: ['管理'],
      role: Role.MANAGER
    },
    {
      id: 'u-admin-001',
      name: '系统管理员',
      departmentId: 'dep-001',
      departmentName: '产品研发部',
      title: '平台管理员',
      level: 'A1',
      tags: ['admin'],
      role: Role.ADMIN
    }
  ];

  readonly practices: Practice[] = [];
  readonly outlines: OutlineRecord[] = [];
  readonly recordings: RecordingRecord[] = [];
  readonly asrJobs: AsrJob[] = [];
  readonly polishRecords: PolishRecord[] = [];
  readonly promptTemplates: PromptTemplate[] = [];
  readonly promptAuditLogs: PromptAuditLog[] = [];
  readonly deletionJobs: DeletionJob[] = [];

  constructor() {
    this.seedPrompts();
  }

  private seedPrompts(): void {
    const templates: Array<{ module: PromptModule; content: string }> = [
      {
        module: PromptModule.OUTLINE,
        content:
          '你是企业内部演讲教练。请基于主题{{topic}}，按{{style}}风格输出结构化大纲。用户级别：{{level}}，背景：{{backgroundTags}}。'
      },
      {
        module: PromptModule.POLISH,
        content:
          '请优化以下口语表达，保持原意并提升商务表达。原文：{{sourceText}}，输出优化文本并给出修改理由。'
      },
      {
        module: PromptModule.COACH,
        content: '你是管理者辅导助手，请基于记录输出一份一对一面谈建议。'
      },
      {
        module: PromptModule.TEAM_INSIGHT,
        content: '你是团队分析助手，请总结多名员工表达中的共性问题。'
      }
    ];

    for (const item of templates) {
      this.createPromptTemplate(item.module, item.content, 'system-seed', true);
    }
  }

  createPractice(userId: string, topic: string): Practice {
    const now = new Date().toISOString();
    const practice: Practice = {
      id: `prac-${randomUUID()}`,
      userId,
      topic,
      status: PracticeStatus.DRAFT,
      createdAt: now,
      updatedAt: now
    };
    this.practices.push(practice);
    return practice;
  }

  getPracticeById(id: string): Practice | undefined {
    return this.practices.find((p) => p.id === id);
  }

  updatePracticeStatus(id: string, status: PracticeStatus): Practice | undefined {
    const practice = this.getPracticeById(id);
    if (!practice) {
      return undefined;
    }
    practice.status = status;
    practice.updatedAt = new Date().toISOString();
    return practice;
  }

  createOutline(
    practiceId: string,
    style: OutlineStyle,
    content: string,
    tokenUsage: { promptTokens: number; completionTokens: number },
    latencyMs: number
  ): OutlineRecord {
    const record: OutlineRecord = {
      id: `outline-${randomUUID()}`,
      practiceId,
      style,
      content,
      promptTokens: tokenUsage.promptTokens,
      completionTokens: tokenUsage.completionTokens,
      latencyMs,
      createdAt: new Date().toISOString()
    };
    this.outlines.push(record);
    this.updatePracticeStatus(practiceId, PracticeStatus.OUTLINE_DONE);
    return record;
  }

  getOutlineByPracticeId(practiceId: string): OutlineRecord | undefined {
    return this.outlines.find((o) => o.practiceId === practiceId);
  }

  createRecording(
    practiceId: string,
    durationSec: number,
    contentType: string,
    fileName: string
  ): RecordingRecord {
    const id = `rec-${randomUUID()}`;
    const objectKey = `recordings/${practiceId}/${id}-${fileName}`;
    const recording: RecordingRecord = {
      id,
      practiceId,
      objectKey,
      uploadUrl: `https://minio.internal/${objectKey}?signature=demo`,
      durationSec,
      contentType,
      uploadStatus: 'PENDING',
      createdAt: new Date().toISOString()
    };
    this.recordings.push(recording);
    this.updatePracticeStatus(practiceId, PracticeStatus.RECORDING_DONE);
    return recording;
  }

  getRecordingById(id: string): RecordingRecord | undefined {
    return this.recordings.find((r) => r.id === id);
  }

  markRecordingUploaded(id: string): void {
    const rec = this.getRecordingById(id);
    if (rec) {
      rec.uploadStatus = 'UPLOADED';
    }
  }

  createAsrJob(practiceId: string, recordingId: string): AsrJob {
    const now = new Date().toISOString();
    const job: AsrJob = {
      id: `asr-${randomUUID()}`,
      practiceId,
      recordingId,
      status: AsrJobStatus.PENDING,
      createdAt: now,
      updatedAt: now
    };
    this.asrJobs.push(job);
    return job;
  }

  updateAsrJob(jobId: string, patch: Partial<AsrJob>): AsrJob | undefined {
    const job = this.asrJobs.find((j) => j.id === jobId);
    if (!job) {
      return undefined;
    }
    Object.assign(job, patch, { updatedAt: new Date().toISOString() });
    if (job.status === AsrJobStatus.SUCCESS) {
      this.updatePracticeStatus(job.practiceId, PracticeStatus.ASR_DONE);
    }
    return job;
  }

  getAsrJobById(jobId: string): AsrJob | undefined {
    return this.asrJobs.find((j) => j.id === jobId);
  }

  getAsrJobByPracticeId(practiceId: string): AsrJob | undefined {
    return this.asrJobs.find((j) => j.practiceId === practiceId);
  }

  createPolish(practiceId: string, sourceText: string, polishedText: string, changes: DiffChange[]): PolishRecord {
    const record: PolishRecord = {
      id: `pol-${randomUUID()}`,
      practiceId,
      sourceText,
      polishedText,
      changes,
      score: Math.min(100, 70 + changes.length * 5),
      createdAt: new Date().toISOString()
    };
    this.polishRecords.push(record);
    this.updatePracticeStatus(practiceId, PracticeStatus.POLISH_DONE);
    return record;
  }

  getPolishByPracticeId(practiceId: string): PolishRecord | undefined {
    return this.polishRecords.find((p) => p.practiceId === practiceId);
  }

  createPromptTemplate(
    module: PromptModule,
    content: string,
    createdBy: string,
    publish = false
  ): PromptTemplate {
    const maxVersion = this.promptTemplates
      .filter((p) => p.module === module)
      .reduce((acc, cur) => Math.max(acc, cur.version), 0);

    const template: PromptTemplate = {
      id: `prompt-${randomUUID()}`,
      module,
      version: maxVersion + 1,
      content,
      published: publish,
      createdBy,
      createdAt: new Date().toISOString()
    };

    if (publish) {
      for (const item of this.promptTemplates.filter((p) => p.module === module)) {
        item.published = false;
      }
    }

    this.promptTemplates.push(template);
    this.createPromptAudit(template.id, module, publish ? 'PUBLISH' : 'CREATE', createdBy, `v${template.version}`);
    return template;
  }

  publishPromptTemplate(id: string, operator: string): PromptTemplate | undefined {
    const target = this.promptTemplates.find((p) => p.id === id);
    if (!target) {
      return undefined;
    }

    for (const item of this.promptTemplates.filter((p) => p.module === target.module)) {
      item.published = false;
    }
    target.published = true;
    this.createPromptAudit(target.id, target.module, 'PUBLISH', operator, `v${target.version}`);
    return target;
  }

  rollbackPromptTemplate(module: PromptModule, version: number, operator: string): PromptTemplate | undefined {
    const target = this.promptTemplates.find((p) => p.module === module && p.version === version);
    if (!target) {
      return undefined;
    }

    for (const item of this.promptTemplates.filter((p) => p.module === module)) {
      item.published = false;
    }
    target.published = true;
    this.createPromptAudit(target.id, module, 'ROLLBACK', operator, `rollback->v${version}`);
    return target;
  }

  listPrompts(module?: PromptModule): PromptTemplate[] {
    return this.promptTemplates
      .filter((p) => (!module ? true : p.module === module))
      .sort((a, b) => b.version - a.version);
  }

  getActivePrompt(module: PromptModule, version?: number): string | undefined {
    if (version) {
      return this.promptTemplates.find((p) => p.module === module && p.version === version)?.content;
    }
    return this.promptTemplates.find((p) => p.module === module && p.published)?.content;
  }

  private createPromptAudit(
    promptTemplateId: string,
    module: PromptModule,
    action: 'CREATE' | 'PUBLISH' | 'ROLLBACK',
    operator: string,
    detail: string
  ): PromptAuditLog {
    const log: PromptAuditLog = {
      id: `audit-${randomUUID()}`,
      promptTemplateId,
      module,
      action,
      operator,
      detail,
      createdAt: new Date().toISOString()
    };
    this.promptAuditLogs.push(log);
    return log;
  }

  listPromptAuditLogs(module?: PromptModule): PromptAuditLog[] {
    return this.promptAuditLogs
      .filter((x) => (!module ? true : x.module === module))
      .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  }

  getDashboardSummary(filters?: { departmentId?: string; employeeName?: string }): DashboardSummary {
    let relatedPractices = this.practices;

    if (filters?.departmentId || filters?.employeeName) {
      const userIds = this.users
        .filter((u) => {
          if (filters.departmentId && u.departmentId !== filters.departmentId) {
            return false;
          }
          if (filters.employeeName && !u.name.includes(filters.employeeName)) {
            return false;
          }
          return true;
        })
        .map((u) => u.id);
      relatedPractices = this.practices.filter((p) => userIds.includes(p.userId));
    }

    const practiceIds = relatedPractices.map((p) => p.id);
    const recordings = this.recordings.filter((r) => practiceIds.includes(r.practiceId));

    const topicCounter = new Map<string, number>();
    for (const practice of relatedPractices) {
      topicCounter.set(practice.topic, (topicCounter.get(practice.topic) ?? 0) + 1);
    }

    return {
      totalPracticeCount: relatedPractices.length,
      activeEmployeeCount: new Set(relatedPractices.map((p) => p.userId)).size,
      avgDurationSec: recordings.length
        ? Math.round(recordings.reduce((acc, cur) => acc + cur.durationSec, 0) / recordings.length)
        : 0,
      topTopics: [...topicCounter.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([topic, count]) => ({ topic, count }))
    };
  }

  listManagerRecords(filters?: { departmentId?: string; employeeName?: string }): RecordItem[] {
    const summaries: RecordItem[] = [];

    for (const practice of this.practices) {
      const user = this.users.find((u) => u.id === practice.userId);
      if (!user) {
        continue;
      }
      if (filters?.departmentId && user.departmentId !== filters.departmentId) {
        continue;
      }
      if (filters?.employeeName && !user.name.includes(filters.employeeName)) {
        continue;
      }
      const rec = this.recordings.find((r) => r.practiceId === practice.id);
      summaries.push({
        practiceId: practice.id,
        employeeName: user.name,
        departmentName: user.departmentName,
        topic: practice.topic,
        durationSec: rec?.durationSec ?? 0,
        status: practice.status,
        createdAt: practice.createdAt
      });
    }

    return summaries.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  }

  getManagerRecordDetail(practiceId: string): ManagerRecordDetail | undefined {
    const practice = this.getPracticeById(practiceId);
    if (!practice) {
      return undefined;
    }

    const recording = this.recordings.find((r) => r.practiceId === practiceId);
    const asr = this.asrJobs.find((j) => j.practiceId === practiceId && j.status === AsrJobStatus.SUCCESS);
    const polish = this.polishRecords.find((p) => p.practiceId === practiceId);

    return {
      practice,
      recording: recording
        ? {
            recordingId: recording.id,
            objectKey: recording.objectKey,
            durationSec: recording.durationSec
          }
        : undefined,
      asrText: asr?.text,
      polishedText: polish?.polishedText,
      changes: polish?.changes
    };
  }

  createDeletionJob(entity: string, entityId: string): DeletionJob {
    const now = new Date().toISOString();
    const job: DeletionJob = {
      id: `del-${randomUUID()}`,
      entity,
      entityId,
      status: 'PENDING',
      createdAt: now,
      updatedAt: now
    };

    this.deletionJobs.push(job);
    this.runDeletion(job);
    return job;
  }

  private runDeletion(job: DeletionJob): void {
    job.status = 'RUNNING';
    job.updatedAt = new Date().toISOString();

    try {
      if (job.entity === 'practice') {
        this.deletePractice(job.entityId);
      }
      if (job.entity === 'recording') {
        this.deleteRecording(job.entityId);
      }
      if (job.entity === 'user') {
        this.deleteUser(job.entityId);
      }
      job.status = 'DONE';
      job.updatedAt = new Date().toISOString();
    } catch (_err) {
      job.status = 'FAILED';
      job.updatedAt = new Date().toISOString();
    }
  }

  deletePractice(practiceId: string): void {
    this.removeBy(this.practices, (x) => x.id === practiceId);
    this.removeBy(this.outlines, (x) => x.practiceId === practiceId);
    this.removeBy(this.recordings, (x) => x.practiceId === practiceId);
    this.removeBy(this.asrJobs, (x) => x.practiceId === practiceId);
    this.removeBy(this.polishRecords, (x) => x.practiceId === practiceId);
  }

  deleteRecording(recordingId: string): void {
    this.removeBy(this.recordings, (x) => x.id === recordingId);
    this.removeBy(this.asrJobs, (x) => x.recordingId === recordingId);
  }

  deleteUser(userId: string): void {
    const relatedPracticeIds = this.practices.filter((x) => x.userId === userId).map((x) => x.id);
    for (const id of relatedPracticeIds) {
      this.deletePractice(id);
    }
    this.removeBy(this.users, (x) => x.id === userId);
  }

  cleanupExpiredData(days = 90): number {
    const deadline = Date.now() - days * 24 * 60 * 60 * 1000;
    const expiredPracticeIds = this.practices
      .filter((p) => new Date(p.createdAt).getTime() < deadline)
      .map((p) => p.id);
    for (const id of expiredPracticeIds) {
      this.deletePractice(id);
    }
    return expiredPracticeIds.length;
  }

  private removeBy<T>(arr: T[], predicate: (item: T) => boolean): void {
    let index = arr.findIndex(predicate);
    while (index !== -1) {
      arr.splice(index, 1);
      index = arr.findIndex(predicate);
    }
  }

  buildPolishResult(sourceText: string): { polishedText: string; changes: DiffChange[] } {
    const replacements: Array<{ from: string; to: string; tag: DiffReasonTag; reason: string }> = [
      {
        from: '然后',
        to: '接下来',
        tag: DiffReasonTag.LOGIC_LINK,
        reason: '增强段落衔接，逻辑更清晰。'
      },
      {
        from: '这个',
        to: '该项',
        tag: DiffReasonTag.BUSINESS_WORDING,
        reason: '替换为更正式的商务表达。'
      },
      {
        from: '就是',
        to: '',
        tag: DiffReasonTag.REDUNDANCY_REMOVAL,
        reason: '删除口语填充词，表达更精炼。'
      },
      {
        from: '我觉得',
        to: '建议',
        tag: DiffReasonTag.VERBAL_FIX,
        reason: '弱化主观口语，提升建议的专业感。'
      }
    ];

    let polishedText = sourceText;
    const changes: DiffChange[] = [];

    for (const item of replacements) {
      let index = polishedText.indexOf(item.from);
      while (index >= 0) {
        const start = index;
        const end = index + item.from.length;

        polishedText = `${polishedText.slice(0, start)}${item.to}${polishedText.slice(end)}`;
        changes.push({
          type: item.to ? DiffType.REPLACE : DiffType.DELETE,
          originalSpan: { start, end },
          newText: item.to,
          reasonTag: item.tag,
          reason: item.reason
        });

        index = polishedText.indexOf(item.from, start + item.to.length);
      }
    }

    if (changes.length === 0) {
      changes.push({
        type: DiffType.INSERT,
        originalSpan: { start: sourceText.length, end: sourceText.length },
        newText: '建议补充结论句，突出业务价值。',
        reasonTag: DiffReasonTag.LOGIC_LINK,
        reason: '原文逻辑完整但结论不够明确。'
      });
      polishedText = `${polishedText}\n建议补充结论句，突出业务价值。`;
    }

    return { polishedText, changes };
  }
}
