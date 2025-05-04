<template>
  <div class="bg-white shadow rounded-lg overflow-hidden">
    <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
      <h3 class="text-lg leading-6 font-medium text-gray-900">События</h3>
      <p class="mt-1 text-sm text-gray-500">
        Все события, связанные с этой проблемой
      </p>
    </div>

    <div class="px-4 py-5 sm:p-6">
      <div v-if="isLoading" class="flex justify-center py-8">
        Загрузка
      </div>

      <div v-else-if="events.length === 0" class="text-center py-8 text-gray-500">
        События не найдены
      </div>

      <ul v-else class="divide-y divide-gray-200">
        <li v-for="event in events" :key="event.id" class="py-4">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <span class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <Icon icon="mdi:alert-circle" class="h-5 w-5 text-gray-600"/>
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ event.message }}
              </p>
              <p class="text-sm text-gray-500 truncate">
                {{ formatDateTime(event.created_at) }} · {{ event.environment }}
              </p>
            </div>
            <div>
              <button
                  type="button"
                  class="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                View
              </button>
            </div>
          </div>
        </li>
      </ul>

      <Pagination
          v-if="events.length"
          class="mt-6"
          @page-changed="handlePageChange"
          :pagination="pagination"
          text="событий"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {Icon} from '@iconify/vue'
import {Pagination} from '@/components/ui';
import {IssuesApi} from '@/api';
import {formatDateTime} from '@/utils';

const props = defineProps<{
  issueId: number;
}>();

const events = ref<any[]>([]);
const isLoading = ref(true);
const pagination = ref({
  currentPage: 1,
  perPage: 10,
  total: 0
});

const fetchEvents = async () => {
  try {
    isLoading.value = true;
    const response = await IssuesApi.getEvents(
        props.issueId,
        pagination.value.currentPage,
        pagination.value.perPage
    );
    events.value = response.events;
    pagination.value.total = response.total;
  } catch (error) {
    console.error('Error fetching events:', error);
  } finally {
    isLoading.value = false;
  }
};

const handlePageChange = (page: number) => {
  pagination.value.currentPage = page;
  fetchEvents();
};

onMounted(() => {
  fetchEvents();
});
</script>