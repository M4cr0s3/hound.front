<script setup lang="ts">
import {useIssuesStore} from "@/stores";
import {onMounted, ref} from "vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import IssueHeader from "@/components/issue/detail/IssueHeader.vue";
import IssueDescription from "@/components/issue/detail/IssueDescription.vue";
import IssueCommentsTab from "@/components/issue/detail/IssueCommentsTab.vue";
import IssueSidebar from "@/components/issue/detail/IssueSidebar.vue";
import IssueTabs from "@/components/issue/detail/IssueTabs.vue";
import IssueAssignees from "@/components/issue/detail/IssueAssignees.vue";
import IssueMeta from "@/components/issue/detail/IssueMeta.vue";
import IssueActivityFeed from "@/components/issue/detail/IssueActivityFeed.vue";

const {id} = defineProps<{
  id: string;
}>()

const issuesStore = useIssuesStore();
const activeTab = ref<'comments' | 'activities'>('comments');

const changeTab = (tab: 'comments' | 'activities') => {
  activeTab.value = tab;
};

onMounted(async () => {
  await issuesStore.fetchIssue(id);
})

</script>

<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <IssueHeader :issue="issuesStore.issue"/>

      <div class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6" v-if="issuesStore.issue?.id">
        <div class="lg:col-span-2 space-y-6">
          <IssueDescription :event="issuesStore.issue.event"/>

          <IssueTabs
              :active-tab="activeTab"
              @tab-change="changeTab"
          />

          <template v-if="activeTab === 'comments'">
            <IssueCommentsTab
                :issue-id="issuesStore.issue.id"
                :comments="issuesStore.issue?.comments"
                @comment-added="issuesStore.fetchIssue(issuesStore.issue.id)"
                @comment-deleted="issuesStore.fetchIssue(issuesStore.issue.id)"
            />
          </template>

          <template v-else-if="activeTab === 'activities'">
            <IssueActivityFeed :activities="issuesStore.issue.activities"/>
          </template>
        </div>

        <div class="lg:col-span-1">
          <IssueSidebar :issue="issuesStore.issue"/>

          <IssueAssignees :assignees="issuesStore.issue.assignees"/>

          <IssueMeta :issue="issuesStore.issue"/>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
<style scoped>

</style>