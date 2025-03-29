<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Проекты</h1>
        <RouterLink
            to="/projects/create"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Icon icon="heroicons:plus" class="-ml-1 mr-2 h-5 w-5"/>
          Создать проект
        </RouterLink>
      </div>

      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div v-if="isLoading" class="divide-y divide-gray-200">
          <div
              v-for="i in 5"
              :key="`project-skeleton-${i}`"
              class="px-4 py-4 sm:px-6"
          >
            <div class="flex items-center justify-between animate-pulse">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0 h-10 w-10 rounded-md bg-gray-200"></div>
                <div class="space-y-2">
                  <div class="h-4 bg-gray-200 rounded w-32"></div>
                  <div class="h-3 bg-gray-100 rounded w-24"></div>
                </div>
              </div>
              <div class="h-5 w-5 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        <div v-else class="divide-y divide-gray-200">
          <div
              v-for="project in projects"
              :key="project.id"
              class="px-4 py-4 sm:px-6 hover:bg-gray-50"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0 h-10 w-10 rounded-md bg-indigo-100 flex items-center justify-center">
                  <Icon icon="heroicons:folder" class="h-6 w-6 text-indigo-600"/>
                </div>
                <div>
                  <RouterLink
                      :to="`/projects/${project.slug}`"
                      class="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                  >
                    {{ project.name }}
                  </RouterLink>
                  <p class="text-sm text-gray-500 mt-1">
                    {{ project.platform }}
                  </p>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <RouterLink
                    :to="`projects/${project.slug}/settings/general`"
                    class="text-gray-400 hover:text-gray-500"
                >
                  <Icon icon="heroicons:cog-6-tooth" class="h-5 w-5"/>
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from '../layouts/DashboardLayout.vue';
import {Icon} from '@iconify/vue';
import {useProjectsStore} from "../stores";
import {storeToRefs} from "pinia";

const {projects, isLoading} = storeToRefs(useProjectsStore());
</script>