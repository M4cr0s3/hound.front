<template>
  <DataTable
      :columns="columns"
      :data="issues"
      :pagination="pagination"
      :is-loading="isLoading"
      row-clickable
      @row-click="emit('select', $event)"
      @page-change="handlePageChange"
      row-class="text-sm text-gray-700"
      pagination-text="проблем"
  >
    <template #cell-status="{ value }">
      <span
          :class="{
          'bg-green-100 text-green-800': value === IssueStatus.Resolved,
          'bg-blue-100 text-blue-800': value === IssueStatus.InProgress,
          'bg-gray-100 text-gray-800': value === IssueStatus.Open,
          'bg-red-100 text-red-800': value === IssueStatus.Closed,
        }"
          class="px-2 py-1 rounded-full text-xs font-medium"
      >
        {{ value.replace('_', ' ').toUpperCase() }}
      </span>
    </template>
    <template #cell-priority="{ value }">
      <span
          :class="{
          'bg-red-100 text-red-800': value === IssuePriority.Critical,
          'bg-orange-100 text-orange-800': value === IssuePriority.High,
          'bg-yellow-100 text-yellow-800': value === IssuePriority.Medium,
          'bg-green-100 text-green-800': value === IssuePriority.Low,
        }"
          class="px-2 py-1 rounded-full text-xs font-medium"
      >
        {{ value }}
      </span>
    </template>
    <template #cell-assignees="{ value }">
      <span v-if="value && value.length">
        {{ value.map((user: User) => user.name).join(', ') }}
      </span>
      <span v-else class="text-gray-500">Не назначено</span>
    </template>
    <template #cell-tags="{ value }">
      <span v-if="value && value.length" class="flex gap-1">
        <span
            v-for="tag in value"
            :key="tag"
            class="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
        >
          {{ tag }}
        </span>
      </span>
      <span v-else class="text-gray-500">Нет тегов</span>
    </template>
    <template #cell-due_date="{ value }">
      <span v-if="value" class="text-gray-500 flex items-center">
        <Icon icon="heroicons-outline:calendar" class="h-4 w-4 mr-2 inline-block"/>
        {{ new Date(value).toLocaleDateString('ru-RU') }}
      </span>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {Icon} from '@iconify/vue';
import {DataTable} from '@/components/ui';
import {type Issue, IssueStatus, IssuePriority, type User, type Pagination} from '@/api';

const props = defineProps<{
  issues: Issue[];
  pagination: Pagination | null;
  isLoading: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', issue: Issue): void;
  (e: 'page-change', url: string | null): void;
}>();

const columns = computed(() => [
  {key: 'id', title: 'ID'},
  {key: 'title', title: 'Название'},
  {key: 'status', title: 'Статус'},
  {key: 'priority', title: 'Приоритет'},
  {key: 'assignees', title: 'Назначено'},
  {key: 'tags', title: 'Теги'},
  {key: 'due_date', title: 'Срок',},
]);

const handlePageChange = (url: string | null) => {
  if (url) {
    const page = new URL(url).searchParams.get('page');
    if (page) {
      emit('page-change', page);
    }
  }
};
</script>