<template>
  <div ref="el" class="topic-chart"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps<{ data: Array<{ topic: string; count: number }> }>();

const el = ref<HTMLElement>();
let instance: echarts.ECharts | null = null;

function render() {
  if (!el.value) return;
  if (!instance) {
    instance = echarts.init(el.value);
  }

  instance.setOption({
    backgroundColor: 'transparent',
    tooltip: {},
    grid: { top: 24, right: 12, left: 12, bottom: 8, containLabel: true },
    xAxis: {
      type: 'category',
      data: props.data.map((item) => item.topic),
      axisLabel: { color: '#1f2937', fontSize: 12 }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#1f2937', fontSize: 12 },
      splitLine: { lineStyle: { color: '#c7d2fe' } }
    },
    series: [
      {
        type: 'bar',
        data: props.data.map((item) => item.count),
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
          color: '#0ea5e9'
        }
      }
    ]
  });
}

onMounted(render);
watch(() => props.data, render, { deep: true });
onBeforeUnmount(() => instance?.dispose());
</script>

<style scoped>
.topic-chart {
  width: 100%;
  height: 280px;
}
</style>
