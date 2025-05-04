<template>
  <div class="border-b border-gray-200">
    <nav class="-mb-px flex space-x-8">
      <button
          v-for="tab in tabs"
          :key="tab.name"
          @click="emit('tab-change', tab.name)"
          :class="[
          tab.name === activeTab
            ? 'border-indigo-500 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
          'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer',
        ]"
      >
        <span class="flex items-center">
          <Icon :icon="tab.icon" class="mr-2 h-5 w-5" />
          {{ tab.label }}
          <span
              v-if="tab.count !== undefined"
              class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
          >
            {{ tab.count }}
          </span>
        </span>
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';

const props = defineProps<{
  activeTab: 'comments' | 'events' | 'activities';
  eventCount?: number;
}>();

const emit = defineEmits(['tab-change']);

const tabs = [
  {
    name: 'comments',
    label: 'Комментарии',
    icon: 'mdi:comment-text-multiple',
  },
  {
    name: 'activities',
    label: 'Активность',
    icon: 'mdi:history',
  },
  {
    name: 'events',
    label: 'События',
    icon: 'mdi:alert-circle',
    count: props.eventCount,
  },
];
</script>