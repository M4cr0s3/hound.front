<script setup lang="ts">
import type { Issue } from "@/api";
import IssueItem from "@/components/projects/IssueItem.vue";
import { EmptyState } from "@/components/projects/settings/notification";
import { Badge, Panel } from "@/components/ui";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import { useProjectsStore } from "@/stores";
import { getProjectIcon } from "@/utils";
import { Icon } from "@iconify/vue";
import { onMounted } from "vue";

const { slug } = defineProps<{
  slug: string
}>()

const projectStore = useProjectsStore();

onMounted(async () => {
  await projectStore.fetchProject(slug)
})
</script>

<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4" v-if="projectStore.project.id">
        <div class="flex items-start space-x-4">
          <div class="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-md">
            <Icon :icon="getProjectIcon(projectStore.project.platform)" class="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ projectStore.project.name }}</h1>
            <div class="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="primary" class="flex items-center">
                <Icon icon="heroicons:user-group" class="mr-1 h-4 w-4" />
                {{ projectStore.project.team?.name }}
              </Badge>
              <Badge variant="secondary" class="flex items-center">
                <Icon icon="heroicons:computer-desktop" class="mr-1 h-4 w-4" />
                {{ projectStore.project.platform }}
              </Badge>
            </div>
          </div>
        </div>
        <div class="flex space-x-3">
          <RouterLink :to="`/projects/${projectStore.project.slug}/settings/general`"
            class="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <Icon icon="heroicons:cog-6-tooth" class="mr-2 h-4 w-4" />
            Настройки
          </RouterLink>
        </div>
      </div>

      <Panel title="Последние проблемы">
        <IssueItem v-for="issue in projectStore.project.issues as Issue[]" :key="issue.id" :issue="issue"
          class="hover:bg-gray-50 transition-colors duration-150" :project-slug="projectStore.project.slug" />
        <EmptyState v-if="!projectStore.project.issues?.length" title="Проблем не найдено" icon="heroicons:check-badge"
          description="Отличная работа! Активных проблем нет." class="p-6" />
      </Panel>
    </div>
  </DashboardLayout>
</template>

<style scoped></style>