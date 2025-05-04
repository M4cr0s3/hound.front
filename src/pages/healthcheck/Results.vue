<template>
	<DashboardLayout>
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
			<div class="flex justify-between items-center mb-6">
				<div>
					<h1 class="text-2xl font-bold text-gray-900">
						Health check статистика
					</h1>
					<p
						class="text-sm text-gray-500 mt-1"
						v-if="healthCheckStore.endpoint"
					>
						{{ healthCheckStore.endpoint.method }}
						{{ healthCheckStore.endpoint.url }}
					</p>
				</div>
				<button
					@click.prevent="$router.back()"
					class="inline-flex cursor-pointer items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
				>
					<Icon
						icon="heroicons:arrow-left"
						class="-ml-1 mr-2 h-5 w-5"
					/>
					Назад
				</button>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
				<div class="bg-white p-4 rounded-lg shadow border border-gray-100">
					<p class="text-sm font-medium text-gray-500">Ср. время ответа</p>
					<p class="text-2xl font-bold text-[#4f46e5]">
						{{ stats?.avg_response_time.toFixed(2) ?? 0 }}ms
					</p>
				</div>

				<div class="bg-white p-4 rounded-lg shadow border border-gray-100">
					<p class="text-sm font-medium text-gray-500">Аптайм</p>
					<p class="text-2xl font-bold text-[#4f46e5]">
						{{ stats?.uptime_percentage.toFixed(2) ?? 100 }}%
					</p>
				</div>

				<div class="bg-white p-4 rounded-lg shadow border border-gray-100">
					<p class="text-sm font-medium text-gray-500">Всего проверок</p>
					<p class="text-2xl font-bold text-[#4f46e5]">
						{{ stats?.total_checks ?? 0 }}
					</p>
				</div>

				<div class="bg-white p-4 rounded-lg shadow border border-gray-100">
					<p class="text-sm font-medium text-gray-500">Последний статус</p>
					<p
						class="text-2xl font-bold"
						:class="lastResult?.success ? 'text-green-600' : 'text-red-600'"
					>
						{{ lastResult?.status_code ?? '-' }}
					</p>
				</div>
			</div>

			<div class="bg-white p-4 rounded-lg shadow border border-gray-100 mb-8">
				<h2 class="text-lg font-medium text-gray-900 mb-4">
					Время ответа (последние 24 часа)
				</h2>
				<div class="h-80">
					<ResponseTimeChart :data="chartData" />
				</div>
			</div>

			<div class="bg-white shadow rounded-lg overflow-hidden">
				<div class="px-4 py-5 sm:p-6">
					<h2 class="text-lg font-medium text-gray-900 mb-4">
						Последние проверки
					</h2>

					<div
						v-if="isLoading"
						class="space-y-4"
					>
						<div
							v-for="i in 5"
							:key="i"
							class="animate-pulse"
						>
							<div class="h-16 bg-gray-100 rounded-md"></div>
						</div>
					</div>

					<div
						v-else-if="results.length === 0"
						class="text-center py-8"
					>
						<p class="text-gray-500">Нет результатов.</p>
					</div>

					<div v-else>
						<table class="min-w-full divide-y divide-gray-200">
							<thead class="bg-gray-50">
								<tr>
									<th
										scope="col"
										class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Время проверки
									</th>
									<th
										scope="col"
										class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Статус
									</th>
									<th
										scope="col"
										class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Время ответа
									</th>
								</tr>
							</thead>
							<tbody class="bg-white divide-y divide-gray-200">
								<tr
									v-for="result in results"
									:key="result.id"
								>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{{ formatDateTime(result.created_at) }}
									</td>
									<td class="px-6 py-4 whitespace-nowrap relative">
										<div class="relative inline-block">
											<transition
												enter-active-class="transition-opacity duration-200 ease-out"
												enter-from-class="opacity-0"
												enter-to-class="opacity-100"
												leave-active-class="transition-opacity duration-150 ease-in"
												leave-from-class="opacity-100"
												leave-to-class="opacity-0"
											>
												<div
													v-if="!result.success && showTooltip === result.id"
													class="absolute z-10 bottom-full mb-2 left-1/2 transform -translate-x-1/2 p-2 text-sm text-red-800 bg-red-50 rounded-md shadow-lg border border-red-100"
													@mouseenter="showTooltip = result.id"
													@mouseleave="showTooltip = null"
												>
													<div class="flex justify-between items-start">
														<div>
															<p class="font-medium">Ошибка:</p>
															<p class="mt-1 break-words">
																{{
																	truncateError(result.error_message) ||
																	'Нет описания ошибки'
																}}
																<span
																	v-if="shouldTruncate(result.error_message)"
																	class="text-xs text-red-600 block mt-1"
																>
																	(нажмите, чтобы скопировать полный текст)
																</span>
															</p>
														</div>
														<button
															@click.stop="copyError(result)"
															class="ml-2 text-red-600 cursor-pointer hover:text-red-800"
															title="Копировать"
														>
															<Icon
																icon="heroicons:clipboard"
																class="h-4 w-4"
															/>
														</button>
													</div>
													<div
														class="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-red-50"
													></div>
												</div>
											</transition>

											<span
												class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer"
												:class="
													result.success
														? 'bg-green-100 text-green-800'
														: 'bg-red-100 text-red-800'
												"
												@mouseenter="showTooltip = result.id"
												@mouseleave="showTooltip = null"
												@click="copyError(result)"
											>
												{{ result.status_code }}
												{{ result.success ? 'ОК' : 'Ошибка' }}
											</span>
										</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{{ result.response_time.toFixed(2) }}ms
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</DashboardLayout>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';
import DashboardLayout from '../../layouts/DashboardLayout.vue';
import ResponseTimeChart from '../..//components/charts/ResponseTimeChart.vue';
import { useHealthCheckStore, type HealthCheckResult } from '../../stores';
import { formatDateTime } from '../../utils';

const route = useRoute();
const endpointId = Number(route.params.endpointId);

const healthCheckStore = useHealthCheckStore();
const { fetchEndpointResults } = healthCheckStore;

const results = computed(() => healthCheckStore.results);
const stats = computed(() => healthCheckStore.stats);
const isLoading = computed(() => healthCheckStore.isLoading);
const chartData = computed(() => healthCheckStore.chartData);
const lastResult = computed(() => results.value[0]);

const showTooltip = ref<number | null>(null);

const truncateError = (errorMessage?: string): string => {
	if (!errorMessage) return '';
	const maxLength = 50;
	return errorMessage.length > maxLength
		? `${errorMessage.substring(0, maxLength)}...`
		: errorMessage;
};

const shouldTruncate = (errorMessage?: string): boolean => {
	return errorMessage ? errorMessage.length > 50 : false;
};

const copyError = (result: HealthCheckResult) => {
	if (!result.success) {
		const textToCopy = result.error_message || `HTTP ${result.status_code}`;
		navigator.clipboard.writeText(textToCopy);

		alert(`Скопировано: ${textToCopy}`);
	}
};

onMounted(async () => {
	await fetchEndpointResults(endpointId);
});
</script>
