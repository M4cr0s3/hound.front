<template>
  <div class="space-y-4">
    <div class="bg-white shadow rounded-lg p-4">
      <h3 class="text-sm font-medium text-gray-900 mb-3">Детали</h3>

      <div class="space-y-3">
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Приоритет</label>
          <PrioritySelect
              v-model="issue.priority"
              @change="(priority: string) => issuesStore.updateIssue(issue.id, { priority })"
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Дата дедлайна</label>
          <DatePicker
              v-model="issue.due_date"
              @change="(dueDate: string) => issuesStore.updateIssue(issue.id, { due_date: dueDate })"
          />
        </div>

        <label class="block text-xs font-medium text-gray-500 mb-1">Среда</label>
        <Badge variant="info" :text="issue.event?.environment"/>

        <label class="block text-xs font-medium text-gray-500 mb-1">Релиз</label>
        <Badge variant="light" :text="issue.event?.release ?? 'Не указан'"/>
      </div>
    </div>

<!--    <div class="bg-white shadow rounded-lg p-4">-->
<!--      <h3 class="text-sm font-medium text-gray-900 mb-3">Теги</h3>-->
<!--      <TagList :tags="issue?.event?.metadata?.tags || []"/>-->
<!--    </div>-->
  </div>
</template>

<script setup lang="ts">
import {PrioritySelect, DatePicker, Badge} from '@/components/ui';
import type {Issue} from '@/api';
import {useIssuesStore} from "@/stores";

const props = defineProps<{
  issue: Issue;
}>();
const emit = defineEmits(['priority-changed', 'due-date-changed']);

const issuesStore = useIssuesStore();
</script>