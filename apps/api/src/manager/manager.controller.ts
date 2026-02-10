import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseGuards
} from '@nestjs/common';
import { Role } from '@asrllm/shared-types';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MockAuthGuard } from '../common/auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { ManagerService } from './manager.service';

@ApiTags('manager')
@Controller('manager')
@UseGuards(MockAuthGuard, RolesGuard)
@Roles(Role.MANAGER, Role.ADMIN)
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Get('dashboard')
  @ApiOperation({ summary: '管理看板统计' })
  dashboard(
    @Query('departmentId') departmentId?: string,
    @Query('employeeName') employeeName?: string
  ) {
    return this.managerService.getDashboard({ departmentId, employeeName });
  }

  @Get('records')
  @ApiOperation({ summary: '练习记录列表检索' })
  records(
    @Query('departmentId') departmentId?: string,
    @Query('employeeName') employeeName?: string
  ) {
    return this.managerService.getRecords({ departmentId, employeeName });
  }

  @Get('records/:recordId')
  @ApiOperation({ summary: '练习记录详情' })
  recordDetail(@Param('recordId') recordId: string) {
    const detail = this.managerService.getRecordDetail(recordId);
    if (!detail) {
      throw new NotFoundException('Record not found');
    }
    return detail;
  }
}
