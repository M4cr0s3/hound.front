<template>
  <div class="border-b border-gray-200 pb-4">
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ issue.title }}
          <span class="text-gray-500">#{{ issue.id }}</span>
        </h1>

        <div class="mt-2 flex items-center space-x-4">
          <StatusBadge :status="issue.status"/>
          <PriorityBadge :priority="issue.priority"/>
        </div>
      </div>

      <div class="flex space-x-3">
        <Button
            v-if="issue.status !== IssueStatus.Resolved"
            variant="secondary"
            @click="issuesStore.updateIssueStatus(issue.id, IssueStatus.Resolved)"
        >
          Решить
        </Button>

        <DropdownMenu
            :actions
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {type ActionItem, Button, DropdownMenu, PriorityBadge, StatusBadge} from '@/components/ui';
import {type Issue, IssueStatus} from '@/api';
import {useIssuesStore} from "@/stores";
import {useRouter} from "vue-router";
import {ROUTES} from "@/router/routes.ts";

const props = defineProps<{
  issue: Issue;
}>();

const router = useRouter();
const issuesStore = useIssuesStore();

const actions: ActionItem[] = [
  {
    icon: 'heroicons:lock-open',
    iconClass: 'text-gray-700',
    key: 'open',
    label: 'Открыть',
    handler: async () => {
      await issuesStore.updateIssueStatus(props.issue.id, IssueStatus.Open);
    },
    visible: () => props.issue.status !== IssueStatus.Open
  },
  {
    icon: 'heroicons:lock-closed',
    iconClass: 'text-gray-700',
    key: 'lock',
    label: 'Закрыть',
    handler: async () => {
      await issuesStore.updateIssueStatus(props.issue.id, IssueStatus.Closed);
    },
    visible: () => props.issue.status !== IssueStatus.Closed
  },
  {
    icon: 'heroicons:trash',
    iconClass: 'text-red-500',
    key: 'delete',
    label: 'Удалить',
    handler: async () => {
      await issuesStore.deleteIssue(props.issue.id);
      await router.push(ROUTES.ISSUE.INDEX);
    },
  }
]

</script>