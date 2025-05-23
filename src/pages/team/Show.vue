<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div class="flex items-center space-x-4">
          <div class="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-md">
            <Icon icon="heroicons:user-group" class="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900 tracking-tight animate-fade-in">
              {{ teamsStore.team.name }}
            </h1>
            <p class="text-sm text-gray-500 mt-1">Команда • {{ teamsStore.team.members.length }} участников</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-3">
          <RouterLink :to="`/teams/${teamsStore.team.slug}/edit`"
            class="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <Icon icon="heroicons:pencil-square" class="mr-2 h-4 w-4" />
            Редактировать
          </RouterLink>
          <button @click="deleteTeam" type="button"
            class="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-red-600 text-sm font-medium rounded-lg shadow-sm hover:bg-red-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
            <Icon icon="heroicons:trash" class="mr-2 h-4 w-4" />
            Удалить
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
         
          <Panel title="Основная информация">
             <div class="p-6">
              <dl class="space-y-4">
                <div class="flex items-start">
                  <dt class="flex-1 text-sm font-medium text-gray-500">Название команды</dt>
                  <dd class="text-base font-medium text-gray-900">{{ teamsStore.team.name }}</dd>
                </div>
                <div class="flex items-start">
                  <dt class="flex-1 text-sm font-medium text-gray-500">Идентификатор</dt>
                  <dd class="text-base font-medium text-gray-900">{{ teamsStore.team.slug }}</dd>
                </div>
              </dl>
              </div>
          </Panel>

          <Panel title="Проекты команды">
            <template #button>
              <Badge variant="primary">
                {{ teamsStore.team.projects.length }} проектов
              </Badge>
            </template>
            <div class="divide-y divide-gray-100">
              <RouterLink v-if="teamsStore.team.projects.length" v-for="project in teamsStore.team.projects" :key="project.id" :to="`/projects/${project.slug}`"
                class="block p-5 hover:bg-gray-50 transition-colors duration-150">
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0 p-2 bg-indigo-50 rounded-lg">
                    <Icon :icon="getProjectIcon(project.platform)" class="w-6 h-6 text-indigo-600" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-base font-medium text-gray-900 truncate">{{ project.name }}</p>
                    <p class="text-sm text-gray-500 truncate">{{ project.platform }}</p>
                  </div>
                  <div>
                    <Icon icon="heroicons:chevron-right" class="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </RouterLink>
              <EmptyState v-else title="Нет проектов" icon="heroicons:folder-open"
              description="Добавьте команду в проект." class="p-6" small />
            </div>
          </Panel>

          <Panel title="Активные задачи">
            <template #button>
              <Badge variant="primary">
                {{ teamsStore.team.assignments.length }} проектов
              </Badge>
            </template>
            <ul class="divide-y divide-gray-100">
              <li v-if="teamsStore.team.assignments.length" v-for="assignment in teamsStore.team.assignments" :key="assignment.id"
                class="p-5 hover:bg-gray-50 transition-colors duration-150">
                <div class="flex items-start justify-between space-x-4">
                  <div class="flex-1 min-w-0">
                    <p class="text-base font-medium text-gray-900 mb-1">{{ assignment.issue.title }}</p>
                    <div class="flex items-center space-x-3">
                      <Badge 
                        :variant="getBadgeColor(assignment.issue.status)"
                        :text="getReadableIssueStatus(assignment.issue.status)" />
                      <span class="text-xs text-gray-500">Обновлено 2 дня назад</span>
                    </div>
                  </div>
                  <button class="text-gray-400 hover:text-gray-500">
                    <Icon icon="heroicons:ellipsis-vertical" class="h-5 w-5" />
                  </button>
                </div>
              </li>
              <EmptyState v-else title="Нет активных задач" icon="heroicons:document-text"
              description="Добавьте команду в задачу." class="p-6" small />
            </ul>
          </Panel> 
        </div>

        <div class="space-y-6">
          <Panel title="Участники команды">
            <template #button>
              <Badge variant="success">
              {{ teamsStore.team.members.length }} человек
            </Badge>
            </template>
               
            <ul class="divide-y divide-gray-100">
              <li v-if="teamsStore.team.members.length" v-for="member in teamsStore.team.members" :key="member.id"
                class="p-5 hover:bg-gray-50 transition-colors duration-150">
                <div class="flex items-center space-x-4">
                  <div class="relative">
                    <div
                      class="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white text-base font-semibold shadow-sm">
                      {{ getFirstLetter(member.name) }}
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-base font-medium text-gray-900 truncate">{{ member.name }}</p>
                    <p class="text-sm text-gray-500 truncate">{{ member.email }}</p>
                  </div>
                </div>
              </li>
              <EmptyState v-else title="Нет участников команды" icon="heroicons:user-group"
              description="Пригласите участников в команду." class="p-6" small />
            </ul>
            <div class="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <RouterLink :to="ROUTES.TEAM.EDIT.replace(':slug', teamsStore.team.slug)"
                class="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <Icon icon="heroicons:plus" class="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                Пригласить участника
              </RouterLink>
            </div>
          </Panel>
          
          <Panel title="Быстрые действия">
            <div class="p-6 space-y-4">
              <RouterLink :to="ROUTES.PROJECT.CREATE"
                class="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200">
                <div class="flex items-center space-x-3">
                  <div class="p-2 bg-indigo-100 rounded-lg">
                    <Icon icon="heroicons:plus-circle" class="h-5 w-5 text-indigo-600" />
                  </div>
                  <span class="text-sm font-medium text-gray-700">Создать проект</span>
                </div>
                <Icon icon="heroicons:chevron-right" class="h-5 w-5 text-gray-400" />
              </RouterLink>
              <RouterLink :to="ROUTES.TEAM.EDIT.replace(':slug', teamsStore.team.slug)"
                class="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200">
                <div class="flex items-center space-x-3">
                  <div class="p-2 bg-green-100 rounded-lg">
                    <Icon icon="heroicons:user-plus" class="h-5 w-5 text-green-600" />
                  </div>
                  <span class="text-sm font-medium text-gray-700">Добавить участника</span>
                </div>
                <Icon icon="heroicons:chevron-right" class="h-5 w-5 text-gray-400" />
              </RouterLink>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import EmptyState from "@/components/projects/settings/notification/EmptyState.vue";
import { Badge, Panel } from "@/components/ui";
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import { router } from "@/router";
import { ROUTES } from "@/router/routes.ts";
import { useTeamsStore } from '@/stores';
import { getProjectIcon, getReadableIssueStatus } from "@/utils";
import { Icon } from '@iconify/vue';
import { onMounted, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute();

const teamsStore = useTeamsStore();

const getFirstLetter = (name: string): string => {
  return name.charAt(0).toUpperCase();
};

const getBadgeColor = (status: string) => {
  const statusMap: Record<string, string> = {
    in_progress: 'warning',
    resolved: 'success',
    closed: 'secondary',
    open: 'primary',
  };
  return statusMap[status] || 'default';
};

watch(
  () => route.params.slug,
  () => teamsStore.fetchTeam(`${route.params.slug}`)
)
onMounted(() => {
  teamsStore.fetchTeam(`${route.params.slug}`)
});

const deleteTeam = async () => {
  if (!confirm('Вы уверены, что хотите удалить эту команду?')) return;

  try {
    await teamsStore.destroy(teamsStore.team.id);
    alert('Команда успешно удалена');
    await router.push('/teams');
  } catch (error) {
    alert('Не удалось удалить команду');
    console.error('Ошибка при удалении команды:', error);
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>