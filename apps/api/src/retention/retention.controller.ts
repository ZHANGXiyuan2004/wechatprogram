import { Controller, Post, Query, UseGuards } from '@nestjs/common';
import { Role } from '@asrllm/shared-types';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MockAuthGuard } from '../common/auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { RetentionService } from './retention.service';

@ApiTags('retention')
@Controller('admin/retention')
@UseGuards(MockAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class RetentionController {
  constructor(private readonly retentionService: RetentionService) {}

  @Post('cleanup')
  @ApiOperation({ summary: '执行90天数据留存清理任务' })
  cleanup(@Query('days') days?: string) {
    const dayNum = Number(days || '90');
    return this.retentionService.cleanup(Number.isFinite(dayNum) ? dayNum : 90);
  }
}
