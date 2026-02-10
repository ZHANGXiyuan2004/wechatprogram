import {
  AsrJobStatus,
  GenerateOutlineRequest,
  OutlineGenerateResponse,
  PolishResponse
} from '@asrllm/shared-types';
import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { AIService } from '../ai/ai.service';
import { InMemoryStoreService } from '../store/store.service';

@Injectable()
export class PracticeService {
  constructor(
    private readonly store: InMemoryStoreService,
    private readonly ai: AIService
  ) {}

  createPractice(userId: string, topic: string) {
    return this.store.createPractice(userId, topic);
  }

  async generateOutline(practiceId: string, payload: GenerateOutlineRequest): Promise<OutlineGenerateResponse> {
    const practice = this.store.getPracticeById(practiceId);
    if (!practice) {
      throw new NotFoundException('Practice not found');
    }

    const llm = await this.ai.generateOutline({
      topic: practice.topic,
      style: payload.style,
      level: payload.level,
      backgroundTags: payload.backgroundTags,
      idempotencyKey: `outline-${practiceId}-${payload.style}`
    });

    const record = this.store.createOutline(
      practiceId,
      payload.style,
      llm.text,
      llm.tokenUsage || { promptTokens: 0, completionTokens: 0 },
      llm.latencyMs
    );

    return {
      outlineId: record.id,
      practiceId,
      style: payload.style,
      content: llm.text,
      latencyMs: llm.latencyMs
    };
  }

  streamOutline(practiceId: string) {
    const practice = this.store.getPracticeById(practiceId);
    if (!practice) {
      throw new NotFoundException('Practice not found');
    }

    const outline = this.store.getOutlineByPracticeId(practiceId);
    if (!outline) {
      throw new BadRequestException('Outline not generated yet, call /outline/generate first');
    }

    return this.ai.streamOutline({
      topic: practice.topic,
      style: outline.style,
      idempotencyKey: `stream-${practiceId}-${outline.style}`
    });
  }

  createRecordingPresign(practiceId: string, input: { fileName: string; contentType: string; durationSec: number }) {
    const practice = this.store.getPracticeById(practiceId);
    if (!practice) {
      throw new NotFoundException('Practice not found');
    }

    const rec = this.store.createRecording(practiceId, input.durationSec, input.contentType, input.fileName);
    return {
      recordingId: rec.id,
      uploadUrl: rec.uploadUrl,
      objectKey: rec.objectKey
    };
  }

  async createAsrJob(practiceId: string, recordingId: string) {
    const practice = this.store.getPracticeById(practiceId);
    if (!practice) {
      throw new NotFoundException('Practice not found');
    }

    const recording = this.store.getRecordingById(recordingId);
    if (!recording) {
      throw new NotFoundException('Recording not found');
    }

    this.store.markRecordingUploaded(recordingId);

    const job = this.store.createAsrJob(practiceId, recordingId);
    this.store.updateAsrJob(job.id, { status: AsrJobStatus.RUNNING });

    try {
      const result = await this.ai.transcribe(recording.objectKey, `asr-${recordingId}`);
      this.store.updateAsrJob(job.id, {
        status: AsrJobStatus.SUCCESS,
        text: result.text,
        segments: result.segments
      });
    } catch (error) {
      this.store.updateAsrJob(job.id, {
        status: AsrJobStatus.FAILED,
        errorMessage: (error as Error).message
      });
    }

    return this.store.getAsrJobById(job.id)!;
  }

  getAsrJob(practiceId: string, jobId: string) {
    const job = this.store.getAsrJobById(jobId);
    if (!job || job.practiceId !== practiceId) {
      throw new NotFoundException('ASR job not found');
    }
    return job;
  }

  async polish(practiceId: string, sourceText: string): Promise<PolishResponse> {
    const practice = this.store.getPracticeById(practiceId);
    if (!practice) {
      throw new NotFoundException('Practice not found');
    }

    // Keep provider invocation for consistent token accounting and future provider switching.
    await this.ai.polish(sourceText, `polish-${practiceId}`);

    const { polishedText, changes } = this.store.buildPolishResult(sourceText);
    this.store.createPolish(practiceId, sourceText, polishedText, changes);

    return {
      sourceText,
      polishedText,
      changes
    };
  }
}
