<script setup lang="ts">
import { httpClient } from '@/api';
import EndpointItem from "@/components/projects/EndpointItem.vue";
import EventItem from "@/components/projects/EventItem.vue";
import IssueItem from "@/components/projects/IssueItem.vue";
import LineChart from "@/components/projects/LineChart.vue";
import { EmptyState } from "@/components/projects/settings/notification";
import StatCard from "@/components/projects/StatCard.vue";
import { Badge, Button, InputField, Modal, Panel, SelectField } from '@/components/ui';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import { useProjectsStore } from '@/stores';
import { getProjectIcon } from "@/utils";
import { Icon } from '@iconify/vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const projectStore = useProjectsStore();


const stats = ref({
  events_today: 0,
  events_week: 0,
  active_issues: 0,
  uptime_percentage: 100,
});

const dailyStats = ref([]);
const showDeleteConfirm = ref(false);
const showEndpointModal = ref(false);
const newEndpoint = ref({
  url: '',
  expected_status: 200,
  interval: 5,
  method: 'GET',
  is_active: true,
});

const uptimePercent = computed(() => {
  if(!projectStore.project.endpoints.length) {
    return 0;
  }

  return stats.value.uptime_percentage / projectStore.project.endpoints.length
});

const fetchProject = async () => {
  try {
    const response = await httpClient.get(`/projects/${route.params.slug}`);
    projectStore.project = response.project;
    stats.value = response.stats;
    dailyStats.value = response.daily_stats;
  } catch (error) {
    console.error('Error fetching project:', error);
  }
};

const addEndpoint = async () => {
  try {
    await httpClient.post(`/healthcheck/${projectStore.project.slug}`, newEndpoint.value);
    await fetchProject();
    showEndpointModal.value = false;
    newEndpoint.value = {
      url: '',
      expected_status: 200,
      interval: 5,
      method: 'GET',
      is_active: true
    };
  } catch (error) {
    console.error('Error adding endpoint:', error);
  }
};

onMounted(() => {
  fetchProject();
});
</script>

