import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

class WecomLoginDto {
  code!: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('wecom/login')
  @ApiOperation({ summary: '企业微信登录换Token' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { code: { type: 'string' } },
      required: ['code']
    }
  })
  login(@Body() body: WecomLoginDto) {
    return this.authService.wecomLogin(body.code || 'employee');
  }
}
