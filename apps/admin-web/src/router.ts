import { createRouter, createWebHistory } from 'vue-router';
import DashboardPage from './pages/DashboardPage.vue';
import PromptsPage from './pages/PromptsPage.vue';
import RecordDetailPage from './pages/RecordDetailPage.vue';
import RecordsPage from './pages/RecordsPage.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/dashboard', component: DashboardPage },
    { path: '/records', component: RecordsPage },
    { path: '/records/:id', component: RecordDetailPage, props: true },
    { path: '/prompts', component: PromptsPage }
  ]
});
