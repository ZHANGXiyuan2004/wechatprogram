<template>
  <div class="layout-bg">
    <header class="topbar">
      <div>
        <h1>企业口语训练管理后台</h1>
        <p>团队活跃度与表达优化追踪</p>
      </div>
      <div class="topbar-right">
        <el-segmented
          :model-value="role"
          :options="[
            { label: '主管视角', value: 'MANAGER' },
            { label: '管理员视角', value: 'ADMIN' }
          ]"
          @change="onRoleChange"
        />
      </div>
    </header>

    <main class="shell">
      <aside class="side-nav">
        <RouterLink to="/dashboard" class="nav-link" active-class="active">看板</RouterLink>
        <RouterLink to="/records" class="nav-link" active-class="active">记录检索</RouterLink>
        <RouterLink to="/prompts" class="nav-link" active-class="active">Prompt中心</RouterLink>
      </aside>

      <section class="content-card">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { getRole, setRole } from './api/client';

const role = ref(getRole());

function onRoleChange(next: string | number) {
  const value = String(next) === 'ADMIN' ? 'ADMIN' : 'MANAGER';
  role.value = value;
  setRole(value);
}
</script>
