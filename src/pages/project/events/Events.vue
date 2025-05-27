<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div class="flex items-start space-x-3">
          <div class="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-md">
            <Icon icon="heroicons:bell-alert" class="h-8 w-8 text-white"/>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">События проекта</h1>
            <div class="flex items-center space-x-3 mt-2">
              <Badge variant="secondary" class="flex items-center">
                <Icon icon="heroicons:computer-desktop" class="mr-1 h-4 w-4"/>
                {{ [...events].pop()?.environment ?? 'Нет информации' }}
              </Badge>
              <RouterLink
                  :to="`/projects/${slug}`"
                  class="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
              >
                <Icon icon="heroicons:arrow-left" class="mr-1 h-4 w-4"/>
                Назад к проекту
              </RouterLink>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap gap-3">
          <SelectField
              id="level"
              v-model="filters.level"
              :options="levelOptions"
              option-label="value"
              option-value="key"
              placeholder="Все уровни"
              class="min-w-48"
              icon="heroicons:filter"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
            title="Всего событий"
            :value="eventsStats.total"
            icon="heroicons:chart-bar"
            :trend="eventsStats.changeDirection"
            :trend-value="eventsStats.totalChangedFor"
        />
        <StatCard
            title="Ошибки"
            :value="errorsStats.total"
            icon="heroicons:exclamation-circle"
            variant="danger"
            :trend="errorsStats.changeDirection"
            :trend-value="errorsStats.totalChangedFor"
        />
        <StatCard
            title="Предупреждения"
            :value="stats.warnings.toLocaleString()"
            icon="heroicons:exclamation-triangle"
            variant="warning"
        />
        <StatCard
            title="Текущий релиз"
            :value="release || 0"
            icon="heroicons:tag"
        />
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <h2 class="text-lg font-semibold text-gray-900">Последние события</h2>
        </div>
        <DataTable
            v-if="events.length"
            :columns
            :data="events"
            :pagination="pagination"
            :is-loading="isLoading"
            row-key="id"
            row-clickable
            @row-click="(row: Event) => openEvent(row.id)"
            @page-change="changePage"
            class="rounded-none rounded-bl-lg rounded-br-lg"
            pagination-text="событий"
        >
          <template #cell-message="{ row }">
            <div class="flex items-center space-x-3">
              <div :class="`text-${getLevelColor(row.level)}-500`">
                <Icon :icon="getLevelIcon(row.level)" class="h-5 w-5"/>
              </div>
              <div class="min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate max-w-md">
                  {{ row.message }}
                </p>
                <p v-if="row.metadata?.file" class="text-xs text-gray-500 mt-1 truncate">
                  {{ row.metadata.file }}:{{ row.metadata.line || '?' }}
                </p>
              </div>
            </div>
          </template>

          <template #cell-level="{ value }">
            <Badge :variant="getLevelVariant(value)" :text="value"/>
          </template>

          <template #cell-timestamp="{ value }">
            <span class="text-sm text-gray-500 whitespace-nowrap">
              {{ formatDateTime(value) }}
            </span>
          </template>

          <template #cell-actions="{ row }">
            <span class="flex justify-start">
              <DropdownMenu :row :actions @action="handleActionClick"/>
            </span>
          </template>
        </DataTable>
        <EmptyState
            v-else title="События отсутствуют"
            icon="heroicons:bell-alert"
            description="Пока что никаких событий нет"
        />
      </div>
      <Modal :is-open="isCreateIssueModalOpen" @close="isCreateIssueModalOpen = false">
        <template #title>
          <h2 class="text-xl font-bold text-gray-900 mb-2">Создать задачу</h2>
        </template>
        <template #content>
          <TheForm
              class="space-y-6"
              :schema="schema"
              :data="createIssueForm"
              :submit="handleCreateIssue"
              v-slot="{ errors }"
          >
            <InputField
                id="title"
                v-model="createIssueForm.title"
                label="Заголовок"
                placeholder="Заголовок задачи"
                :error="errors?.title"
                required
            />

            <SelectField
                id="priority"
                v-model="createIssueForm.priority"
                label="Приоритет"
                placeholder="Приоритет задачи"
                :options="[
                  { key: 'low', value: 'Низкий' },
                  { key: 'medium', value: 'Средний' },
                  { key: 'high', value: 'Высокий' },
                  { key: 'critical', value: 'Критический' },
                ]"
                option-label="value"
                option-value="key"
                required
                :error="errors?.priority"
            />

            <div class="flex justify-end gap-3 mt-5">
              <Button
                  variant="secondary"
                  @click="isCreateIssueModalOpen = false"
                  class="px-4 py-2"
              >
                Отмена
              </Button>
              <Button
                  type="submit"
                  class="px-4 py-2"
              >
                Создать
              </Button>
            </div>
          </TheForm>
        </template>
      </Modal>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import {
  getProjectEvents,
  httpClient,
  IssuePriority,
  type Event,
  type Id,
  type Issue,
  type Pagination as PaginationType,
} from '@/api';
import { EmptyState } from "@/components/projects/settings/notification";
import StatCard from "@/components/projects/StatCard.vue";
import {
  Badge,
  Button,
  DataTable,
  DropdownMenu,
  InputField,
  Modal,
  SelectField,
  TheForm,
} from '@/components/ui';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import { ROUTES } from "@/router/routes.ts";
import { useIssuesStore } from "@/stores";
import { formatDateTime } from '@/utils';
import { Icon } from '@iconify/vue';
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from "vue-sonner";
import { schema } from "./schema.ts";
import { actions, columns } from "./table.ts";
import type { Trend } from './types.ts';

const {slug} = defineProps<{
  slug: string;
}>();

