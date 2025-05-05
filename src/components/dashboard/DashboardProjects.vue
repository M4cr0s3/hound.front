<template>
  <div class="bg-white shadow rounded-lg">
    <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
      <h3 class="text-lg leading-6 font-medium text-gray-900">Ваши проекты</h3>
    </div>
    <div class="bg-white overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
        <tr>
          <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Проект
          </th>
          <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Ошибки (24ч)
          </th>
          <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Команда
          </th>
          <th
              scope="col"
              class="relative px-6 py-3"
          >
            <span class="sr-only">Редактировать</span>
          </th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
        <tr
            v-for="project in computedProjects"
            :key="project.id"
            class="hover:bg-gray-50"
        >
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div
                  class="flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center"
                  :class="project.bgColor"
              >
                <Icon
                    :icon="project.icon"
                    class="h-6 w-6 text-white"
                />
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">
                  {{ project.name }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ project.platform }}
                </div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">{{ project.issues }}</div>
            <div class="text-sm text-gray-500">
              {{ project.resolved }} решено
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <div class="flex -space-x-2">
              <Avatar
                  v-for="member in project.team.members"
                  :key="member.id"
                  :name="member.name"
              />
            </div>
          </td>
          <td
              class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
          >
            <RouterLink
                :to="`/projects/${project.slug}/settings/general`"
                class="text-indigo-600 hover:text-indigo-900"
            >
              Настройки
            </RouterLink>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Icon} from '@iconify/vue';
import {computed, onMounted, ref} from "vue";
import {httpClient, type Project} from "@/api";
import {Avatar} from "@/components/ui";
import {PLATFORMS} from "@/data";
import {useColor} from "@/composables";

const projects = ref<Project[]>([]);

const computedProjects = computed(() => {
  if (projects.value.length) {
    return projects.value.map((project) => ({
      ...project,
      icon: PLATFORMS.find(platform => platform.name === project.platform)?.icon || '',
      bgColor: useColor(),
    }));
  }

  return [];
});

const fetchProjects = async () => {
  projects.value = await httpClient.get('/projects/dashboard');
};

onMounted(async () => {
  await fetchProjects();
})
</script>
