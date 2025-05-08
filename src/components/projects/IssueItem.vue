<template>
  <div class="px-5 py-4 hover:bg-gray-50 transition-colors duration-150">
    <div class="flex items-start space-x-3">
      <div class="flex-shrink-0 pt-0.5">
        <Badge
            :variant="getBadgeVariant(issue.status)"
            :text="getStatusText(issue.status)"
        />
      </div>
      <div class="min-w-0 flex-1">
        <p class="text-sm font-medium text-gray-900">
          {{ issue.title }}
        </p>
        <div class="mt-1 flex items-center space-x-3">
          <span class="text-xs text-gray-500">
            {{ formatDateTime(issue.created_at) }}
          </span>
          <span
              v-if="issue.event"
              class="text-xs px-2 py-0.5 bg-gray-100 text-gray-800 rounded"
          >
            {{ issue.event.level }}
          </span>
        </div>
      </div>
      <RouterLink
          :to="`/issues/${issue.id}`"
          class="text-gray-400 hover:text-gray-500"
      >
        <Icon icon="heroicons:chevron-right" class="h-5 w-5"/>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Icon} from '@iconify/vue';
import {Badge} from '@/components/ui';
import {formatDateTime} from '@/utils';

const props = defineProps({
  issue: {
    type: Object,
    required: true
  },
  projectSlug: {
    type: String,
    required: true
  }
});

const getBadgeVariant = (status) => {
  const statusMap = {
    open: 'primary',
    in_progress: 'warning',
    resolved: 'success',
    closed: 'secondary'
  };
  return statusMap[status] || 'default';
};

const getStatusText = (status) => {
  const statusTextMap = {
    open: 'Открыта',
    in_progress: 'В работе',
    resolved: 'Решена',
    closed: 'Закрыта'
  };
  return statusTextMap[status] || status;
};
</script>