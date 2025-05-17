<template>
	<div
		ref="chartRef"
		class="w-full h-full"
	></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts';
import type { PropType } from 'vue';

const props = defineProps({
	data: {
		type: Array as PropType<Array<{ hour: string; avg_time: number }>>,
		required: true,
	},
});

const chartRef = ref<HTMLElement | null>(null);

onMounted(() => {
	initChart();
});

watch(
	() => props.data,
	() => {
		initChart();
	}
);

function initChart() {
	if (!chartRef.value) return;

  const existingInstance = echarts.getInstanceByDom(chartRef.value);
  if (existingInstance) {
    echarts.dispose(chartRef.value);
  }

	const chart = echarts.init(chartRef.value);
	const option = {
		tooltip: {
			trigger: 'axis',
			formatter: (params: any) => {
				const data = params[0];
				return `${data.axisValue}: ${data.value}ms`;
			},
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true,
		},
		xAxis: {
			type: 'category',
			data: props.data.map((item) => item.hour),
			axisLabel: {
				rotate: 45,
			},
		},
		yAxis: {
			type: 'value',
			name: 'Время ответа (ms)',
			axisLine: {
				show: true,
			},
		},
		series: [
			{
				name: 'Время ответа',
				type: 'line',
				smooth: true,
				data: props.data.map((item) => item.avg_time),
				itemStyle: {
					color: '#4f46e5',
				},
				areaStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{
							offset: 0,
							color: 'rgba(79, 70, 229, 0.3)',
						},
						{
							offset: 1,
							color: 'rgba(79, 70, 229, 0.1)',
						},
					]),
				},
			},
		],
	};

	chart.setOption(option);

	const resizeObserver = new ResizeObserver(() => {
		chart.resize();
	});
	resizeObserver.observe(chartRef.value);
}
</script>
