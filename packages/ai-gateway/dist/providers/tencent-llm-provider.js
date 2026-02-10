function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
export class TencentLlmProvider {
    async generate(input) {
        const started = Date.now();
        await sleep(180);
        const text = `【${input.module}】\n${input.prompt}\n\n优化建议：\n1. 先给结论，再给依据。\n2. 控制每段一句核心信息。\n3. 用可量化结果收尾。`;
        return {
            text,
            latencyMs: Date.now() - started,
            tokenUsage: {
                promptTokens: Math.ceil(input.prompt.length / 2),
                completionTokens: Math.ceil(text.length / 2)
            }
        };
    }
    async *stream(input) {
        const full = `一、背景\n- 说明目标与现状\n二、核心进展\n- 用三点结构呈现\n三、风险与对策\n- 明确风险等级与负责人\n四、下一步\n- 给出时间节点与资源需求\n\n主题：${input.prompt}`;
        const chunks = full.match(/.{1,14}/g) || [full];
        for (const chunk of chunks) {
            await sleep(45);
            yield chunk;
        }
    }
}
