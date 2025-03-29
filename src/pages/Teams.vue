<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Команды</h1>
        <RouterLink
            to="/teams/create"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Icon icon="heroicons:plus" class="-ml-1 mr-2 h-5 w-5"/>
          Создать команду
        </RouterLink>
      </div>

      <div class="bg-white shadow rounded-lg overflow-hidden">
        <ul v-if="isLoadingTeams" class="divide-y divide-gray-200">
          <li v-for="i in 5" :key="`skeleton-${i}`" class="px-4 py-4 sm:px-6">
            <div class="flex items-center space-x-4 animate-pulse">
              <div class="flex-shrink-0 h-10 w-10 rounded-md bg-gray-200"></div>
              <div class="flex-1 min-w-0 space-y-2">
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                <div class="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            </div>
          </li>
        </ul>

        <ul v-else class="divide-y divide-gray-200">
          <li v-for="team in teams" :key="team.id">
            <RouterLink
                :to="`/teams/${team.slug}`"
                class="block hover:bg-gray-50 px-4 py-4 sm:px-6"
            >
              <div class="flex items-center space-x-4">
                <div
                    class="flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center text-white font-medium"
                    :class="getTeamColor(team.name)"
                >
                  {{ getFirstLetter(team.name) }}
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-medium text-indigo-600 truncate">
                      {{ team.name }}
                    </p>
                  </div>
                  <div class="mt-1">
                    <p class="text-sm text-gray-500 truncate">
                      {{ team.slug }}
                    </p>
                  </div>
                </div>
              </div>
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from '../layouts/DashboardLayout.vue';
import {Icon} from "@iconify/vue";
import {useTeamsStore} from "../stores";
import {storeToRefs} from "pinia";

const teamsStore = useTeamsStore()
const {teams, isLoadingTeams} = storeToRefs(teamsStore);

const getFirstLetter = (name: string) => {
  return name.trim().charAt(0).toUpperCase();
};

const getTeamColor = (name: string) => {
  const colors = [
    'bg-indigo-500', 'bg-indigo-600',
    'bg-green-500', 'bg-green-600',
    'bg-emerald-500', 'bg-emerald-600',
    'bg-teal-500', 'bg-teal-600',
    'bg-cyan-500', 'bg-cyan-600',
    'bg-blue-500', 'bg-blue-600',
    'bg-sky-500', 'bg-sky-600',
    'bg-violet-500', 'bg-violet-600',
    'bg-purple-500', 'bg-purple-600',
    'bg-fuchsia-500', 'bg-fuchsia-600',
    'bg-pink-500', 'bg-pink-600',
    'bg-rose-500', 'bg-rose-600',
    'bg-red-500', 'bg-red-600',
    'bg-orange-500', 'bg-orange-600',
    'bg-amber-500', 'bg-amber-600',
    'bg-yellow-500', 'bg-yellow-600',
    'bg-lime-500', 'bg-lime-600'
  ];

  const hash = name.split('').reduce((acc, char, index) => {
    return char.charCodeAt(0) * (index + 1) + ((acc << 5) - acc);
  }, 0);

  const index = Math.abs(hash) % colors.length;
  return colors[index];
};
</script>