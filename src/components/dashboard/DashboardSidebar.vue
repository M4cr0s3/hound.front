<template>
  <aside class="flex flex-col w-64 border-r border-gray-200 bg-white h-full">
    <div class="flex items-center h-16 px-4 border-b border-gray-200">
      <div class="flex items-center">
        <div class="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-indigo-600 text-white">
          <span class="text-lg font-medium">H</span>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-gray-900">Hound</p>
        </div>
      </div>
    </div>

    <nav class="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
      <RouterLink v-for="item in navigation" :key="item.name" :to="item.to" v-slot="{ isActive }">
        <span :class="[
          isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50',
          'group flex items-center px-3 py-2 text-sm font-medium rounded-md'
        ]">
          <Icon :icon="item.icon" :class="[
            isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500',
            'mr-3 h-5 w-5'
          ]" />
          {{ item.name }}
        </span>
      </RouterLink>
    </nav>

    <div class="px-3 py-4 border-t border-gray-200">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Проекты</span>
        <RouterLink to="/projects/create" class="text-gray-400 hover:text-gray-500">
          <Icon icon="heroicons:plus" class="h-4 w-4" />
        </RouterLink>
      </div>
      <div class="space-y-1">
        <template v-if="isLoadingProjects">
          <div v-for="i in 3" :key="`project-skeleton-${i}`" class="animate-pulse">
            <div class="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md">
              <span class="w-2.5 h-2.5 mr-3 rounded-full bg-gray-200"></span>
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </template>
        <template v-else>
          <RouterLink v-for="project in projects" :key="project.id"
            class="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50"
            :to="`/projects/${project.slug}`">
            <span class="w-2.5 h-2.5 mr-3 rounded-full" :class="getColor(project.name)" />
            {{ project.name }}
          </RouterLink>
        </template>
      </div>
    </div>

    <div class="px-3 py-4 border-t border-gray-200">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Команды</span>
        <RouterLink to="/teams/create" class="text-gray-400 hover:text-gray-500">
          <Icon icon="heroicons:plus" class="h-4 w-4" />
        </RouterLink>
      </div>
      <div class="space-y-1">
        <template v-if="isLoadingTeams">
          <div v-for="i in 3" :key="`team-skeleton-${i}`" class="animate-pulse">
            <div class="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md">
              <span class="w-2.5 h-2.5 mr-3 rounded-full bg-gray-200"></span>
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </template>
        <template v-else>
          <RouterLink v-for="team in teams" :key="team.id"
            class="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50"
            :to="`/teams/${team.slug}`">
            <span class="w-2.5 h-2.5 mr-3 rounded-full" :class="getColor(team.name)" />
            {{ team.name }}
          </RouterLink>
        </template>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useColor } from "@/composables";
import { useProjectsStore, useTeamsStore } from "@/stores";
import { Icon } from "@iconify/vue";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";


const navigation = [
  { name: 'Dashboard', to: '/dashboard', icon: 'heroicons:home' },
  { name: 'Задачи', to: '/issues', icon: 'heroicons:document-text' },
  { name: 'Команды', to: '/teams', icon: 'heroicons:users' },
  { name: 'Проекты', to: '/projects', icon: 'heroicons:folder-open' },
  { name: 'Пользователи', to: '/users', icon: 'heroicons:user-group' },
];

const projectsStore = useProjectsStore();
const { projects, isLoading: isLoadingProjects } = storeToRefs(projectsStore);

const teamsStore = useTeamsStore()
const { teams, isLoadingTeams } = storeToRefs(teamsStore);

const { getColor } = useColor();

onMounted(async () => {
  await projectsStore.fetchProjects();
  await teamsStore.fetchTeams();
})

</script>