<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
        <div>
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg">
              <Icon icon="heroicons:heart" class="h-6 w-6 text-white"/>
            </div>
            <h1 class="text-2xl font-bold text-gray-900">Health Check Мониторинг</h1>
          </div>
          <div v-if="healthCheckStore.endpoint" class="mt-2 flex items-center space-x-2">
            <span class="px-2 py-1 text-xs font-medium rounded bg-indigo-100 text-indigo-800">
              {{ healthCheckStore.endpoint.method }}
            </span>
            <p class="text-sm text-gray-600 truncate max-w-md">
              {{ healthCheckStore.endpoint.url }}
            </p>
          </div>
        </div>
        <Button
            @click="$router.back()"
            variant="outline"
            class="self-start sm:self-center"
        >
          <Icon icon="heroicons:arrow-left" class="mr-2 h-4 w-4"/>
          Назад
        </Button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
            title="Ср. время ответа"
            :value="`${stats?.avg_response_time.toFixed(2) ?? 0}ms`"
            icon="heroicons:clock"
            :trend="responseTimeTrend"
            :trend-value="responseTimeTrendValue"
        />
        <StatCard
            title="Аптайм"
            :value="`${stats?.uptime_percentage.toFixed(2) ?? 100}%`"
            icon="heroicons:shield-check"
            variant="success"
        />
        <StatCard
            title="Всего проверок"
            :value="stats?.total_checks ?? 0"
            icon="heroicons:check-badge"
            variant="primary"
        />
        <StatCard
            title="Последний статус"
            :value="lastResult?.status_code ?? '-'"
            :variant="lastResult?.success ? 'success' : 'danger'"
            icon="heroicons:exclamation-circle"
        />
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <h2 class="text-lg font-semibold text-gray-900">Время ответа (последние 24 часа)</h2>
        </div>
        <div class="p-6 h-80">
          <ResponseTimeChart :data="chartData"/>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <h2 class="text-lg font-semibold text-gray-900">История проверок</h2>
        </div>
        <div class="divide-y divide-gray-100">
          <template v-if="isLoading">
            <div v-for="i in 5" :key="i" class="p-6">
              <div class="animate-pulse flex space-x-4">
                <div class="flex-1 space-y-4 py-1">
                  <div class="h-4 bg-gray-100 rounded w-3/4"></div>
                  <div class="space-y-2">
                    <div class="h-4 bg-gray-100 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <template v-else-if="results.length === 0">
            <EmptyState
                title="Нет данных"
                icon="heroicons:inbox"
                description="Здесь будут отображаться результаты проверок"
                class="p-8"
            />
          </template>

          <template v-else>
            <div
                v-for="result in results"
                :key="result.id"
                class="p-5 hover:bg-gray-50 transition-colors duration-150"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0">
                    <div
                        class="h-10 w-10 rounded-full flex items-center justify-center"
                        :class="result.success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'"
                    >
                      <Icon
                          :icon="result.success ? 'heroicons:check' : 'heroicons:x-mark'"
                          class="h-5 w-5"
                      />
                    </div>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">
                      {{ formatDateTime(result.created_at) }}
                    </p>
                    <p class="text-sm text-gray-500">
                      {{ result.response_time.toFixed(2) }} ms
                    </p>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <Badge
                      :variant="result.success ? 'success' : 'danger'"
                      :text="`HTTP ${result.status_code}`"
                  />
                  <button
                      v-if="!result.success"
                      @click="copyError(result)"
                      class="text-gray-400 hover:text-gray-600"
                      title="Копировать ошибку"
                  >
                    <Icon icon="heroicons:clipboard" class="h-5 w-5"/>
                  </button>
                </div>
              </div>

              <div
                  v-if="!result.success && showTooltip === result.id"
                  class="mt-3 p-3 bg-red-50 text-red-800 text-sm rounded-lg border border-red-100"
              >
                <p class="font-medium">Ошибка:</p>
                <p class="mt-1 break-words">
                  {{ result.error_message || 'Нет описания ошибки' }}
                </p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue';
import {useRoute} from 'vue-router';
import {Icon} from '@iconify/vue';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import {useHealthCheckStore, type HealthCheckResult} from '@/stores';
import {formatDateTime} from '@/utils';
import {Badge, Button} from '@/components/ui'
import {EmptyState} from "@/components/projects/settings/notification";
import ResponseTimeChart from "@/components/charts/ResponseTimeChart.vue";
import StatCard from "@/components/projects/StatCard.vue";

const route = useRoute();
const endpointId = Number(route.params.endpointId);

const healthCheckStore = useHealthCheckStore();
const {fetchEndpointResults} = healthCheckStore;

const results = computed(() => healthCheckStore.results.splice(0, 20));
const stats = computed(() => healthCheckStore.stats);
const isLoading = computed(() => healthCheckStore.isLoading);
const chartData = computed(() => healthCheckStore.chartData);
const lastResult = computed(() => results.value[0]);
const showTooltip = ref<number | null>(null);

const responseTimeTrend = computed(() => {
  if (!chartData.value || chartData.value.length < 2) return null;
  const first = chartData.value[0].response_time;
  const last = chartData.value[chartData.value.length - 1].response_time;
  return last > first ? 'up' : last < first ? 'down' : null;
});

const responseTimeTrendValue = computed(() => {
  if (!chartData.value || chartData.value.length < 2) return null;
  const first = chartData.value[0].response_time;
  const last = chartData.value[chartData.value.length - 1].response_time;
  const diff = ((last - first) / first * 100).toFixed(2);
  return `${diff}%`;
});

const copyError = (result: HealthCheckResult) => {
  if (!result.success) {
    const textToCopy = result.error_message || `HTTP ${result.status_code}`;
    navigator.clipboard.writeText(textToCopy);
    showTooltip.value = result.id;
    setTimeout(() => showTooltip.value = null, 2000);
  }
};

onMounted(async () => {
  await fetchEndpointResults(endpointId);
});
</script>

<style scoped>
.hover-card {
  transition: all 0.2s ease;
}

.hover-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>