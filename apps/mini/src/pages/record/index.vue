<template>
  <view class="page">
    <view class="card">
      <view class="title">语音演练与转写</view>
      <view class="subtitle">1-5分钟，支持暂停与继续</view>

      <view class="wave-placeholder">
        <view class="bar" v-for="n in 24" :key="n" :style="barStyle(n)"></view>
      </view>

      <view class="btn-row">
        <button class="btn start" @tap="startRecord" :disabled="recording">开始</button>
        <button class="btn pause" @tap="pauseRecord" :disabled="!recording || paused">暂停</button>
        <button class="btn resume" @tap="resumeRecord" :disabled="!paused">继续</button>
        <button class="btn stop" @tap="stopRecord" :disabled="!recording">结束</button>
      </view>

      <view class="meta">录制时长：{{ durationSec }} 秒</view>
      <view class="meta">状态：{{ statusText }}</view>
    </view>

    <view class="card" v-if="asrText">
      <view class="title">ASR转写结果</view>
      <text class="asr-text">{{ asrText }}</text>
      <button class="btn review" @tap="goReview">生成复盘优化</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { miniApi } from '../../api/client';
import { usePracticeStore } from '../../stores/practice';

const store = usePracticeStore();
const recorderManager = uni.getRecorderManager();

const recording = ref(false);
const paused = ref(false);
const durationSec = ref(0);
const statusText = ref('未开始');
const asrText = ref('');

let startedAt = 0;
let elapsedBeforePause = 0;
let timer: number | undefined;
let lastTempPath = '';

onMounted(() => {
  store.restore();
  asrText.value = store.asrText;

  recorderManager.onStop((res) => {
    lastTempPath = res.tempFilePath;
    clearTimer();
    statusText.value = '录制已结束，转写中';
    recording.value = false;
    paused.value = false;
    runAsr();
  });

  recorderManager.onError(() => {
    clearTimer();
    statusText.value = '录音失败';
    recording.value = false;
  });
}

function barStyle(n: number) {
  const h = (Math.sin((Date.now() / 220 + n) % Math.PI) + 1.2) * 14;
  return `height:${h}rpx`;
}

function startTimer() {
  timer = setInterval(() => {
    const current = Math.floor((Date.now() - startedAt) / 1000) + elapsedBeforePause;
    durationSec.value = current;
  }, 200) as unknown as number;
}

function clearTimer() {
  if (timer) clearInterval(timer);
  timer = undefined;
}

function startRecord() {
  if (!store.practiceId) {
    uni.showToast({ title: '请先生成大纲', icon: 'none' });
    return;
  }

  recorderManager.start({
    duration: 300000,
    sampleRate: 16000,
    numberOfChannels: 1,
    encodeBitRate: 96000,
    format: 'mp3'
  });

  startedAt = Date.now();
  elapsedBeforePause = 0;
  durationSec.value = 0;
  recording.value = true;
  paused.value = false;
  statusText.value = '录音中';
  startTimer();
}

function pauseRecord() {
  recorderManager.pause();
  paused.value = true;
  recording.value = true;
  elapsedBeforePause = durationSec.value;
  clearTimer();
  statusText.value = '已暂停';
}

function resumeRecord() {
  recorderManager.resume();
  paused.value = false;
  recording.value = true;
  startedAt = Date.now();
  statusText.value = '继续录音中';
  startTimer();
}

function stopRecord() {
  recorderManager.stop();
}

async function runAsr() {
  try {
    const fileName = `speech-${Date.now()}.mp3`;
    const presign = await miniApi.createRecordingPresign(store.practiceId!, {
      fileName,
      contentType: 'audio/mpeg',
      durationSec: Math.max(1, durationSec.value)
    });

    // MVP联调阶段：后端会以录音ID模拟上传完成并直接转写。
    if (!lastTempPath) {
      console.log('temp file path missing, fallback to dry-run mode');
    }

    const asrJob = await miniApi.createAsrJob(store.practiceId!, presign.recordingId);
    asrText.value = asrJob.text || '';
    statusText.value = asrJob.status;

    store.asrText = asrText.value;
    store.save();
  } catch (err) {
    statusText.value = 'ASR失败';
    uni.showToast({ title: '转写失败', icon: 'none' });
  }
}

function goReview() {
  if (!asrText.value) {
    uni.showToast({ title: '暂无转写文本', icon: 'none' });
    return;
  }
  uni.navigateTo({ url: '/pages/review/index' });
}
</script>

<style scoped>
.page {
  padding: 24rpx;
}

.wave-placeholder {
  display: flex;
  align-items: flex-end;
  gap: 6rpx;
  height: 80rpx;
  margin: 12rpx 0 16rpx;
}

.bar {
  width: 12rpx;
  background: linear-gradient(180deg, #10b981, #0ea5e9);
  border-radius: 8rpx;
  animation: pulse 1.6s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
}

.btn {
  border: none;
  border-radius: 12rpx;
  font-size: 24rpx;
  padding: 10rpx 18rpx;
}

.start {
  background: #0ea5e9;
  color: #fff;
}

.pause {
  background: #f59e0b;
  color: #fff;
}

.resume {
  background: #14b8a6;
  color: #fff;
}

.stop {
  background: #ef4444;
  color: #fff;
}

.review {
  background: linear-gradient(120deg, #0ea5e9, #f97316);
  color: #fff;
}

.meta {
  margin-top: 8rpx;
  color: #475569;
  font-size: 24rpx;
}

.asr-text {
  display: block;
  white-space: pre-wrap;
  line-height: 1.7;
  margin-bottom: 12rpx;
}
</style>
