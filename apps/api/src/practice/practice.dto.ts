import { OutlineStyle, PromptModule } from '@asrllm/shared-types';
import { IsArray, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreatePracticeDto {
  @IsString()
  topic!: string;
}

export class GenerateOutlineDto {
  @IsEnum(OutlineStyle)
  style!: OutlineStyle;

  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  backgroundTags?: string[];
}

export class PresignRecordingDto {
  @IsString()
  fileName!: string;

  @IsString()
  contentType!: string;

  @IsInt()
  @Min(1)
  @Max(300)
  durationSec!: number;
}

export class CreateAsrJobDto {
  @IsString()
  recordingId!: string;
}

export class PolishDto {
  @IsString()
  sourceText!: string;
}

export class RollbackPromptDto {
  @IsEnum(PromptModule)
  module!: PromptModule;

  @IsInt()
  @Min(1)
  version!: number;
}
