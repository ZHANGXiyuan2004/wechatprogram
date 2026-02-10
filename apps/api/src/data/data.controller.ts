import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { Role } from '@asrllm/shared-types';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MockAuthGuard } from '../common/auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { DataService } from './data.service';

@ApiTags('data')
@Controller('data')
@UseGuards(MockAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Delete(':entity/:id')
  @ApiOperation({ summary: '发起物理删除任务' })
  deleteData(@Param('entity') entity: string, @Param('id') id: string) {
    return this.dataService.createDeleteJob(entity, id);
  }
}
