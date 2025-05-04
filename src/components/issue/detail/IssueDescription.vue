<template>
  <div class="bg-white shadow rounded-lg overflow-hidden">
    <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
      <h3 class="text-lg leading-6 font-medium text-gray-900">Детали ошибки</h3>
    </div>

    <div class="px-4 py-5 sm:p-6">
      <div class="mb-4">
        <h4 class="text-sm font-medium text-gray-900 mb-2">Сообщение</h4>
        <p class="text-sm text-gray-700">{{ event.message }}</p>
      </div>

      <div v-if="event.metadata.stacktrace" class="mb-4">
        <h4 class="text-sm font-medium text-gray-900 mb-2">Стектрейс</h4>
        <StacktraceViewer :stacktrace="event.metadata.stacktrace" />
      </div>

      <div v-if="event.metadata.context" class="mb-4">
        <h4 class="text-sm font-medium text-gray-900 mb-2">Контекст</h4>
        <JsonViewer :data="event.metadata.context" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { StacktraceViewer, JsonViewer } from '@/components/ui';
import type { Event } from '@/api';

const props = defineProps<{
  event: Event;
}>();
</script>