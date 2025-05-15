<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Проекты</h1>
        <RouterLink
            to="/projects/create"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Icon
              icon="heroicons:plus"
              class="-ml-1 mr-2 h-5 w-5"
          />
          Создать проект
        </RouterLink>
      </div>

      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div
            v-if="isLoading"
            class="divide-y divide-gray-200"
        >
          <div
              v-for="i in 5"
              :key="`project-skeleton-${i}`"
              class="px-4 py-4 sm:px-6"
          >
            <div class="flex items-center justify-between animate-pulse">
              <div class="flex items-center space-x-4">
                <div
                    class="flex-shrink-0 h-10 w-10 rounded-md bg-gray-200"
                ></div>
                <div class="space-y-2">
                  <div class="h-4 bg-gray-200 rounded w-32"></div>
                  <div class="h-3 bg-gray-100 rounded w-24"></div>
                </div>
              </div>
              <div class="h-5 w-5 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        <EmptyState
            v-else-if="!projects.length && !isLoading"
            title="Нет проектов"
            icon="heroicons:folder"
            description="Создайте свой первый проект."
        />

        <div
            v-else
            class="divide-y divide-gray-200"
        >
          <div
              v-for="project in projects"
              :key="project.id"
              class="px-4 py-4 sm:px-6"
          >
            <div class="flex flex-col space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div
                      class="flex-shrink-0 h-10 w-10 rounded-md bg-indigo-100 flex items-center justify-center"
                  >
                    <Icon
                        icon="heroicons:folder"
                        class="h-6 w-6 text-indigo-600"
                    />
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
                    <Icon
                        icon="heroicons:cog-6-tooth"
                        class="h-5 w-5"
                    />
                  </RouterLink>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div
                    class="p-4 bg-white rounded-xl border border-gray-100 shadow-xs hover:shadow-sm transition-shadow"
                >
                  <div class="flex items-center space-x-3">
                    <div class="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                      <Icon
                          icon="heroicons:chart-bar"
                          class="h-5 w-5"
                      />
                    </div>
                    <div>
                      <p
                          class="text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Всего событий
                      </p>
                      <p class="text-xl font-bold text-gray-900">
                        {{ project?.stats?.total_events.toLocaleString() }}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                    class="p-4 bg-white rounded-xl border border-gray-100 shadow-xs hover:shadow-sm transition-shadow"
                >
                  <div class="flex items-center space-x-3">
                    <div class="p-2 rounded-lg bg-red-50 text-red-600">
                      <Icon
                          icon="heroicons:exclamation-triangle"
                          class="h-5 w-5"
                      />
                    </div>
                    <div>
                      <p
                          class="text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Ошибки (24ч)
                      </p>
                      <p class="text-xl font-bold text-gray-900">
                        {{ project?.stats?.errors_last_day.toLocaleString() }}
                        <span
                            v-if="project.stats !== undefined"
                            class="text-xs font-normal ml-1"
                            :class="
														project?.stats?.errors_last_day > 0
															? 'text-red-500'
															: 'text-green-500'
													"
                        >
													{{ Math.abs(project.stats.error_rate_change) }}%
												</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div
                    class="p-4 bg-white rounded-xl border border-gray-100 shadow-xs hover:shadow-sm transition-shadow"
                >
                  <div class="flex items-center space-x-3">
                    <div class="p-2 rounded-lg bg-purple-50 text-purple-600">
                      <Icon
                          icon="heroicons:clock"
                          class="h-5 w-5"
                      />
                    </div>
                    <div>
                      <p
                          class="text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Время ответа
                      </p>
                      <p class="text-xl font-bold text-gray-900">
                        {{ project.stats?.avg_response_time.toFixed(2) }}ms
                        <span
                            class="text-xs font-normal ml-1"
                            :class="
														getResponseTimeStatus(project) === 'good'
															? 'text-green-500'
															: 'text-yellow-500'
													"
                        >
													<Icon
                              :icon="
															getResponseTimeStatus(project) === 'good'
																? 'heroicons:check-badge'
																: 'heroicons:exclamation-circle'
														"
                              class="h-3 w-3 inline"
                          />
												</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex justify-center mb-2">
                <Button
                    :to="`projects/${project.slug}/events`"
                >
                  Посмотреть все события
                </Button>
              </div>
              <template v-if="project.events_last_day?.length">
                <div class="h-42">
                  <EventsChart
                      :data="project.events_last_day"
                      :slug="project.slug"
                  />
                </div>
              </template>
              <EmptyState
                  v-else
                  title="События отсутствуют"
                  icon="heroicons:arrow-trending-up"
                  description="Пока что никаких событий не поступало..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { type Project } from '@/api';
import EventsChart from '@/components/charts/EventsChart.vue';
import { EmptyState } from "@/components/projects/settings/notification";
import { Button } from "@/components/ui";
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import { useProjectsStore } from '@/stores';
import { Icon } from '@iconify/vue';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const projectsStore = useProjectsStore();

const {isLoading, projects} = storeToRefs(projectsStore);

const getResponseTimeStatus = (project: Project) => {
  const avg_response_time = project.stats?.avg_response_time; 
  if(!avg_response_time) return 'undefined';
  return avg_response_time < 200 ? 'good' : 'warning';
};

onMounted(async () => {
  await projectsStore.fetchProjectsWithStats();
});
</script>
