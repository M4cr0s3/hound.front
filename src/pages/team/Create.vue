<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Создание новой команды
          </h3>
        </div>

        <form
            @submit.prevent="teamsStore.create(form)"
            class="px-4 py-5 sm:p-6"
        >
          <div class="space-y-6">
            <InputField
                id="team-name"
                v-model="form.name"
                label="Название команды"
                type="text"
                placeholder="backend"
                required
                :error="errors.name"
            />

            <InputField
                id="team-slug"
                v-model="form.slug"
                label="Slug команды (опционально)"
                type="text"
                placeholder="backend"
                :error="errors.slug"
            >
              <template #description>
                <p class="mt-2 text-sm text-gray-500">
                  Если не указан, будет сгенерирован автоматически
                </p>
              </template>
            </InputField>

            <div class="flex justify-end space-x-3">
              <button
                  type="button"
                  @click="$router.push(ROUTES.TEAM.INDEX)"
                  class="inline-flex cursor-pointer items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Отмена
              </button>
              <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="inline-flex cursor-pointer items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="!isSubmitting">Создать команду</span>
                <svg
                    v-else
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                  <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                  ></circle>
                  <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from '../../layouts/DashboardLayout.vue';
import {useTeam} from '../../composables';
import {InputField} from '../../components/ui';
import {ROUTES} from '../../router/routes.ts';
import {useTeamsStore} from '../../stores';

const teamsStore = useTeamsStore();

const {form, errors, isSubmitting} = useTeam();
</script>
