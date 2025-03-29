<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Создайте новый проект</h3>
        </div>

        <form class="px-4 py-5 sm:p-6 space-y-6" @submit.prevent="projectsStore.create(form)">
          <InputField
              id="project-name"
              label="Название проекта"
              v-model="form.name"
              placeholder="project"
              required
          />

          <InputField
              id="project-slug"
              label="Слаг проекта"
              v-model="form.slug"
              placeholder="slug"
          />

          <SelectField
              v-model="form.team_id"
              :options="teamsStore.teams"
              label="Команда"
              placeholder="Выберите команду"
          />

          <PlatformCard
              v-model="form.platform"
          />

          <div class="flex justify-end space-x-3">
            <button
                type="button"
                @click="$router.push(ROUTES.PROJECTS)"
                class="inline-flex cursor-pointer items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Отмена
            </button>
            <button
                type="submit"
                :disabled="projectsStore.isLoading"
                class="inline-flex cursor-pointer items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!projectsStore.isLoading">Создать команду</span>
              <svg v-else class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                   fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from '../layouts/DashboardLayout.vue';
import InputField from '../components/ui/InputField.vue';
import PlatformCard from '../components/projects/PlatformCard.vue';
import {ref} from 'vue';
import {ROUTES} from "../router/routes.ts";
import type {CreateProjectBody} from "../api";
import {useProjectsStore, useTeamsStore} from "../stores";
import SelectField from "../components/ui/SelectField.vue";

const form = ref<CreateProjectBody>({
  name: '',
  slug: '',
  team_id: 0,
  platform: ''
});

const projectsStore = useProjectsStore();
const teamsStore = useTeamsStore();

</script>