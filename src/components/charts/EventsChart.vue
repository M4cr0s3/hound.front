<template>
	<div
		ref="chartRef"
		class="w-full h-full"
	></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{
	data: { hour: string; count: number; slug?: string }[];
	slug: string;
}>();

const chartRef = ref<HTMLElement | null>(null);
const resizeObserver = ref<ResizeObserver | null>(null);

const fullHourRange = computed(() => {
	const now = new Date();
	const currentHour = now.getHours();
	const hours = [];

	for (let i = -4; i <= 4; i++) {
		const hour = (currentHour + i + 24) % 24;
		hours.push({
			hour: `${hour.toString().padStart(2, '0')}:00`,
			count: 0,
		});
	}

	return hours.map((h) => {
		const found = props.data.find((d) => d.hour === h.hour);
		return found ? { ...h, count: found.count } : h;
	});
});

onMounted(() => {
	if (chartRef.value) {
		const chart = echarts.init(chartRef.value);
		updateChart(chart);

		chart.on('click', 'series', () => {
			router.push(`/projects/${props.slug}/events`);
		});

		resizeObserver.value = new ResizeObserver(() => {
			chart.resize();
		});
		resizeObserver.value.observe(chartRef.value);
	}
});

onBeforeUnmount(() => {
	if (chartRef.value) {
		const chart = echarts.getInstanceByDom(chartRef.value);
		if (chart) {
			chart.off('click');
			chart.dispose();
		}

		if (resizeObserver.value) {
			resizeObserver.value.disconnect();
			resizeObserver.value = null;
		}
	}
});

watch(
	() => props.data,
	() => {
		if (chartRef.value) {
			const chart = echarts.getInstanceByDom(chartRef.value);
			if (chart) {
				updateChart(chart);
			}
		}
	}
);

function updateChart(chart: echarts.ECharts) {
	const option = {
		grid: {
			top: 10,
			right: 10,
			bottom: 20,
			left: 40,
		},
		xAxis: {
			type: 'category',
			data: fullHourRange.value.map((item) => item.hour),
			axisLine: { show: false },
			axisTick: { show: false },
			axisLabel: {
				fontSize: 10,
				color: '#6b7280',
			},
		},
		yAxis: {
			type: 'value',
			splitLine: {
				lineStyle: {
					color: '#f3f4f6',
				},
			},
			axisLabel: {
				fontSize: 10,
				color: '#6b7280',
			},
			min: 0,
		},
		series: [
			{
				data: fullHourRange.value.map((item) => item.count),
				type: 'bar',
				barWidth: '80%',
				itemStyle: {
					color: '#818cf8',
				},
				emphasis: {
					itemStyle: {
						color: '#4f46e5',
					},
				},
			},
		],
		tooltip: {
			trigger: 'axis',
			formatter: (params: any) => {
				const data = params[0];
				return `${data.axisValue}: ${data.value} событий`;
			},
		},
	};
	chart.setOption(option);
}
</script>
