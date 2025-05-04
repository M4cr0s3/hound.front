<template>
  <div
      class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md cursor-pointer"
      @click="emit('select', issue)"
  >
    <div class="flex justify-between items-start">
      <h3 class="text-sm font-medium text-gray-900">{{ issue.title }}</h3>
      <span
          :class="{
          'bg-green-100 text-green-800': issue.status === IssueStatus.Resolved,
          'bg-blue-100 text-blue-800': issue.status === IssueStatus.InProgress,
          'bg-gray-100 text-gray-800': issue.status === IssueStatus.Open,
          'bg-red-100 text-red-800': issue.status === IssueStatus.Closed,
        }"
          class="px-2 py-1 rounded-full text-xs font-medium"
      >
        {{ issue.status.replace('_', ' ').toUpperCase() }}
      </span>
    </div>
    <div class="mt-2 text-sm text-gray-600">
      <p>ID: {{ issue.event_id }}</p>
      <p>Приоритет:
        <span
            :class="{
            'text-red-600': issue.priority === IssuePriority.Critical,
            'text-orange-600': issue.priority === IssuePriority.High,
            'text-yellow-600': issue.priority === IssuePriority.Medium,
            'text-green-600': issue.priority === IssuePriority.Low,
          }"
        >
          {{ issue.priority }}
        </span>
      </p>
      <p v-if="issue.due_date">
        Срок: {{ new Date(issue.due_date).toLocaleDateString('ru-RU') }}
      </p>
      <p v-if="issue.assignees?.length">
        Назначено: {{ issue.assignees.map((user) => user.name).join(', ') }}
      </p>
      <div v-if="issue.tags?.length" class="flex gap-1 mt-2">
        <span
            v-for="tag in issue.tags"
            :key="tag"
            class="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {IssueStatus, IssuePriority, type Issue} from '@/api';

defineProps<{
  issue: Issue;
}>();

const emit = defineEmits<{
  (e: 'select', issue: Issue): void;
}>();
</script>