<template>
  <div class="kanban-board overflow-x-auto">
    <div class="flex flex-col sm:flex-row gap-4">
      <div
          v-for="status in statuses"
          :key="status"
          class="kanban-column bg-gray-100 rounded-lg p-4 w-full sm:w-64 flex-shrink-0"
      >
        <h3 class="text-sm font-semibold text-gray-700 mb-2">
          {{ status.replace('_', ' ').toUpperCase() }}
          ({{ filteredIssues(status).length }})
        </h3>
        <draggable
            :list="filteredIssues(status)"
            :group="{ name: 'issues', pull: true, put: true }"
            item-key="id"
            class="space-y-2 min-h-[100px]"
            @end="onDragEnd(status, $event)"
        >
          <template #item="{ element: issue }">
            <div
                class="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md"
                @click="emit('select', issue)"
            >
              <h4 class="text-sm font-medium text-gray-900">{{ issue.title }}</h4>
              <div class="mt-2 text-xs text-gray-600 space-y-1">
                <p>ID: {{ issue.event_id }}</p>
                <p>
                  Приоритет:
                  <span
                      :class="{
                      'bg-red-100 text-red-800': issue.priority === IssuePriority.Critical,
                      'bg-orange-100 text-orange-800': issue.priority === IssuePriority.High,
                      'bg-yellow-100 text-yellow-800': issue.priority === IssuePriority.Medium,
                      'bg-green-100 text-green-800': issue.priority === IssuePriority.Low,
                    }"
                      class="px-1.5 py-0.5 rounded-full text-xs"
                  >
                    {{ issue.priority.toUpperCase() }}
                  </span>
                </p>
                <p v-if="issue.due_date">
                  Срок: {{ new Date(issue.due_date).toLocaleDateString('ru-RU') }}
                </p>
                <p v-if="issue.assignees?.length">
                  Назначен(а\ы): {{ issue.assignees.map((user) => user.name).join(', ') }}
                </p>
                <div v-if="issue.tags?.length" class="flex gap-1 mt-1">
                  <span
                      v-for="tag in issue.tags"
                      :key="tag"
                      class="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full text-xs"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import draggable from 'vuedraggable';
import {useIssuesStore} from '@/stores/issues';
import {IssueStatus, IssuePriority, type Issue} from '@/api';

const props = defineProps<{
  issues: Issue[];
  isLoading: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', issue: Issue): void;
}>();

const issuesStore = useIssuesStore();

const statuses = Object.values(IssueStatus);

const filteredIssues = (status: IssueStatus) => {
  return props.issues.filter((issue) => issue.status === status);
};

const onDragEnd = async (status: IssueStatus, event: any) => {
  const {oldIndex, to} = event;
  const targetStatus = to.parentElement.dataset.status as IssueStatus;
  const issue = filteredIssues(status)[oldIndex];

  if (issue.status !== targetStatus) {
    await issuesStore.updateIssueStatus(issue.id, targetStatus);
    await issuesStore.fetchIssues();
  }
};

const setColumnStatus = () => {
  document.querySelectorAll('.kanban-column').forEach((column, index) => {
    column.setAttribute('data-status', statuses[index]);
  });
};

onMounted(setColumnStatus);
</script>

<style scoped>
.kanban-board {
  display: flex;
  gap: 1rem;
  padding: 1rem;
}

.kanban-column {
  background: #f4f5f7;
  border-radius: 8px;
  padding: 1rem;
  width: 250px;
  min-height: 200px;
}

@media (max-width: 640px) {
  .kanban-board {
    flex-direction: column;
  }

  .kanban-column {
    width: 100%;
  }
}
</style>