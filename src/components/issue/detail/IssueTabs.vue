<template>
  <div class="border-b border-gray-200">
    <nav class="-mb-px flex space-x-8">
      <button v-for="tab in tabs" :key="tab.name" @click="emit('tab-change', tab.name)" :class="[
        tab.name === activeTab
          ? 'border-indigo-500 text-indigo-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
        'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer',
      ]">
        <span class="flex items-center">
          <Icon :icon="tab.icon" class="mr-2 h-5 w-5" />
          {{ tab.label }}
        </span>
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';

defineProps<{
  activeTab: 'comments' | 'activities';
  eventCount?: number;
}>();

const emit = defineEmits(['tab-change']);

const tabs = [
  {
    name: 'comments',
    label: 'Комментарии',
    icon: 'heroicons:chat-bubble-oval-left',
  },
  {
    name: 'activities',
    label: 'Активность',
    icon: 'mdi:history',
  },
];
</script>