import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Sse,
  UseGuards
} from '@nestjs/common';
import { Role } from '@asrllm/shared-types';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { MockAuthGuard } from '../common/auth.guard';
import { CurrentUser } from '../common/user.decorator';
import { RequestUser } from '../common/request-user';
import { PracticeService } from './practice.service';
import {
  CreateAsrJobDto,
  CreatePracticeDto,
  GenerateOutlineDto,
  PolishDto,
  PresignRecordingDto
} from './practice.dto';

@ApiTags('practice')
@UseGuards(MockAuthGuard)
@Controller('practices')
export class PracticeController {
  constructor(private readonly service: PracticeService) {}

  @Post()
  @ApiOperation({ summary: '创建练习草稿' })
  createPractice(@CurrentUser() user: RequestUser, @Body() body: CreatePracticeDto) {
    return this.service.createPractice(user.id, body.topic);
  }

  @Post(':id/outline/generate')
  @ApiOperation({ summary: '触发大纲生成' })
  generateOutline(@Param('id') id: string, @Body() body: GenerateOutlineDto) {
    return this.service.generateOutline(id, body);
  }

  @Sse(':id/outline/stream')
  @ApiOperation({ summary: 'SSE流式返回大纲内容' })
  streamOutline(@Param('id') id: string): Observable<{ data: unknown }> {
    const generator = this.service.streamOutline(id);

    return new Observable((subscriber) => {
      (async () => {
        try {
          for await (const chunk of generator) {
            subscriber.next({ data: { chunk } });
          }
          subscriber.next({ data: { done: true } });
          subscriber.complete();
        } catch (error) {
          subscriber.error(error);
        }
      })();
    });
  }

  @Post(':id/recordings/presign')
  @ApiOperation({ summary: '获取录音上传签名' })
  createRecordingPresign(@Param('id') id: string, @Body() body: PresignRecordingDto) {
    return this.service.createRecordingPresign(id, body);
  }

  @Post(':id/asr/jobs')
  @ApiOperation({ summary: '发起ASR任务' })
  createAsrJob(@Param('id') id: string, @Body() body: CreateAsrJobDto) {
    return this.service.createAsrJob(id, body.recordingId);
  }

  @Get(':id/asr/jobs/:jobId')
  @ApiOperation({ summary: '查询ASR任务状态' })
  getAsrJob(@Param('id') id: string, @Param('jobId') jobId: string) {
    return this.service.getAsrJob(id, jobId);
  }

  @Post(':id/polish')
  @ApiOperation({ summary: '生成表达优化与Diff' })
  polish(@Param('id') id: string, @Body() body: PolishDto) {
    return this.service.polish(id, body.sourceText);
  }
}
