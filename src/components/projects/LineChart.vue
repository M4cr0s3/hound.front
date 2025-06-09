<template>
  <div ref="chartRef" class="w-full h-[300px]"></div>
</template>

<script setup lang="ts">
import type { ECharts, EChartsOption } from 'echarts';
import { BarChart, LineChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  TitleComponent,
  TooltipComponent
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

echarts.use([
  BarChart,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  MarkLineComponent,
  CanvasRenderer,
  TitleComponent
]);

const props = defineProps({
  color: {
    type: String 
  },
  data: {
    type: Array as () => Array<{
      date: string;
      total: number;
      errors: number;
      warnings: number;
    }>,
    required: true
  },
  title: {
    type: String,
    default: ''
  }
});

const chartRef = ref<HTMLElement | null>(null);
const chart = ref<ECharts | echarts.EChartsType>();

const initChart = () => {
  if (!chartRef.value) return;
  chart.value = echarts.init(chartRef.value);
  updateChart();
};

const updateChart = () => {
  if (!chart) return;

  const maxValue = Math.max(...props.data.map(item => item.total));
  const yAxisMax = Math.ceil(maxValue * 1.2);

  const dates = props.data.map(item => item.date);
  const errors = props.data.map(item => item.errors);
  const warnings = props.data.map(item => item.warnings);

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        const data = params[0].data;
        return `
          <div class="text-gray-900 font-medium">${params[0].axisValue}</div>
          <div class="mt-2 space-y-1">
            <div class="flex items-center">
              <span class="inline-block w-3 h-3 rounded-full mr-2 bg-[#6366F1]"></span>
              <span>Всего: <strong>${data.total}</strong></span>
            </div>
            <div class="flex items-center">
              <span class="inline-block w-3 h-3 rounded-full mr-2 bg-[#EF4444]"></span>
              <span>Ошибки: <strong>${data.errors}</strong></span>
            </div>
            <div class="flex items-center">
              <span class="inline-block w-3 h-3 rounded-full mr-2 bg-[#F59E0B]"></span>
              <span>Предупреждения: <strong>${data.warnings}</strong></span>
            </div>
          </div>
        `;
      }
    },
    legend: {
      data: ['Всего', 'Ошибки', 'Предупреждения'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: props.title ? '10%' : '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: {
        lineStyle: {
          color: '#E5E7EB'
        }
      },
      axisLabel: {
        color: '#6B7280'
      }
    },
    yAxis: {
      max: yAxisMax,
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: '#F3F4F6'
        }
      },
      axisLabel: {
        color: '#6B7280'
      }
    },
    series: [
      {
        name: 'Всего',
        type: 'bar',
        barWidth: '60%',
        itemStyle: {
          color: '#6366F1',
          borderRadius: [12, 12, 0, 0],
        },
        data: props.data.map(d => ({
          value: d.total,
          total: d.total,
          errors: d.errors,
          warnings: d.warnings
        }))
      },
      {
        name: 'Ошибки',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: '#EF4444'
        },
        itemStyle: {
          color: '#EF4444',
          borderWidth: 2,
          borderColor: '#fff'
        },
        data: errors
      },
      {
        name: 'Предупреждения',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: '#F59E0B'
        },
        itemStyle: {
          color: '#F59E0B',
          borderWidth: 2,
          borderColor: '#fff'
        },
        data: warnings
      }
    ],
    ...(props.title && {
      title: {
        text: props.title,
        left: 'center',
        textStyle: {
          color: '#111827',
          fontWeight: 'normal',
          fontSize: 14
        }
      }
    })
  };

  chart.value?.setOption(option);
};

const handleResize = () => {
  chart.value?.resize();
};

onMounted(() => {
  initChart();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  chart.value?.dispose();
});

watch(
    () => props.data,
    () => {
      updateChart();
    },
    {deep: true}
);

watch(
    () => props.color,
    () => {
      updateChart();
    }
);
</script>

<style scoped>
</style>