<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div class="flex items-start space-x-4">
          <div class="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-md">
            <Icon :icon="getProjectIcon(projectStore.project.platform)" class="h-8 w-8 text-white"/>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ projectStore.project.name }}</h1>
            <div class="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="primary" class="flex items-center">
                <Icon icon="heroicons:user-group" class="mr-1 h-4 w-4"/>
                {{ projectStore.project.team?.name }}
              </Badge>
              <Badge variant="secondary" class="flex items-center">
                <Icon icon="heroicons:computer-desktop" class="mr-1 h-4 w-4"/>
                {{ projectStore.project.platform }}
              </Badge>
            </div>
          </div>
        </div>
        <div class="flex space-x-3">
          <RouterLink
              :to="`/projects/${projectStore.project.slug}/settings/general`"
              class="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Icon icon="heroicons:cog-6-tooth" class="mr-2 h-4 w-4"/>
            Настройки
          </RouterLink>
          <button
              @click="showDeleteConfirm = true"
              class="inline-flex items-center px-4 py-2 cursor-pointer bg-white border border-gray-200 text-red-600 text-sm font-medium rounded-lg shadow-sm hover:bg-red-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <Icon icon="heroicons:trash" class="mr-2 h-4 w-4"/>
            Удалить
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
            title="Событий сегодня"
            :value="stats.events_today"
            icon="heroicons:bell-alert"
        />
        <StatCard
            title="Событий за неделю"
            :value="stats.events_week"
            icon="heroicons:calendar-days"
        />
        <StatCard
            title="Активных задач"
            :value="stats.active_issues"
            icon="heroicons:exclamation-triangle"
            variant="warning"
        />
        <StatCard
            title="Аптайм"
            :value="`${uptimePercent}%`"
            icon="heroicons:shield-check"
            variant="success"
        />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <Panel title="Активность (7 дней)">
            <LineChart
                  :data="dailyStats"
                  title="Активность событий"
                  color="#8B5CF6"
                  :show-mark-line="true"
            />
          </Panel>

          <Panel title="Последние события">
            <template v-slot:button>
              <RouterLink
                  :to="`/projects/${projectStore.project.slug}/events`"
                  class="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Показать все
              </RouterLink>
            </template>
             
            <div class="divide-y divide-gray-100">
              <EventItem
                  v-for="event in projectStore.project.events"
                  :key="event.id"
                  :event="event"
                  class="hover:bg-gray-50 transition-colors duration-150"
                  :project-slug="projectStore.project.slug"
              />
              <EmptyState
                  v-if="!projectStore.project.events.length"
                  title="Событий не найдено"
                  icon="heroicons:bell"
                  description="Здесь будут отображаться последние события вашего проекта."
                  class="p-6"
                  small
              />
            </div>
          </Panel>
        </div>

        <div class="space-y-6">
          <Panel title="Health Check Endpoints">
            <template v-slot:button>
              <button
                  @click="showEndpointModal = true"
                  class="text-sm text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
              >
                <Icon icon="heroicons:plus" class="h-4 w-4"/>
              </button>
            </template>
            <div class="divide-y divide-gray-100">
              <EndpointItem
                  v-for="endpoint in projectStore.project.endpoints"
                  :slug="projectStore.project.slug"
                  :key="endpoint.id"
                  :endpoint="endpoint"
                  class="hover:bg-gray-50 transition-colors duration-150"
              />
              <EmptyState
                  v-if="!projectStore.project.endpoints.length"
                  title="Нет endpoints"
                  icon="heroicons:link"
                  description="Добавьте health check endpoints для мониторинга."
                  class="p-6"
                  small
              />
            </div>
          </Panel>

          <Panel title="Последние проблемы">
            <template v-slot:button>
              <RouterLink
                  :to="`/projects/${projectStore.project.slug}/issues`"
                  class="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Показать все
              </RouterLink>
            </template>
            <div class="divide-y divide-gray-100">
              <IssueItem
                  v-for="issue in projectStore.project.issues"
                  :key="issue.id"
                  :issue="issue"
                  class="hover:bg-gray-50 transition-colors duration-150"
                  :project-slug="projectStore.project.slug"
              />
              <EmptyState
                  v-if="!projectStore.project.issues.length"
                  title="Проблем не найдено"
                  icon="heroicons:check-badge"
                  description="Отличная работа! Активных проблем нет."
                  class="p-6"
                  small
              />
            </div>
          </Panel>
        </div>
      </div>
    </div>

    <Modal
        :is-open="showDeleteConfirm"
        @close="showDeleteConfirm = false"
        title="Подтверждение удаления"
    >
      <template #content>
        <div class="text-center">
          <Icon icon="heroicons:exclamation-triangle" class="mx-auto h-12 w-12 text-red-500"/>
          <h3 class="mt-2 text-lg font-medium text-gray-900">Удалить проект?</h3>
          <div class="mt-2 text-sm text-gray-500">
            <p>Вы уверены, что хотите удалить проект "{{ projectStore.project.name }}"?</p>
            <p class="mt-1">Это действие нельзя отменить.</p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <Button variant="secondary" @click="showDeleteConfirm = false">
            Отмена
          </Button>
          <Button variant="danger" @click="projectStore.destroy(projectStore.project.slug)">
            Удалить
          </Button>
        </div>
      </template>
    </Modal>

    <Modal
        :is-open="showEndpointModal"
        @close="showEndpointModal = false"
        title="Добавить Health Check Endpoint"
    >
      <template #content>
        <form @submit.prevent="addEndpoint" class="space-y-4">
          <InputField
              id="endpoint-url"
              v-model="newEndpoint.url"
              label="URL Endpoint"
              placeholder="https://example.com/health"
              required
              icon="heroicons:link"
          />
          <InputField
              id="exp-status"
              v-model="newEndpoint.expected_status"
              label="Ожидаемый HTTP статус"
              type="number"
              placeholder="200"
              required
              icon="heroicons:hashtag"
              :minValue="1"
              :maxValue="550"
          />
          <InputField
              v-model="newEndpoint.interval"
              label="Интервал проверки (минуты)"
              type="number"
              placeholder="5"
              required
              icon="heroicons:clock"
              id="check-interval"
              :minValue="1"
              :maxValue="60"
          />
          <SelectField
              :options="['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS']"
              v-model="newEndpoint.method"
              label="Метод"
              required
          />
        </form>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <Button variant="secondary" @click="showEndpointModal = false">
            Отмена
          </Button>
          <Button @click="addEndpoint">
            Добавить
          </Button>
        </div>
      </template>
    </Modal>
  </DashboardLayout>
</template>
