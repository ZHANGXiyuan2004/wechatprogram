<template>
  <view class="page">
    <view class="card">
      <view class="title">智能大纲生成</view>
      <view class="subtitle">输入主题后，AI自动生成结构化表达框架</view>

      <input
        class="input"
        v-model="store.topic"
        placeholder="请输入汇报/演讲主题"
      />

      <view class="field-row">
        <picker mode="selector" :range="styleOptions" @change="onStyleChange">
          <view class="picker">风格：{{ store.style }}</view>
        </picker>
        <input class="input small" v-model="store.level" placeholder="职级，如 P5" />
      </view>

      <input
        class="input"
        v-model="store.backgroundTagsText"
        placeholder="背景标签（逗号分隔）"
      />

      <button class="primary" @tap="generateOutline" :disabled="loading">
        {{ loading ? '生成中...' : '生成大纲' }}
      </button>
    </view>

    <view class="card" v-if="typedOutline">
      <view class="title">流式结果</view>
      <text class="outline-text">{{ typedOutline }}</text>
      <button class="primary" @tap="goRecord">进入语音演练</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { miniApi } from '../../api/client';
import { usePracticeStore } from '../../stores/practice';

const styleOptions = ['STRUCTURED', 'STORY', 'EXEC_SUMMARY'];
const store = usePracticeStore();
const loading = ref(false);
const typedOutline = ref('');

onMounted(() => {
  store.restore();
  typedOutline.value = store.outline;
});

function onStyleChange(event: any) {
  const idx = Number(event.detail.value || 0);
  store.style = styleOptions[idx] as any;
  store.save();
}

async function generateOutline() {
  if (!store.topic.trim()) {
    uni.showToast({ title: '请先输入主题', icon: 'none' });
    return;
  }

  loading.value = true;
  try {
    if (!store.practiceId) {
      const practice = await miniApi.createPractice(store.topic);
      store.practiceId = practice.id;
    }

    const backgroundTags = store.backgroundTagsText
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean);

    const result = await miniApi.generateOutline(store.practiceId!, {
      style: store.style,
      level: store.level,
      backgroundTags
    });

    typedOutline.value = '';
    const full = result.content || '';
    let i = 0;
    const timer = setInterval(() => {
      typedOutline.value += full[i] || '';
      i += 1;
      if (i >= full.length) {
        clearInterval(timer);
        store.outline = full;
        store.save();
      }
    }, 20);
  } catch (err) {
    uni.showToast({ title: '生成失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
}

function goRecord() {
  if (!store.practiceId) {
    uni.showToast({ title: '请先生成大纲', icon: 'none' });
    return;
  }
  uni.navigateTo({ url: '/pages/record/index' });
}
</script>

<style scoped>
.page {
  padding: 24rpx;
}

.input {
  width: 100%;
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 14rpx;
  padding: 14rpx;
  margin-bottom: 12rpx;
  font-size: 28rpx;
}

.input.small {
  width: 220rpx;
}

.field-row {
  display: flex;
  gap: 12rpx;
  align-items: center;
}

.picker {
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 14rpx;
  padding: 14rpx;
  width: 280rpx;
  font-size: 26rpx;
}

.primary {
  width: 100%;
  border: none;
  border-radius: 14rpx;
  background: linear-gradient(120deg, #0ea5e9, #10b981);
  color: #fff;
  padding: 14rpx;
  font-size: 28rpx;
}

.outline-text {
  display: block;
  white-space: pre-wrap;
  line-height: 1.7;
  font-size: 26rpx;
  margin-bottom: 14rpx;
}
</style>
