<template>
  <span
      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      :class="statusClasses"
  >
    {{ statusText }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {IssueStatus} from "@/api";

const props = defineProps<{
  status: IssueStatus;
}>();

const statusText = computed(() => {
  const texts: Record<IssueStatus, string> = {
    open: 'Открыта',
    in_progress: 'В работе',
    resolved: 'Решена',
    closed: 'Закрыта'
  };
  return texts[props.status];
});

const statusClasses = computed(() => {
  const classes = {
    closed: 'bg-red-100 text-red-800',
    resolved: 'bg-green-100 text-green-800',
    open: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800'
  };
  return classes[props.status];
});
</script>