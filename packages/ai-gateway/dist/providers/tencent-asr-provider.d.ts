import { AsrTranscribeInput, AsrTranscribeOutput } from '@asrllm/shared-types';
import { AsrProvider } from '../types.js';
export declare class TencentAsrProvider implements AsrProvider {
    transcribe(input: AsrTranscribeInput): Promise<AsrTranscribeOutput>;
}
