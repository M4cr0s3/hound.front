<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div
          class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
      >
        <div>
          <h1 class="text-2xl font-bold text-gray-900">События</h1>
          <p class="text-sm text-gray-500 mt-1">
            Среда: {{ currentEnvironment }}
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <div class="relative">
            <SelectField
                id="level"
                label="Уровень"
                v-model="filters.level"
                :options="levelOptions"
                option-label="value"
                option-value="key"
                placeholder="Выберите уровень"
                class="min-w-48"
            />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <!-- <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
          <p class="text-sm font-medium text-gray-500">Всего событий</p>
          <p class="text-2xl font-bold text-gray-900">
            {{ stats.total.toLocaleString() }}
          </p>
        </div>

        <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
          <p class="text-sm font-medium text-gray-500">Ошибки</p>
          <p class="text-2xl font-bold text-red-600">
            {{ stats.errors.toLocaleString() }}
          </p>
        </div>

        <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
          <p class="text-sm font-medium text-gray-500">Предупреждения</p>
          <p class="text-2xl font-bold text-yellow-600">
            {{ stats.warnings.toLocaleString() }}
          </p>
        </div>

        <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
          <p class="text-sm font-medium text-gray-500">Релиз</p>
          <p class="text-2xl font-bold text-gray-900">
            {{ currentRelease || 'N/A' }}
          </p>
        </div> -->
      </div>
      <DataTable
          :columns="columns"
          :data="events"
          :pagination="pagination"
          :is-loading="isLoading"
          row-key="id"
          row-clickable
          @row-click="openEvent"
          @page-change="changePage"
          pagination-text="событий"
      >
        <template #cell-message="{ row }">
          <div class="flex items-center">
            <div class="min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate max-w-xs">
                {{ row.message }}
              </p>
              <p class="text-xs text-gray-500 mt-1 truncate">
                {{ row.metadata?.file }}:{{ row.metadata?.line }}
              </p>
            </div>
          </div>
        </template>
        <template #cell-level="{ value }">
					<span
              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
              :class="getLevelClass(value)"
          >
						{{ value }}
					</span>
        </template>

        <template #cell-type="{ value }">
					<span
              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800"
          >
						{{ value }}
					</span>
        </template>

        <template #cell-actions="{ row }">
          <td
              class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative"
          >
            <DropdownMenu
                :row="row"
                @action="handleActionClick"
            />
          </td>
        </template>
      </DataTable>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted, watch} from 'vue';
import {DataTable, DropdownMenu, SelectField} from '../../../components/ui';
import DashboardLayout from '../../../layouts/DashboardLayout.vue';
import {
  api,
  getProjectEvents,
  type Event,
  type Pagination as PaginationType,
} from '../../../api';
import {useRouter} from 'vue-router';
import {columns} from './table';

const router = useRouter();
const {slug} = defineProps<{
  slug: string;
}>();

const isLoading = ref<boolean>(false);
const events = ref<Event[]>([]);
const pagination = ref<PaginationType>({
  from: 1,
  to: 10,
  total: 0,
  links: [],
  current_page: 1,
});
const releases = ref<string[]>([]);
const currentEnvironment = ref('production');

const filters = ref({
  level: '',
  release: '',
  environment: 'production',
});

const levelOptions = [
  {
    key: 'error',
    value: 'Error',
  },
  {
    key: 'warning',
    value: 'Warning',
  },
  {
    key: 'info',
    value: 'Info',
  },
];

const getLevelClass = (level: string) => {
  switch (level) {
    case 'error':
      return 'bg-red-100 text-red-800';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
};

const handleActionClick = ({key, row}: { key: string; row?: any }) => {
  console.log('Action:', key, 'on row ID:', row.id);

  switch (key) {
    case 'create-issue':
      createIssue(row.id);
      break;
    case 'delete':
      deleteEvent(row.id);
      break;
  }
};

const createIssue = (eventId: string) => {
  router.push(`/projects/${slug}/events/${eventId}/issue/create`);
};

const deleteEvent = (eventId: string) => {
  console.log('Deleting event:', eventId);
};

const openEvent = (eventId: string) => {
  router.push(`/projects/${slug}/events/${eventId}`);
};

const fetchEvents = async () => {
  isLoading.value = true;
  try {
    const {events: evts, pagination: paginationInfo} = await getProjectEvents(
        slug,
        {
          per_page: 5,
          page: pagination.value.current_page,
          level: filters.value.level,
          release: filters.value.release,
          environment: filters.value.environment,
        }
    );
    events.value = evts;
    pagination.value = paginationInfo;
  } catch (error) {
    console.error('Error fetching events:', error);
  } finally {
    isLoading.value = false;
  }
};

const fetchReleases = async () => {
  try {
    const response = await api.get(`/projects/${slug}/releases`);
    releases.value = response.data;
  } catch (error) {
    console.error('Error fetching releases:', error);
  }
};

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

onMounted(async () => {
  await fetchReleases();
  await fetchEvents();
});

const refreshInterval = setInterval(fetchEvents, 30000);

onUnmounted(() => {
  clearInterval(refreshInterval);
});
</script>
