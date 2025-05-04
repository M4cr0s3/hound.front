<template>
  <span
      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      :class="priorityClasses"
  >
    {{ priorityText }}
  </span>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {IssuePriority} from "@/api";

const {priority} = defineProps<{
  priority: IssuePriority;
}>();

const priorityText = computed(() => {
  const texts: Record<IssuePriority, string> = {
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий',
    critical: 'Критический'
  };
  return texts[priority];
});

const priorityClasses = computed(() => {
  const classes = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  };
  return classes[priority];
});
</script>