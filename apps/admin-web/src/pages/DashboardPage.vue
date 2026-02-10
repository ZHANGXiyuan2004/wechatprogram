<template>
  <section>
    <div class="page-head">
      <h2>训练数据看板</h2>
      <div class="filters">
        <el-input v-model="employeeName" placeholder="按员工姓名搜索" clearable />
        <el-input v-model="departmentId" placeholder="按部门ID搜索" clearable />
        <el-button type="primary" @click="load">查询</el-button>
      </div>
    </div>

    <div class="stats-row">
      <div class="stat-box">
        <label>练习总次数</label>
        <strong>{{ summary.totalPracticeCount }}</strong>
      </div>
      <div class="stat-box">
        <label>活跃员工数</label>
        <strong>{{ summary.activeEmployeeCount }}</strong>
      </div>
      <div class="stat-box">
        <label>人均练习时长(秒)</label>
        <strong>{{ summary.avgDurationSec }}</strong>
      </div>
    </div>

    <div class="panel">
      <h3>热门演讲话题分布</h3>
      <TopicChart :data="summary.topTopics || []" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { api } from '../api/client';
import TopicChart from '../components/TopicChart.vue';

const departmentId = ref('');
const employeeName = ref('');
const summary = reactive({
  totalPracticeCount: 0,
  activeEmployeeCount: 0,
  avgDurationSec: 0,
  topTopics: [] as Array<{ topic: string; count: number }>
});

async function load() {
  const data = (await api.dashboard({
    departmentId: departmentId.value || undefined,
    employeeName: employeeName.value || undefined
  })) as typeof summary;

  summary.totalPracticeCount = data.totalPracticeCount;
  summary.activeEmployeeCount = data.activeEmployeeCount;
  summary.avgDurationSec = data.avgDurationSec;
  summary.topTopics = data.topTopics;
}

onMounted(load);
</script>