const router = useRouter();
const issuesStore = useIssuesStore();
const isLoading = ref<boolean>(false);
const release = computed(() => {
  if (events.value.length) {
    return events.value[0].release === 'unknown/unknown'
        ? events.value.find(ev => ev.release !== 'unknown/unknown')?.release
        : events.value[0].release
  }

  return 'Не указан';
});
const events = ref<Event[]>([]);
const pagination = ref<PaginationType>({
  from: 1,
  to: 10,
  total: 0,
  links: [],
  current_page: 1,
  data: []
});
const isCreateIssueModalOpen = ref(false);
const selectedEvent = ref<Event>({} as Event);
const createIssueForm = reactive<Partial<Issue>>({
  title: '',
  priority: IssuePriority.Low,
  due_date:  new Date().toDateString(),
  event_id: 0,
});

const eventsStats = reactive({
  total: 0,
  totalChangedFor: "",
  changeDirection: "up" as Trend
})

const errorsStats = reactive({
  total: 0,
  totalChangedFor: "",
  changeDirection: "up" as Trend
})

const stats = reactive({
  total: 0,
  errors: 0,
  warnings: 0,
  infos: 0
});

const filters = ref({
  level: '',
  release: '',
  environment: 'production',
});

const levelOptions = [
  {key: '', value: 'Все'},
  {key: 'error', value: 'Ошибки'},
  {key: 'warning', value: 'Предупреждения'},
  {key: 'info', value: 'Информационные'},
];

const LEVEL_VARIANTS = {
    error: 'danger',
    warning: 'warning',
    info: 'primary'
  };

const LEVEL_COLOR = {
  error: 'red',
  warning: 'yellow',
  info: 'blue'
};

const LEVEL_ICON = {
  error: 'heroicons:exclamation-circle',
  warning: 'heroicons:exclamation-triangle',
  info: 'heroicons:information-circle'
}

const getLevelVariant = (level: keyof typeof LEVEL_VARIANTS) => {
  return (LEVEL_VARIANTS[level] || 'secondary') as Variant;
};

const getLevelColor = (level: keyof typeof LEVEL_COLOR) => {
  return (LEVEL_COLOR[level] || 'gray') as Variant;
};

const getLevelIcon = (level: keyof typeof LEVEL_ICON) => {
  return (LEVEL_ICON[level] || 'heroicons:bell') as Variant;
};

const handleActionClick = ({key, row}: { key: string; row?: any }) => {
  switch (key) {
    case 'view':
      openEvent(row.id);
      break;
    case 'create-issue':
      isCreateIssueModalOpen.value = true;
      selectedEvent.value = row;
      createIssueForm.event_id = row.id;
      break;
    case 'delete':
      deleteEvent(row.id);
      break;
  }
};

const deleteEvent = async (id: Id) => {
  if (!confirm('Вы уверены, что хотите удалить это событие?')) return;
  try {
    await httpClient.delete(`/events/${id}`);
    await fetchEvents();
  } catch (error) {
    console.error('Error deleting event:', error);
  }
};

const openEvent = (id: Id) => {
  router.push(ROUTES.EVENT.SHOW.replace(':id', id.toString()));
};

const fetchEvents = async () => {
  isLoading.value = true;
  try {
    const {events: evts, pagination: paginationInfo} = await getProjectEvents(
        slug,
        {
          per_page: 10,
          page: pagination.value.current_page,
          level: filters.value.level,
          release: filters.value.release,
          environment: filters.value.environment,
        }
    );

    events.value = evts;
    pagination.value = paginationInfo;

    stats.total = evts.length;
    stats.errors = evts.filter(e => e.level === 'error').length
    stats.warnings = evts.filter(e => e.level === 'warning').length
    stats.infos = evts.filter(e => e.level === 'info').length

  } catch (error) {
    console.error('Error fetching events:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleCreateIssue = async () => {
  try {
    const response = await issuesStore.createIssue(createIssueForm);
    isCreateIssueModalOpen.value = false;
    await router.push(ROUTES.ISSUE.SHOW.replace(':id', response.id.toString()));
    toast.success('Задача успешно создана');
  } catch (error) {
    console.error('Error creating issue:', error);
  }
}

const changePage = (url: string | null) => {
  if (!url) return;
  const page = new URL(url).searchParams.get('page');
  if (page) {
    pagination.value.current_page = parseInt(page);
    fetchEvents();
  }
};

watch(filters.value, async () => {
  pagination.value.current_page = 1;
  await fetchEvents();
});

type GetStatsResponse = {
  events: {
    count: number,
    trend: Trend,
    trend_value: string
  }
  errors: {
    count: number,
    trend: Trend,
    trend_value: string
  }
}

onMounted(async () => {
  await fetchEvents();
  const res = await httpClient.get<GetStatsResponse>(`/projects/stats/${slug}/week`);
  eventsStats.total = res.events.count
  eventsStats.totalChangedFor = res.events.trend_value
  eventsStats.changeDirection = res.events.trend as Trend
  errorsStats.total = res.errors.count
  errorsStats.totalChangedFor = res.errors.trend_value 
  errorsStats.changeDirection = res.errors.trend as Trend
});

const refreshInterval = setInterval(fetchEvents, 30000);

onUnmounted(() => {
  clearInterval(refreshInterval);
});
</script>

<style scoped>
:deep(.data-table-row) {
  transition: background-color 0.2s ease;
}

:deep(.data-table-row:hover) {
  background-color: #f9fafb;
}

.dropdown-scroll {
  scrollbar-width: thin;
  scrollbar-color: #e5e7eb #f9fafb;
}

.dropdown-scroll::-webkit-scrollbar {
  width: 6px;
}

.dropdown-scroll::-webkit-scrollbar-track {
  background: #f9fafb;
}

.dropdown-scroll::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 3px;
}
</style>