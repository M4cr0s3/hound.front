<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
    <div class="px-5 py-4 flex items-start justify-between">
      <div>
        <p class="text-sm font-medium text-gray-500 truncate">{{ title }}</p>
        <p class="mt-1 text-2xl font-semibold text-gray-900">
          {{ value }}
          <span v-if="trend === 'up'" class="text-green-600 text-sm ml-1">↑</span>
          <span v-if="trend === 'down'" class="text-red-600 text-sm ml-1">↓</span>
          <span v-if="trend === 'week'" class="text-indigo-600 text-sm ml-1">↗</span>
        </p>
      </div>
      <div
          class="p-3 rounded-lg"
          :class="{
          'bg-indigo-100 text-indigo-600': variant === 'primary',
          'bg-green-100 text-green-600': variant === 'success',
          'bg-amber-100 text-amber-600': variant === 'warning',
          'bg-red-100 text-red-600': variant === 'danger',
          'bg-gray-100 text-gray-600': !variant
        }"
      >
        <Icon :icon="icon" class="h-6 w-6" />
      </div>
    </div>
    <div
        v-if="trend"
        class="px-5 py-3 bg-gray-50 text-xs flex items-center"
        :class="{
        'text-green-600': trend === 'up',
        'text-red-600': trend === 'down',
        'text-indigo-600': trend === 'week',
        'text-gray-500': trend === 'neutral'
      }"
    >
      <template v-if="trend === 'up'">
        <Icon icon="heroicons:arrow-trending-up" class="h-4 w-4 mr-1" />
        <span>Увеличилось</span>
      </template>
      <template v-else-if="trend === 'down'">
        <Icon icon="heroicons:arrow-trending-down" class="h-4 w-4 mr-1" />
        <span>Уменьшилось</span>
      </template>
      <template v-else-if="trend === 'week'">
        <Icon icon="heroicons:chart-bar" class="h-4 w-4 mr-1" />
        <span>За неделю</span>
      </template>
      <span v-if="trendValue" class="font-medium ml-1">{{ trendValue }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';

defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  variant: {
    type: String as () => 'primary' | 'success' | 'warning' | 'danger',
    default: 'primary'
  },
  trend: {
    type: String as () => 'up' | 'down' | 'neutral' | 'week',
    default: null
  },
  trendValue: {
    type: String,
    default: null
  }
});
</script>

<style scoped>
.hover-effect {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-effect:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>