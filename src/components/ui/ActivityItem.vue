<template>
  <div class="flex">
    <div class="flex-shrink-0 mr-3">
      <img
          class="h-8 w-8 rounded-full"
          :src="`https://i.pravatar.cc/150?u=${activity.user.id}`"
          :alt="activity.user.name"
      />
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex items-center text-sm">
        <span class="font-medium text-gray-900">{{ activity.user.name }}</span>
        <span class="ml-2 text-gray-500">{{ formatDate(activity.created_at) }}</span>
      </div>
      <div class="mt-1 text-sm text-gray-700">
        <template v-if="activity.type === 'comment'">
          <p>{{ activity.data.comment }}</p>
        </template>
        <template v-else-if="activity.type === 'status_change'">
          <p>Changed status from
            <StatusBadge :status="activity.data.from"/>
            to
            <StatusBadge :status="activity.data.to"/>
          </p>
        </template>
        <template v-else-if="activity.type === 'assignment'">
          <p v-if="activity.data.added">Assigned to {{ activity.data.assignee.name }}</p>
          <p v-else>Unassigned from {{ activity.data.assignee.name }}</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {StatusBadge} from '@/components/ui';

defineProps<{
  activity: any;
}>();

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('ru-RU', {dateStyle: 'medium', timeStyle: 'short'}).format(new Date(dateString));
};
</script>