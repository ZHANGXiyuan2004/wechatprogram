<template>
  <section>
    <div class="page-head">
      <h2>Prompt配置中心</h2>
      <div class="filters">
        <el-select v-model="selectedModule" placeholder="模块" style="width: 180px">
          <el-option
            v-for="item in moduleOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <el-button type="primary" @click="load">刷新</el-button>
      </div>
    </div>

    <div class="panel">
      <h3>新建Prompt版本</h3>
      <el-input
        v-model="draftContent"
        type="textarea"
        :rows="5"
        placeholder="输入Prompt内容，支持变量如 {{topic}}"
      />
      <div style="margin-top: 12px; display: flex; gap: 8px">
        <el-checkbox v-model="publishNow">创建后立即发布</el-checkbox>
        <el-button type="primary" @click="create">保存版本</el-button>
      </div>
    </div>

    <div class="panel">
      <h3>版本列表</h3>
      <el-table :data="templates" stripe>
        <el-table-column prop="module" label="模块" width="140" />
        <el-table-column prop="version" label="版本" width="80" />
        <el-table-column prop="published" label="生效中" width="90">
          <template #default="scope">{{ scope.row.published ? '是' : '否' }}</template>
        </el-table-column>
        <el-table-column prop="createdBy" label="创建人" width="120" />
        <el-table-column prop="createdAt" label="创建时间" width="220" />
        <el-table-column prop="content" label="内容" />
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <div style="display: flex; gap: 6px">
              <el-button
                v-if="!scope.row.published"
                size="small"
                type="primary"
                @click="publish(scope.row.id)"
              >
                发布
              </el-button>
              <el-button size="small" @click="rollback(scope.row.module, scope.row.version)">
                回滚到此
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="panel">
      <h3>审计日志</h3>
      <el-table :data="auditLogs" stripe>
        <el-table-column prop="action" label="动作" width="110" />
        <el-table-column prop="module" label="模块" width="140" />
        <el-table-column prop="operator" label="操作人" width="120" />
        <el-table-column prop="detail" label="详情" width="160" />
        <el-table-column prop="createdAt" label="时间" />
      </el-table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { api } from '../api/client';

const moduleOptions = ['OUTLINE', 'POLISH', 'COACH', 'TEAM_INSIGHT'];
const selectedModule = ref('OUTLINE');
const draftContent = ref('');
const publishNow = ref(false);
const templates = ref<any[]>([]);
const auditLogs = ref<any[]>([]);

async function load() {
  const data = (await api.prompts(selectedModule.value)) as { templates: any[]; auditLogs: any[] };
  templates.value = data.templates;
  auditLogs.value = data.auditLogs;
}

async function create() {
  if (!draftContent.value.trim()) {
    ElMessage.warning('请先输入Prompt内容');
    return;
  }

  await api.createPrompt({
    module: selectedModule.value,
    content: draftContent.value,
    publish: publishNow.value
  });

  ElMessage.success('已创建新版本');
  draftContent.value = '';
  publishNow.value = false;
  await load();
}

async function publish(id: string) {
  await api.publishPrompt(id);
  ElMessage.success('已发布');
  await load();
}

async function rollback(module: string, version: number) {
  await api.rollbackPrompt({ module, version });
  ElMessage.success(`已回滚到 ${module} v${version}`);
  await load();
}

onMounted(load);
</script>
