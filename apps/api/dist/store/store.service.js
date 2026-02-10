"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryStoreService = void 0;
const shared_types_1 = require("@asrllm/shared-types");
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let InMemoryStoreService = class InMemoryStoreService {
    constructor() {
        this.departments = [
            { id: 'dep-001', name: '产品研发部' },
            { id: 'dep-002', name: '市场运营部' }
        ];
        this.users = [
            {
                id: 'u-emp-001',
                name: '演示员工',
                departmentId: 'dep-001',
                departmentName: '产品研发部',
                title: '产品经理',
                level: 'P5',
                tags: ['toB', 'SaaS'],
                role: shared_types_1.Role.EMPLOYEE
            },
            {
                id: 'u-mgr-001',
                name: '演示主管',
                departmentId: 'dep-001',
                departmentName: '产品研发部',
                title: '部门主管',
                level: 'M1',
                tags: ['管理'],
                role: shared_types_1.Role.MANAGER
            },
            {
                id: 'u-admin-001',
                name: '系统管理员',
                departmentId: 'dep-001',
                departmentName: '产品研发部',
                title: '平台管理员',
                level: 'A1',
                tags: ['admin'],
                role: shared_types_1.Role.ADMIN
            }
        ];
        this.practices = [];
        this.outlines = [];
        this.recordings = [];
        this.asrJobs = [];
        this.polishRecords = [];
        this.promptTemplates = [];
        this.promptAuditLogs = [];
        this.deletionJobs = [];
        this.seedPrompts();
    }
    seedPrompts() {
        const templates = [
            {
                module: shared_types_1.PromptModule.OUTLINE,
                content: '你是企业内部演讲教练。请基于主题{{topic}}，按{{style}}风格输出结构化大纲。用户级别：{{level}}，背景：{{backgroundTags}}。'
            },
            {
                module: shared_types_1.PromptModule.POLISH,
                content: '请优化以下口语表达，保持原意并提升商务表达。原文：{{sourceText}}，输出优化文本并给出修改理由。'
            },
            {
                module: shared_types_1.PromptModule.COACH,
                content: '你是管理者辅导助手，请基于记录输出一份一对一面谈建议。'
            },
            {
                module: shared_types_1.PromptModule.TEAM_INSIGHT,
                content: '你是团队分析助手，请总结多名员工表达中的共性问题。'
            }
        ];
        for (const item of templates) {
            this.createPromptTemplate(item.module, item.content, 'system-seed', true);
        }
    }
    createPractice(userId, topic) {
        const now = new Date().toISOString();
        const practice = {
            id: `prac-${(0, crypto_1.randomUUID)()}`,
            userId,
            topic,
            status: shared_types_1.PracticeStatus.DRAFT,
            createdAt: now,
            updatedAt: now
        };
        this.practices.push(practice);
        return practice;
    }
    getPracticeById(id) {
        return this.practices.find((p) => p.id === id);
    }
    updatePracticeStatus(id, status) {
        const practice = this.getPracticeById(id);
        if (!practice) {
            return undefined;
        }
        practice.status = status;
        practice.updatedAt = new Date().toISOString();
        return practice;
    }
    createOutline(practiceId, style, content, tokenUsage, latencyMs) {
        const record = {
            id: `outline-${(0, crypto_1.randomUUID)()}`,
            practiceId,
            style,
            content,
            promptTokens: tokenUsage.promptTokens,
            completionTokens: tokenUsage.completionTokens,
            latencyMs,
            createdAt: new Date().toISOString()
        };
        this.outlines.push(record);
        this.updatePracticeStatus(practiceId, shared_types_1.PracticeStatus.OUTLINE_DONE);
        return record;
    }
    getOutlineByPracticeId(practiceId) {
        return this.outlines.find((o) => o.practiceId === practiceId);
    }
    createRecording(practiceId, durationSec, contentType, fileName) {
        const id = `rec-${(0, crypto_1.randomUUID)()}`;
        const objectKey = `recordings/${practiceId}/${id}-${fileName}`;
        const recording = {
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
        this.updatePracticeStatus(practiceId, shared_types_1.PracticeStatus.RECORDING_DONE);
        return recording;
    }
    getRecordingById(id) {
        return this.recordings.find((r) => r.id === id);
    }
    markRecordingUploaded(id) {
        const rec = this.getRecordingById(id);
        if (rec) {
            rec.uploadStatus = 'UPLOADED';
        }
    }
    createAsrJob(practiceId, recordingId) {
        const now = new Date().toISOString();
        const job = {
            id: `asr-${(0, crypto_1.randomUUID)()}`,
            practiceId,
            recordingId,
            status: shared_types_1.AsrJobStatus.PENDING,
            createdAt: now,
            updatedAt: now
        };
        this.asrJobs.push(job);
        return job;
    }
    updateAsrJob(jobId, patch) {
        const job = this.asrJobs.find((j) => j.id === jobId);
        if (!job) {
            return undefined;
        }
        Object.assign(job, patch, { updatedAt: new Date().toISOString() });
        if (job.status === shared_types_1.AsrJobStatus.SUCCESS) {
            this.updatePracticeStatus(job.practiceId, shared_types_1.PracticeStatus.ASR_DONE);
        }
        return job;
    }
    getAsrJobById(jobId) {
        return this.asrJobs.find((j) => j.id === jobId);
    }
    getAsrJobByPracticeId(practiceId) {
        return this.asrJobs.find((j) => j.practiceId === practiceId);
    }
    createPolish(practiceId, sourceText, polishedText, changes) {
        const record = {
            id: `pol-${(0, crypto_1.randomUUID)()}`,
            practiceId,
            sourceText,
            polishedText,
            changes,
            score: Math.min(100, 70 + changes.length * 5),
            createdAt: new Date().toISOString()
        };
        this.polishRecords.push(record);
        this.updatePracticeStatus(practiceId, shared_types_1.PracticeStatus.POLISH_DONE);
        return record;
    }
    getPolishByPracticeId(practiceId) {
        return this.polishRecords.find((p) => p.practiceId === practiceId);
    }
    createPromptTemplate(module, content, createdBy, publish = false) {
        const maxVersion = this.promptTemplates
            .filter((p) => p.module === module)
            .reduce((acc, cur) => Math.max(acc, cur.version), 0);
        const template = {
            id: `prompt-${(0, crypto_1.randomUUID)()}`,
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
    publishPromptTemplate(id, operator) {
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
    rollbackPromptTemplate(module, version, operator) {
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
    listPrompts(module) {
        return this.promptTemplates
            .filter((p) => (!module ? true : p.module === module))
            .sort((a, b) => b.version - a.version);
    }
    getActivePrompt(module, version) {
        if (version) {
            return this.promptTemplates.find((p) => p.module === module && p.version === version)?.content;
        }
        return this.promptTemplates.find((p) => p.module === module && p.published)?.content;
    }
    createPromptAudit(promptTemplateId, module, action, operator, detail) {
        const log = {
            id: `audit-${(0, crypto_1.randomUUID)()}`,
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
    listPromptAuditLogs(module) {
        return this.promptAuditLogs
            .filter((x) => (!module ? true : x.module === module))
            .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
    }
    getDashboardSummary(filters) {
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
        const topicCounter = new Map();
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
    listManagerRecords(filters) {
        const summaries = [];
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
    getManagerRecordDetail(practiceId) {
        const practice = this.getPracticeById(practiceId);
        if (!practice) {
            return undefined;
        }
        const recording = this.recordings.find((r) => r.practiceId === practiceId);
        const asr = this.asrJobs.find((j) => j.practiceId === practiceId && j.status === shared_types_1.AsrJobStatus.SUCCESS);
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
    createDeletionJob(entity, entityId) {
        const now = new Date().toISOString();
        const job = {
            id: `del-${(0, crypto_1.randomUUID)()}`,
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
    runDeletion(job) {
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
        }
        catch (_err) {
            job.status = 'FAILED';
            job.updatedAt = new Date().toISOString();
        }
    }
    deletePractice(practiceId) {
        this.removeBy(this.practices, (x) => x.id === practiceId);
        this.removeBy(this.outlines, (x) => x.practiceId === practiceId);
        this.removeBy(this.recordings, (x) => x.practiceId === practiceId);
        this.removeBy(this.asrJobs, (x) => x.practiceId === practiceId);
        this.removeBy(this.polishRecords, (x) => x.practiceId === practiceId);
    }
    deleteRecording(recordingId) {
        this.removeBy(this.recordings, (x) => x.id === recordingId);
        this.removeBy(this.asrJobs, (x) => x.recordingId === recordingId);
    }
    deleteUser(userId) {
        const relatedPracticeIds = this.practices.filter((x) => x.userId === userId).map((x) => x.id);
        for (const id of relatedPracticeIds) {
            this.deletePractice(id);
        }
        this.removeBy(this.users, (x) => x.id === userId);
    }
    cleanupExpiredData(days = 90) {
        const deadline = Date.now() - days * 24 * 60 * 60 * 1000;
        const expiredPracticeIds = this.practices
            .filter((p) => new Date(p.createdAt).getTime() < deadline)
            .map((p) => p.id);
        for (const id of expiredPracticeIds) {
            this.deletePractice(id);
        }
        return expiredPracticeIds.length;
    }
    removeBy(arr, predicate) {
        let index = arr.findIndex(predicate);
        while (index !== -1) {
            arr.splice(index, 1);
            index = arr.findIndex(predicate);
        }
    }
    buildPolishResult(sourceText) {
        const replacements = [
            {
                from: '然后',
                to: '接下来',
                tag: shared_types_1.DiffReasonTag.LOGIC_LINK,
                reason: '增强段落衔接，逻辑更清晰。'
            },
            {
                from: '这个',
                to: '该项',
                tag: shared_types_1.DiffReasonTag.BUSINESS_WORDING,
                reason: '替换为更正式的商务表达。'
            },
            {
                from: '就是',
                to: '',
                tag: shared_types_1.DiffReasonTag.REDUNDANCY_REMOVAL,
                reason: '删除口语填充词，表达更精炼。'
            },
            {
                from: '我觉得',
                to: '建议',
                tag: shared_types_1.DiffReasonTag.VERBAL_FIX,
                reason: '弱化主观口语，提升建议的专业感。'
            }
        ];
        let polishedText = sourceText;
        const changes = [];
        for (const item of replacements) {
            let index = polishedText.indexOf(item.from);
            while (index >= 0) {
                const start = index;
                const end = index + item.from.length;
                polishedText = `${polishedText.slice(0, start)}${item.to}${polishedText.slice(end)}`;
                changes.push({
                    type: item.to ? shared_types_1.DiffType.REPLACE : shared_types_1.DiffType.DELETE,
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
                type: shared_types_1.DiffType.INSERT,
                originalSpan: { start: sourceText.length, end: sourceText.length },
                newText: '建议补充结论句，突出业务价值。',
                reasonTag: shared_types_1.DiffReasonTag.LOGIC_LINK,
                reason: '原文逻辑完整但结论不够明确。'
            });
            polishedText = `${polishedText}\n建议补充结论句，突出业务价值。`;
        }
        return { polishedText, changes };
    }
};
exports.InMemoryStoreService = InMemoryStoreService;
exports.InMemoryStoreService = InMemoryStoreService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], InMemoryStoreService);
//# sourceMappingURL=store.service.js.map