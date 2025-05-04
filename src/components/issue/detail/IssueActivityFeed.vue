<template>
  <div class="bg-white shadow rounded-lg overflow-hidden">
    <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
      <h3 class="text-lg font-medium text-gray-900">История изменений</h3>
    </div>
    <div class="space-y-4 px-4 py-5">
      <div
          v-for="activity in activities"
          :key="activity.id"
          class="flex items-start space-x-3"
      >
        <div class="flex-shrink-0">
          <Avatar :name="activity.user.name" size="sm"/>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center space-x-2 text-sm">
            <span class="font-medium text-gray-900">{{ activity.user.name }}</span>
            <span class="text-gray-500">{{ formatDate(activity.created_at) }}</span>
            <span class="text-gray-400">•</span>
            <span class="text-xs px-2 py-0.5 rounded-full"
                  :class="activityTypeClasses[activity.type] || 'bg-gray-100 text-gray-800'">
              {{ humanReadableType(activity.type) }}
            </span>
          </div>

          <div class="mt-1 text-sm">
            <IssueActivityChanges :activity="activity"/>
          </div>
        </div>
      </div>

      <div v-if="!activities.length" class="text-center py-4 text-gray-500">
        Нет записей об изменениях
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Avatar} from '@/components/ui';
import IssueActivityChanges from './IssueActivityChanges.vue';

const props = defineProps<{
  activities: Array<{
    id: number;
    type: string;
    changes: {
      before: Record<string, any>;
      after: Record<string, any>;
    };
    user: {
      id: number;
      name: string;
    };
    created_at: string;
  }>;
}>();

const activityTypeClasses = {
  'created_issue': 'bg-green-100 text-green-800',
  'updated_issue': 'bg-blue-100 text-blue-800',
  'status_changed': 'bg-purple-100 text-purple-800',
  'due_date_changed': 'bg-yellow-100 text-yellow-800',
  'comment_added': 'bg-indigo-100 text-indigo-800',
};

const humanReadableType = (type: string) => {
  const types: Record<string, string> = {
    'created_issue': 'Создана',
    'updated_issue': 'Обновлена',
    'status_changed': 'Статус изменён',
    'due_date_changed': 'Дедлайн изменён',
    'comment_added': 'Комментарий добавлен',
  };
  return types[type] || type;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>