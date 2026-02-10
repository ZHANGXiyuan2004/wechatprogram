import { PromptModule } from '@asrllm/shared-types';
export declare class CreatePromptTemplateDto {
    module: PromptModule;
    content: string;
    publish?: boolean;
}
export declare class RollbackPromptTemplateDto {
    module: PromptModule;
    version: number;
}
