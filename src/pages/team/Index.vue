<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Команды</h1>
        <RouterLink
            to="/teams/create"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Icon
              icon="heroicons:plus"
              class="-ml-1 mr-2 h-5 w-5"
          />
          Создать команду
        </RouterLink>
      </div>

      <div class="bg-white shadow rounded-lg overflow-hidden">
        <ul
            v-if="isLoadingTeams"
            class="divide-y divide-gray-200"
        >
          <li
              v-for="i in 5"
              :key="`skeleton-${i}`"
              class="px-4 py-4 sm:px-6"
          >
            <div class="flex items-center space-x-4 animate-pulse">
              <div class="flex-shrink-0 h-10 w-10 rounded-md bg-gray-200"></div>
              <div class="flex-1 min-w-0 space-y-2">
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                <div class="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            </div>
          </li>
        </ul>

        <ul
            v-else
            class="divide-y divide-gray-200"
        >
          <li
              v-for="team in teams"
              :key="team.id"
          >
            <RouterLink
                :to="`/teams/${team.slug}`"
                class="block hover:bg-gray-50 px-4 py-4 sm:px-6"
            >
              <div class="flex items-center space-x-4">
                <div
                    class="flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center text-white font-medium"
                    :class="getColor(team.name)"
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
                <div class="flex items-center space-x-4">
                  <RouterLink
                      :to="`teams/${team.slug}/edit`"
                      class="text-gray-400 hover:text-gray-500"
                  >
                    <Icon
                        icon="heroicons-outline:pencil"
                        class="h-5 w-5 cursor-pointer"
                    />
                  </RouterLink>
                </div>
                <div class="flex items-center space-x-4">
                  <button
                      class="text-gray-400 hover:text-red-500 cursor-pointer"
                      @click.prevent="teamsStore.destroy(team.id)"
                  >
                    <Icon
                        icon="heroicons:trash"
                        class="h-5 w-5"
                    />
                  </button>
                </div>
              </div>
            </RouterLink>
          </li>
        </ul>

        <EmptyState
            v-if="!teamsStore.teams.length && !isLoadingTeams"
            title="Команды отсутствуют"
            icon="heroicons:users"
            description="Команды не найдены"
        />

      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { EmptyState } from "@/components/projects/settings/notification";
import { useColor } from '@/composables';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import { useTeamsStore } from '@/stores';
import { Icon } from '@iconify/vue';
import { storeToRefs } from 'pinia';

const teamsStore = useTeamsStore();
const {teams, isLoadingTeams} = storeToRefs(teamsStore);

const {getColor} = useColor();

const getFirstLetter = (name: string) => {
  return name.charAt(0).toUpperCase();
};
</script>
