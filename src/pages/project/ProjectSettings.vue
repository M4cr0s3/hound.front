<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8" v-if="project">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div class="flex items-center space-x-4">
            <div class="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-md">
              <Icon :icon="getProjectIcon(project.platform)" class="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ project.name }}</h1>
              <div class="flex items-center space-x-3 mt-1">
                <span class="text-sm text-gray-500">{{ project.slug }}</span>
                <Badge variant="secondary" class="flex items-center">
                  <Icon icon="heroicons:computer-desktop" class="mr-1 h-4 w-4" />
                  {{ project.platform }}
                </Badge>
              </div>
            </div>
          </div>
          <RouterLink
              :to="`/projects/${project.slug}`"
              class="inline-flex items-center px-4 py-2 border bg-white border-gray-200 text-gray-700 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200"
          >
            <Icon icon="heroicons:arrow-left" class="mr-2 h-4 w-4" />
            Вернуться к проекту
          </RouterLink>
        </div>

        <nav class="mt-8">
          <div class="border-b border-gray-200">
            <div class="flex space-x-8 overflow-x-auto pb-px scrollbar-hide">
              <RouterLink
                  v-for="tab in tabs"
                  :key="tab.name"
                  :to="`/projects/${project.slug}/settings/${tab.path}`"
                  class="whitespace-nowrap px-1 py-3 text-sm font-medium border-b-2 transition-colors relative"
                  :class="{
                  'border-indigo-500 text-indigo-600': $route.path.includes(tab.path),
                  'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': !$route.path.includes(tab.path),
                }"
              >
                {{ tab.name }}
              </RouterLink>
            </div>
          </div>
        </nav>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <RouterView :project="project" />
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import { useProjectsStore } from '@/stores';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';
import {Badge} from '@/components/ui';
import { PLATFORMS } from '@/data';

const route = useRoute();
const store = useProjectsStore();
const { project } = storeToRefs(store);

const tabs = [
  { name: 'Основные', path: 'general', icon: 'heroicons:cog' },
  { name: 'Health Check', path: 'healthcheck', icon: 'heroicons:heart' },
  { name: 'Безопасность', path: 'security', icon: 'heroicons:lock-closed' },
  { name: 'Уведомления', path: 'notification', icon: 'heroicons:bell' },
  { name: 'Удаление', path: 'delete', icon: 'heroicons:trash' },
];

const getProjectIcon = (platform: string) => {
  return PLATFORMS.find(p => p.name === platform)?.icon;
};

onMounted(async () => {
  await store.fetchProject(route.params.slug as string);
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.router-link-active {
  position: relative;
}

.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #6366f1;
  transform-origin: bottom center;
  animation: scaleIn 0.3s ease-out forwards;
}

@keyframes scaleIn {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}
</style>