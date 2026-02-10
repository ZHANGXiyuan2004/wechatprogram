<template>
  <view class="card">
    <view class="title">表达优化对照</view>
    <view class="subtitle">点击修改项可查看理由</view>

    <view class="compare-grid">
      <view>
        <view class="label">原文</view>
        <text class="text-body">{{ sourceText }}</text>
      </view>
      <view>
        <view class="label">优化后</view>
        <text class="text-body">{{ polishedText }}</text>
      </view>
    </view>

    <view class="change-list">
      <view
        v-for="(item, idx) in changes"
        :key="idx"
        class="change-item"
        @tap="select(item)"
      >
        <text class="badge">{{ item.reasonTag }}</text>
        <text class="change-text">{{ item.type }} -> {{ item.newText || '删除' }}</text>
      </view>
    </view>

    <view v-if="activeReason" class="reason-bubble">
      {{ activeReason }}
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface ChangeItem {
  reasonTag: string;
  reason: string;
  newText: string;
  type: string;
}

defineProps<{
  sourceText: string;
  polishedText: string;
  changes: ChangeItem[];
}>();

const activeReason = ref('');

function select(item: ChangeItem) {
  activeReason.value = item.reason;
}
</script>

<style scoped>
.compare-grid {
  display: grid;
  gap: 12rpx;
}

.label {
  color: #64748b;
  margin-bottom: 8rpx;
}

.text-body {
  display: block;
  white-space: pre-wrap;
  background: #f8fafc;
  border-radius: 12rpx;
  padding: 12rpx;
}

.change-list {
  margin-top: 14rpx;
  display: grid;
  gap: 10rpx;
}

.change-item {
  border: 1px solid rgba(14, 165, 233, 0.25);
  border-radius: 12rpx;
  padding: 10rpx;
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.change-text {
  font-size: 24rpx;
  color: #0f172a;
}

.reason-bubble {
  margin-top: 12rpx;
  background: rgba(249, 115, 22, 0.12);
  border: 1px solid rgba(249, 115, 22, 0.25);
  padding: 12rpx;
  border-radius: 12rpx;
  color: #9a3412;
}
</style>
