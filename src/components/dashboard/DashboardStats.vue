<template>
  <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
    <div v-for="stat in stats" :key="stat.name" class="bg-white overflow-hidden shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0 rounded-md p-3" :class="stat.bgColor">
            <Icon :icon="stat.icon" class="h-6 w-6 text-white" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dt class="text-sm font-medium text-gray-500 truncate">
              {{ stat.name }}
            </dt>
            <dd class="flex items-baseline">
              <div class="text-2xl font-semibold text-gray-900">
                {{ stat.value }}
              </div>
              <div v-if="typeof stat.change === 'number'" :class="stat.change >= 0 ? 'text-green-600' : 'text-red-600'"
                class="ml-2 flex items-baseline text-sm font-semibold">
                <span class="sr-only">
                  {{ stat.change >= 0 ? 'Increased' : 'Decreased' }} by
                </span>
                {{ Math.abs(stat.change).toFixed(2) }}%
              </div>
            </dd>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { httpClient } from "@/api";
import { Icon } from '@iconify/vue';
import { computed, onMounted, ref } from 'vue';

const data = ref({
  total_events: { value: 0, change_percentage: null },
  unresolved_issues: { value: 0, change_percentage: null },
  resolved_issues: { value: 0, change_percentage: null },
  closed_issues: { value: 0, change_percentage: null },
});

const stats = computed(() => [
  {
    name: 'Всего событий',
    value: data.value.total_events.value,
    change: data.value.total_events.change_percentage,
    bgColor: 'bg-blue-500',
    icon: 'heroicons:calendar',
  },
  {
    name: 'Нерешенные задачи',
    value: data.value.unresolved_issues.value,
    change: data.value.unresolved_issues.change_percentage,
    bgColor: 'bg-yellow-500',
    icon: 'heroicons:exclamation-triangle',
  },
  {
    name: 'Решенные задачи',
    value: data.value.resolved_issues.value,
    change: data.value.resolved_issues.change_percentage,
    bgColor: 'bg-green-500',
    icon: 'heroicons:check-circle',
  },
  {
    name: 'Закрытые задачи',
    value: data.value.closed_issues.value,
    change: data.value.closed_issues.change_percentage,
    bgColor: 'bg-gray-500',
    icon: 'heroicons:lock-closed',
  },
]);

onMounted(async () => {
  try {
    data.value = await httpClient.get('/events/dashboard');
  } catch (error) {
    console.error('Failed to load dashboard stats', error);
  }
});
</script>