<template>
  <section v-if="detail">
    <h2>记录详情</h2>

    <div class="detail-grid">
      <div>
        <label>主题</label>
        <p>{{ detail.practice.topic }}</p>
      </div>
      <div>
        <label>状态</label>
        <p>{{ detail.practice.status }}</p>
      </div>
      <div>
        <label>录音对象</label>
        <p>{{ detail.recording?.objectKey || '-' }}</p>
      </div>
      <div>
        <label>时长</label>
        <p>{{ detail.recording?.durationSec || 0 }} 秒</p>
      </div>
    </div>

    <div class="panel two-col">
      <div>
        <h3>ASR原文</h3>
        <pre>{{ detail.asrText || '暂无' }}</pre>
      </div>
      <div>
        <h3>优化后文本</h3>
        <pre>{{ detail.polishedText || '暂无' }}</pre>
      </div>
    </div>

    <div class="panel">
      <h3>Diff修改理由</h3>
      <el-table :data="detail.changes || []" stripe>
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="reasonTag" label="标签" width="130" />
        <el-table-column prop="newText" label="替换后" width="180" />
        <el-table-column prop="reason" label="说明" />
      </el-table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { api } from '../api/client';

const route = useRoute();
const detail = ref<any>();

async function load() {
  const id = String(route.params.id || '');
  if (!id) return;
  detail.value = await api.recordDetail(id);
}

onMounted(load);
</script>
