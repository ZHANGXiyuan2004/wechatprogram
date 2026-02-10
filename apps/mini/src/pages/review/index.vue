<template>
  <view class="page">
    <DiffBlock
      :source-text="store.asrText"
      :polished-text="store.polishedText"
      :changes="store.changes"
    />

    <view class="card">
      <view class="btn-row">
        <button class="action" @tap="runPolish" :disabled="loading">
          {{ loading ? '分析中...' : '生成智能复盘' }}
        </button>
        <button class="action secondary" @tap="newPractice">新建练习</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import DiffBlock from '../../components/DiffBlock.vue';
import { miniApi } from '../../api/client';
import { usePracticeStore } from '../../stores/practice';

const loading = ref(false);
const store = usePracticeStore();

onMounted(() => {
  store.restore();
});

async function runPolish() {
  if (!store.practiceId || !store.asrText) {
    uni.showToast({ title: '缺少转写文本', icon: 'none' });
    return;
  }

  loading.value = true;
  try {
    const result = await miniApi.polish(store.practiceId, store.asrText);
    store.polishedText = result.polishedText;
    store.changes = result.changes || [];
    store.save();
  } catch (err) {
    uni.showToast({ title: '复盘失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
}

function newPractice() {
  store.reset();
  uni.reLaunch({ url: '/pages/index/index' });
}
</script>

<style scoped>
.page {
  padding: 24rpx;
}

.action {
  flex: 1;
  border: none;
  border-radius: 14rpx;
  background: linear-gradient(120deg, #0ea5e9, #10b981);
  color: #fff;
  padding: 12rpx;
}

.secondary {
  background: #e2e8f0;
  color: #0f172a;
}
</style>
