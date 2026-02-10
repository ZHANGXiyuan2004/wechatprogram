import { OutlineStyle, PromptModule } from '@asrllm/shared-types';
export declare class CreatePracticeDto {
    topic: string;
}
export declare class GenerateOutlineDto {
    style: OutlineStyle;
    level?: string;
    backgroundTags?: string[];
}
export declare class PresignRecordingDto {
    fileName: string;
    contentType: string;
    durationSec: number;
}
export declare class CreateAsrJobDto {
    recordingId: string;
}
export declare class PolishDto {
    sourceText: string;
}
export declare class RollbackPromptDto {
    module: PromptModule;
    version: number;
}
