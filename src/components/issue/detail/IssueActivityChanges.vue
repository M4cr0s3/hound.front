<template>
  <div class="space-y-2">
    <template v-if="activity.type === 'status_changed'">
      <div class="flex items-center space-x-2">
        <span class="text-gray-500">Статус:</span>
        <span class="px-2 py-0.5 rounded text-xs line-through"
              :class="statusClass(activity.changes.before.status)">
          {{ humanReadableStatus(activity.changes.before.status) }}
        </span>
        <Icon icon="heroicons-outline:arrow-right" class="h-4 w-4 text-gray-400"/>
        <span class="px-2 py-0.5 rounded text-xs"
              :class="statusClass(activity.changes.after.status)">
          {{ humanReadableStatus(activity.changes.after.status) }}
        </span>
      </div>
    </template>

    <template v-else-if="activity.type === 'due_date_changed'">
      <div class="flex items-center space-x-2">
        <span class="text-gray-500">Дедлайн:</span>
        <span class="text-sm text-gray-600">
          {{ formatDate(activity.changes.before.due_date) || 'Не установлен' }}
        </span>
        <Icon icon="heroicons-outline:arrow-right" class="h-4 w-4 text-gray-400"/>
        <span class="text-sm font-medium"
              :class="{'text-red-600': isOverdue(activity.changes.after.due_date)}">
          {{ formatDate(activity.changes.after.due_date) || 'Не установлен' }}
        </span>
      </div>
    </template>

    <template v-else-if="activity.type === 'comment_added'">
      <div class="prose prose-sm max-w-none p-3 bg-gray-50 rounded-lg">
        <div v-html="renderMarkdown(activity.changes.after.text)"/>
      </div>
    </template>

    <template v-else>
      <div v-for="(value, field) in activity.changes.after" :key="field" class="space-y-1">
        <template v-if="shouldDisplayField(field) && activity.changes.before[field] !== value">
          <div class="flex items-start space-x-2">
            <span class="text-gray-500 capitalize">{{ humanReadableField(field) }}:</span>
            <div class="flex-1">
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-600 line-through">
                  {{ formatValue(field, activity.changes.before[field]) }}
                </span>
                <Icon icon="heroicons-outline:arrow-right" class="h-4 w-4 text-gray-400"/>
                <span class="text-sm font-medium">
                  {{ formatValue(field, value) }}
                </span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {Icon} from '@iconify/vue';
import {ref} from "vue";
import MarkdownIt from "markdown-it";

const props = defineProps<{
  activity: any;
}>();

const md = ref(new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
}));

const excludedFields = ['updated_at', 'created_at'];

const shouldDisplayField = (field: string) => {
  return !excludedFields.includes(field);
};

const humanReadableField = (field: string) => {
  const fields: Record<string, string> = {
    'title': 'Название',
    'priority': 'Приоритет',
    'culprit': 'Виновник',
    'due_date': 'Дедлайн',
    'status': 'Статус',
  };
  return fields[field] || field;
};

const formatValue = (field: string, value: any) => {
  if (value === null || value === undefined) return 'Не установлено';
  if (field === 'due_date') return formatDate(value);
  return value;
};

const humanReadableStatus = (status: string) => {
  const statuses: Record<string, string> = {
    'open': 'Открыта',
    'in_progress': 'В работе',
    'resolved': 'Решена',
    'closed': 'Закрыта',
  };
  return statuses[status] || status;
};

const statusClass = (status: string) => {
  const classes: Record<string, string> = {
    'open': 'bg-gray-100 text-gray-800',
    'in_progress': 'bg-blue-100 text-blue-800',
    'resolved': 'bg-green-100 text-green-800',
    'closed': 'bg-purple-100 text-purple-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const formatDate = (dateString: string) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const isOverdue = (dateString: string) => {
  if (!dateString) return false;
  return new Date(dateString) < new Date();
};

const renderMarkdown = (content: string) => {
  if (!content) return '';
  return md.value.render(content);
};
</script>

<style scoped>
.prose :deep(pre) {
  background-color: #f6f8fa;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
}

.prose :deep(code) {
  background-color: rgba(175, 184, 193, 0.2);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 85%;
}

.prose :deep(blockquote) {
  border-left: 4px solid #dfe2e5;
  padding-left: 16px;
  color: #57606a;
  margin-left: 0;
}

.prose :deep(img) {
  max-width: 100%;
  border-radius: 6px;
  margin: 1em 0;
}
</style>