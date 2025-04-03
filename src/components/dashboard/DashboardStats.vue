<template>
  <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
    <div
        v-for="stat in stats"
        :key="stat.name"
        class="bg-white overflow-hidden shadow rounded-lg"
    >
      <div class="px-4 py-5 sm:p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0 rounded-md p-3" :class="stat.bgColor">
            <component :is="stat.icon" class="h-6 w-6 text-white" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dt class="text-sm font-medium text-gray-500 truncate">
              {{ stat.name }}
            </dt>
            <dd class="flex items-baseline">
              <div class="text-2xl font-semibold text-gray-900">
                {{ stat.value }}
              </div>
              <div
                  v-if="stat.change"
                  :class="stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'"
                  class="ml-2 flex items-baseline text-sm font-semibold"
              >
                <span class="sr-only">
                  {{ stat.changeType === 'increase' ? 'Increased' : 'Decreased' }} by
                </span>
                {{ stat.change }}
              </div>
            </dd>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">


const stats = [
  {
    name: 'Всего ошибок',
    value: '1,234',
    change: '12%',
    changeType: 'increase',
    bgColor: 'bg-red-500'
  },
  {
    name: 'Нерешенных',
    value: '567',
    change: '5%',
    changeType: 'increase',
    bgColor: 'bg-yellow-500'
  },
  {
    name: 'Решенных',
    value: '667',
    change: '8%',
    changeType: 'increase',
    bgColor: 'bg-green-500'
  },
  {
    name: 'Проигнорировано',
    value: '42',
    change: '3%',
    changeType: 'decrease',
    bgColor: 'bg-gray-500'
  }
];
</script>