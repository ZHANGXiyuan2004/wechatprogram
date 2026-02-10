import { PromptModule } from '@asrllm/shared-types';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreatePromptTemplateDto {
  @IsEnum(PromptModule)
  module!: PromptModule;

  @IsString()
  content!: string;

  @IsOptional()
  publish?: boolean;
}

export class RollbackPromptTemplateDto {
  @IsEnum(PromptModule)
  module!: PromptModule;

  @IsInt()
  @Min(1)
  version!: number;
}
