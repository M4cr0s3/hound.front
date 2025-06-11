<script setup lang="ts">
import IssueActivityFeed from "@/components/issue/detail/IssueActivityFeed.vue";
import IssueAssignees from "@/components/issue/detail/IssueAssignees.vue";
import IssueCommentsTab from "@/components/issue/detail/IssueCommentsTab.vue";
import IssueDescription from "@/components/issue/detail/IssueDescription.vue";
import IssueHeader from "@/components/issue/detail/IssueHeader.vue";
import IssueMeta from "@/components/issue/detail/IssueMeta.vue";
import IssueSidebar from "@/components/issue/detail/IssueSidebar.vue";
import IssueTabs from "@/components/issue/detail/IssueTabs.vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import { useIssuesStore } from "@/stores";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";

const {id} = defineProps<{
  id: string;
}>()

const store = useIssuesStore();

const { fetchIssue } = store;
const { issue } = storeToRefs(store);
const activeTab = ref<'comments' | 'activities'>('comments');

const changeTab = (tab: 'comments' | 'activities') => {
  activeTab.value = tab;
};

onMounted(async () => {
  await fetchIssue(+id);
  console.log(issue)
})

</script>

<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <IssueHeader :issue="issue"/>

      <div class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6" v-if="issue?.id">
        <div class="lg:col-span-2 space-y-6">
          <IssueDescription :event="issue.event"/>

          <IssueTabs
              :active-tab="activeTab"
              @tab-change="changeTab"
          />

          <template v-if="activeTab === 'comments'">
            <IssueCommentsTab
                :issue-id="issue.id"
                :comments="issue?.comments"
                @comment-added="fetchIssue(issue.id)"
                @comment-deleted="fetchIssue(issue.id)"
            />
          </template>

          <template v-else-if="activeTab === 'activities'">
            <IssueActivityFeed :activities="issue.activities"/>
          </template>
        </div>

        <div class="lg:col-span-1">
          <IssueSidebar :issue="issue"/>

          <IssueAssignees :assignees="issue.assignees"/>

          <IssueMeta :issue="issue"/>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
<style scoped>

</style>