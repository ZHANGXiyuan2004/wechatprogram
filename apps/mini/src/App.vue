<template>
  <view class="app-root">
    <view class="preview-card">
      <view class="preview-title">小程序预览已启动</view>
      <view class="preview-desc">这是本地联调入口页。需要在微信开发者工具调试时，请先双击 04 脚本生成包。</view>

      <view class="preview-actions">
        <button class="preview-btn" @tap="openPage('http://127.0.0.1:5174')">打开管理后台</button>
        <button class="preview-btn secondary" @tap="openPage('http://127.0.0.1:3000/api/docs')">打开 API 文档</button>
      </view>

      <view class="preview-tip">如果按钮无反应，请手动访问：http://127.0.0.1:5173</view>
    </view>
  </view>
</template>

<script setup lang="ts">
function openPage(url: string) {
  if (typeof window !== 'undefined') {
    window.open(url, '_blank');
    return;
  }
  uni.setClipboardData({ data: url });
}
</script>

<style>
page {
  background:
    radial-gradient(circle at 8% 0%, rgba(16, 185, 129, 0.18), transparent 35%),
    radial-gradient(circle at 90% 100%, rgba(249, 115, 22, 0.18), transparent 35%),
    #f8fafc;
  color: #0f172a;
  font-family: 'PingFang SC', 'Noto Sans CJK SC', sans-serif;
}

.app-root {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  box-sizing: border-box;
}

.preview-card {
  width: min(720px, 100%);
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 16px 40px rgba(2, 6, 23, 0.08);
}

.preview-title {
  margin: 0 0 10px;
  font-size: 28px;
  font-weight: 700;
}

.preview-desc {
  margin: 0 0 18px;
  color: #334155;
  line-height: 1.6;
}

.preview-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.preview-btn {
  border: 0;
  border-radius: 10px;
  padding: 10px 14px;
  background: linear-gradient(120deg, #0ea5e9, #10b981);
  color: #fff;
  font-size: 14px;
}

.preview-btn.secondary {
  background: linear-gradient(120deg, #f97316, #ef4444);
}

.preview-tip {
  margin: 0;
  color: #475569;
}

.card {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 18rpx;
  padding: 22rpx;
  margin-bottom: 20rpx;
}

.title {
  font-size: 34rpx;
  font-weight: 700;
  margin-bottom: 14rpx;
}

.subtitle {
  font-size: 24rpx;
  color: #475569;
  margin-bottom: 10rpx;
}

.btn-row {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 6rpx 14rpx;
  border-radius: 999rpx;
  background: rgba(14, 165, 233, 0.12);
  color: #0369a1;
  font-size: 22rpx;
}
</style>
