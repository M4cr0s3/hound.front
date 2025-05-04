<template>
  <div class="bg-white shadow rounded-lg p-4 mt-4">
    <h3 class="text-sm font-medium text-gray-900 mb-3">Все метаданные</h3>

    <div class="space-y-3">
      <div class="flex justify-between">
        <span class="text-xs font-medium text-gray-500">Создана</span>
        <span class="text-sm text-gray-900">{{ formatDateTime(issue?.created_at) }}</span>
      </div>

      <div class="flex justify-between">
        <span class="text-xs font-medium text-gray-500">Обновлена</span>
        <span class="text-sm text-gray-900">{{ formatDateTime(issue?.updated_at) }}</span>
      </div>

      <div class="flex justify-between">
        <span class="text-xs font-medium text-gray-500">Среда</span>
        <span class="text-sm text-gray-900">{{ issue.event?.environment }}</span>
      </div>

      <div class="flex justify-between">
        <span class="text-xs font-medium text-gray-500">Релиз</span>
        <span class="text-sm text-gray-900">{{ issue.event.release || 'Not specified' }}</span>
      </div>

      <div class="flex justify-between">
        <span class="text-xs font-medium text-gray-500">Айди события</span>
        <span class="text-sm text-gray-900 text-right font-mono">{{ issue.event.event_id }}</span>
      </div>

      <div class="flex justify-between">
        <span class="text-xs font-medium text-gray-500">Тип события</span>
        <Badge variant="danger" :text="issue.event.type" v-if="issue.event.type === 'error'"/>
        <Badge variant="warning" :text="issue.event.type" v-if="issue.event.type === 'warning'"/>
        <Badge variant="info" :text="issue.event.type" v-if="issue.event.type === 'info'"/>
        <Badge variant="info" :text="issue.event.type" v-if="issue.event.type === 'debug'"/>
      </div>

      <div class="flex justify-between">
        <span class="text-xs font-medium text-gray-500">Уровень события</span>
        <Badge variant="danger" :text="issue.event.level" v-if="issue.event.level === 'error'"/>
        <Badge variant="warning" :text="issue.event.level" v-if="issue.event.level === 'warning'"/>
        <Badge variant="info" :text="issue.event.level" v-if="issue.event.level === 'info'"/>
        <Badge variant="info" :text="issue.event.level" v-if="issue.event.level === 'debug'"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDateTime } from '@/utils';
import Badge from "@/components/ui/Badge.vue";

defineProps<{
  issue: any;
}>();

</script>