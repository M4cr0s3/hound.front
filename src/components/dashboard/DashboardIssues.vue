<template>
  <div class="bg-white shadow rounded-lg mb-6">
    <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
      <h3 class="text-lg leading-6 font-medium text-gray-900">
        Недавние задачи
      </h3>
    </div>
    <div class="bg-white overflow-hidden" v-if="computedIssues.length">
      <ul class="divide-y divide-gray-200">
        <li
            v-for="issue in computedIssues"
            :key="issue.id"
        >
          <RouterLink
              :to="`/issues/${issue.id}`"
              class="block hover:bg-gray-50"
          >
            <div class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <p class="text-sm font-medium text-indigo-600 truncate">
                  {{ issue.title }}
                </p>
                <div class="ml-2 flex-shrink-0 flex">
                  <p
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="issue.statusClass"
                  >
                    {{ issue.status }}
                  </p>
                </div>
              </div>
              <div class="mt-2 sm:flex sm:justify-between">
                <div class="sm:flex">
                  <p
                      class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0"
                  >
                    {{ issue.event?.project?.name }}
                  </p>
                </div>
                <div
                    class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0"
                >
                  {{ formatDateTime(issue.created_at) }}
                </div>
              </div>
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>
    <EmptyState
        v-else
        title="Задачи отсутствуют"
        icon="heroicons:document-text"
        description="Все выполнено! Либо пока что не время..."
    />
    <div class="px-4 py-4 sm:px-6 border-t border-gray-200">
      <RouterLink
          to="/issues"
          class="cursor-pointer text-sm font-medium text-indigo-600 hover:text-indigo-500"
      >
        Посмотреть все задачи
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { httpClient, type Issue } from "@/api";
import { EmptyState } from "@/components/projects/settings/notification";
import { formatDateTime, getReadableIssueStatus } from '@/utils';
import { computed, onMounted, ref } from "vue";

const issues = ref<Issue[]>([]);

const getStatusClass = (status: string) => {
  switch (status) {
    case 'open':
      return 'bg-yellow-100 text-yellow-800';
    case 'resolved':
      return 'bg-green-100 text-green-800';
    case 'in_progress':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
const computedIssues = computed((): Issue[] => {
  if (issues.value.length) {
    return issues.value.map(issue => ({
      ...issue,
      statusClass: getStatusClass(issue.status),
      status: getReadableIssueStatus(issue.status) as any,
    }) 
  )}

  return [];
});

onMounted(async () => {
  issues.value = await httpClient.get<Issue[]>('/issues/dashboard');
});
</script>
