<template>
  <section>
    <div class="page-head">
      <h2>练习记录检索</h2>
      <div class="filters">
        <el-input v-model="employeeName" placeholder="员工姓名" clearable />
        <el-input v-model="departmentId" placeholder="部门ID" clearable />
        <el-button type="primary" @click="load">查询</el-button>
      </div>
    </div>

    <el-table :data="rows" stripe>
      <el-table-column prop="employeeName" label="员工" width="120" />
      <el-table-column prop="departmentName" label="部门" width="160" />
      <el-table-column prop="topic" label="主题" />
      <el-table-column prop="durationSec" label="时长(秒)" width="100" />
      <el-table-column prop="status" label="状态" width="140" />
      <el-table-column prop="createdAt" label="创建时间" width="220" />
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <RouterLink :to="`/records/${scope.row.practiceId}`">查看详情</RouterLink>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { api } from '../api/client';

const departmentId = ref('');
const employeeName = ref('');
const rows = ref<any[]>([]);

async function load() {
  rows.value = (await api.records({
    departmentId: departmentId.value || undefined,
    employeeName: employeeName.value || undefined
  })) as any[];
}

onMounted(load);
</script>
