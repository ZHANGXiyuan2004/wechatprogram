import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { PromptModule, Role } from '@asrllm/shared-types';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MockAuthGuard } from '../common/auth.guard';
import { CurrentUser } from '../common/user.decorator';
import { RequestUser } from '../common/request-user';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { CreatePromptTemplateDto, RollbackPromptTemplateDto } from './admin.dto';
import { AdminService } from './admin.service';

@ApiTags('admin')
@Controller('admin')
@UseGuards(MockAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('prompts')
  @ApiOperation({ summary: '查询Prompt模板列表' })
  listPrompts(@Query('module') module?: PromptModule) {
    return {
      templates: this.adminService.listPrompts(module),
      auditLogs: this.adminService.listPromptAuditLogs(module)
    };
  }

  @Post('prompts')
  @ApiOperation({ summary: '创建Prompt模板版本' })
  createPrompt(
    @CurrentUser() user: RequestUser,
    @Body() body: CreatePromptTemplateDto
  ) {
    return this.adminService.createPrompt(body.module, body.content, user.name, body.publish);
  }

  @Post('prompts/:id/publish')
  @ApiOperation({ summary: '发布Prompt版本' })
  publishPrompt(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.adminService.publishPrompt(id, user.name);
  }

  @Post('prompts/rollback')
  @ApiOperation({ summary: '按模块版本回滚Prompt' })
  rollbackPrompt(@CurrentUser() user: RequestUser, @Body() body: RollbackPromptTemplateDto) {
    return this.adminService.rollbackPrompt(body.module, body.version, user.name);
  }

  @Post('prompts/:id/rollback')
  @ApiOperation({ summary: '兼容路径：按模块版本回滚Prompt' })
  rollbackPromptCompat(@CurrentUser() user: RequestUser, @Body() body: RollbackPromptTemplateDto) {
    return this.adminService.rollbackPrompt(body.module, body.version, user.name);
  }
}
