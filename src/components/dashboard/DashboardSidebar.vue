<template>
  <aside class="flex flex-col w-64 border-r border-gray-200 bg-white h-full">
    <div class="flex items-center h-16 px-4 border-b border-gray-200">
      <div class="flex items-center">
        <div class="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-indigo-600 text-white">
          <span class="text-lg font-medium">FT</span>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-gray-900">Финтехсервис</p>
          <p class="text-xs font-medium text-gray-500">Организация</p>
        </div>
      </div>
    </div>

    <nav class="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
      <RouterLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.to"
          custom
          v-slot="{ isActive }"
      >
        <a
            :href="item.to"
            :class="[
            isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50',
            'group flex items-center px-3 py-2 text-sm font-medium rounded-md'
          ]"
        >
          <Icon
              :icon="item.icon"
              :class="[
              isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500',
              'mr-3 h-5 w-5'
            ]"
          />
          {{ item.name }}
        </a>
      </RouterLink>
    </nav>

    <div class="px-3 py-4 border-t border-gray-200">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Projects</span>
        <button class="text-gray-400 hover:text-gray-500">
          <Icon icon="heroicons:plus" class="h-4 w-4"/>
        </button>
      </div>
      <div class="space-y-1">
        <a
            v-for="project in projects"
            :key="project.id"
            href="#"
            class="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50"
        >
          <span
              class="w-2.5 h-2.5 mr-3 rounded-full"
              :class="project.color"
          />
          {{ project.name }}
        </a>
      </div>
    </div>

    <div class="px-3 py-4 border-t border-gray-200">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Teams</span>
        <RouterLink
            to="/teams/create"
            class="text-gray-400 hover:text-gray-500"
        >
          <Icon icon="heroicons:plus" class="h-4 w-4"/>
        </RouterLink>
      </div>
      <div class="space-y-1">
        <RouterLink
            v-for="team in teams"
            :key="team.id"
            :to="`/teams/${team.slug}`"
            custom
            v-slot="{ isActive }"
        >
          <a
              :class="[
              isActive ? 'bg-gray-100' : '',
              'group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50'
            ]"
          >
            <span class="w-2.5 h-2.5 mr-3 rounded-full bg-gray-400"/>
            {{ team.name }}
          </a>
        </RouterLink>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import {Icon} from "@iconify/vue";
import {useTeamsStore} from "../../stores";
import {storeToRefs} from "pinia";
import {onMounted} from "vue";

const navigation = [
  {name: 'Dashboard', to: '/', icon: 'heroicons:home'},
  {name: 'Issues', to: '/issues', icon: 'heroicons:document-text'},
  {name: 'Teams', to: '/teams', icon: 'heroicons:users'},
  {name: 'Settings', to: '/settings', icon: 'heroicons:cog-8-tooth'},
  {name: 'Security', to: '/security', icon: 'heroicons:shield-check'},
];

const projects = [
  {id: 1, name: 'Web App', color: 'bg-indigo-500'},
  {id: 2, name: 'Mobile App', color: 'bg-green-500'},
];

const teamsStore = useTeamsStore()
const {teams} = storeToRefs(teamsStore);

onMounted(async () => {
  await teamsStore.fetchTeams();
})

</script>