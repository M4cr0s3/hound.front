<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="mb-6" v-if="project">
        <div class="flex items-center space-x-4">
          <ProjectAvatar :project="project" size="lg"/>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ project.name }}</h1>
            <p class="text-sm text-gray-500">{{ project.slug }}</p>
          </div>
        </div>

        <nav class="flex space-x-8 mt-6 border-b border-gray-200">
          <RouterLink
              v-for="tab in tabs"
              :key="tab.name"
              :to="`/projects/${project.slug}/settings/${tab.path}`"
              class="px-1 py-4 text-sm font-medium border-b-2 transition-colors"
              :class="{
              'border-indigo-500 text-indigo-600': $route.path.includes(tab.path),
              'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': !$route.path.includes(tab.path)
            }"
          >
            {{ tab.name }}
          </RouterLink>
        </nav>
      </div>

      <div class="bg-white shadow rounded-lg divide-y divide-gray-200">
        <RouterView :project="project"/>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from '../layouts/DashboardLayout.vue';
import ProjectAvatar from '../components/projects/ProjectAvatar.vue';
import {useProjectsStore} from "../stores";
import {storeToRefs} from "pinia";
import {onMounted} from "vue";
import {useRoute} from "vue-router";

const route = useRoute();

const store = useProjectsStore();
const {project} = storeToRefs(store);

const tabs = [
  {name: 'Основные', path: 'general'},
  {name: 'Alerts', path: 'alerts'},
  {name: 'Environments', path: 'environments'},
  {name: 'Tags', path: 'tags'},
  {name: 'Issue Tracking', path: 'issue-tracking'},
  {name: 'Security & Privacy', path: 'security'},
  {name: 'Integrations', path: 'integrations'},
  {name: 'Ownership', path: 'ownership'},
  {name: 'Data Forwarding', path: 'data-forwarding'},
  {name: 'Advanced', path: 'advanced'}
];

onMounted(async () => {
  await store.fetchProject(route.params.slug);
})

</script>