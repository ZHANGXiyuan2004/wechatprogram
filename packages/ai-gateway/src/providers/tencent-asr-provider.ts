import { AsrSegment, AsrTranscribeInput, AsrTranscribeOutput } from '@asrllm/shared-types';
import { AsrProvider } from '../types.js';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class TencentAsrProvider implements AsrProvider {
  async transcribe(input: AsrTranscribeInput): Promise<AsrTranscribeOutput> {
    const started = Date.now();
    await sleep(320);

    const segments: AsrSegment[] = [
      { startMs: 0, endMs: 8000, text: '各位同事大家好，今天我汇报本周项目推进情况。' },
      { startMs: 8000, endMs: 17000, text: '目前需求澄清已完成，开发进度达到百分之六十。' },
      { startMs: 17000, endMs: 26000, text: '主要风险是联调时间紧张，建议提前锁定测试资源。' }
    ];

    return {
      text: segments.map((s) => s.text).join(''),
      segments,
      latencyMs: Date.now() - started
    };
  }
}
