<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" v-if="eventsStore?.event">
      <nav class="flex items-center mb-6">
        <ol class="inline-flex items-center space-x-1 md:space-x-2">
          <li>
            <div class="flex items-center">
              <Icon icon="mdi:chevron-right" class="h-4 w-4 text-gray-400"/>
              <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2">Детали события</span>
            </div>
          </li>
        </ol>
      </nav>

      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6" v-if="eventsStore.event">
        <div class="flex items-center gap-3">
          <div
              class="p-2 rounded-lg"
              :class="`bg-${getLevelColor(eventsStore.event.level)}-100 text-${getLevelColor(eventsStore.event.level)}-600`"
          >
            <Icon
                :icon="getLevelIcon(eventsStore.event.level)"
                class="h-5 w-5"
            />
          </div>
          <div>
            <h1 class="text-xl font-semibold text-gray-900 line-clamp-2">
              {{ eventsStore.event.message }}
            </h1>
            <div class="flex items-center gap-2 mt-1">
              <Badge
                  :variant="getLevelVariant(eventsStore.event.level)"
                  :text="eventsStore.event.level"
                  class="text-xs"
              />
              <span class="text-xs text-gray-500" v-if="eventsStore?.event.created_at">
                {{ formatDateTime(eventsStore.event.created_at) }}
              </span>
              <span
                  v-if="eventsStore.event.count > 1"
                  class="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
              >
                Повторений: {{ eventsStore.event.count }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-6">
        <nav class="flex space-x-4 border-b border-gray-200">
          <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="px-4 py-2 text-sm font-medium relative cursor-pointer"
              :class="{
              'text-indigo-600': activeTab === tab.id,
              'text-gray-500 hover:text-gray-700': activeTab !== tab.id
            }"
          >
            {{ tab.name }}
            <span
                v-if="activeTab === tab.id"
                class="absolute inset-x-0 bottom-0 h-0.5 bg-indigo-600"
            ></span>
          </button>
        </nav>
      </div>

      <div v-show="activeTab === 'details'">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-sm font-medium text-gray-900">Основная информация</h3>
            </div>
            <div class="px-6 py-4 space-y-4">
              <div v-if="eventsStore.event.metadata?.file" class="flex items-start">
                <span class="text-sm text-gray-500 w-32 flex-shrink-0">Файл:</span>
                <span class="text-sm text-gray-900 font-mono break-all">
                  {{ eventsStore.event.metadata.file }}:{{ eventsStore.event.metadata.line || '?' }}
                </span>
              </div>
              <div v-if="eventsStore.event.type" class="flex items-start">
                <span class="text-sm text-gray-500 w-32 flex-shrink-0">Тип:</span>
                <Badge :text="eventsStore.event.type" class="text-xs" variant="default"/>
              </div>
              <div v-if="eventsStore.event.environment" class="flex items-start">
                <span class="text-sm text-gray-500 w-32 flex-shrink-0">Окружение:</span>
                <span class="text-sm text-gray-900">{{ eventsStore.event.environment }}</span>
              </div>
              <div v-if="eventsStore.event.release" class="flex items-start">
                <span class="text-sm text-gray-500 w-32 flex-shrink-0">Релиз:</span>
                <span class="text-sm text-gray-900">{{ eventsStore.event.release }}</span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-sm font-medium text-gray-900">Проект</h3>
            </div>
            <div class="px-6 py-4">
              <div class="flex items-center">
                <div
                    class="flex-shrink-0 h-10 w-10 flex items-center justify-center p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-md">
                  <Icon
                      :icon="PLATFORMS.find(p => p.name === eventsStore?.event.project?.platform)?.icon || ' '"
                      class="h-5 w-5"
                  />
                </div>
                <div class="ml-4">
                  <h4 class="text-sm font-medium text-gray-900">{{ eventsStore.event.project?.name }}</h4>
                  <p class="text-sm text-gray-500">{{ eventsStore.event.project?.slug }}</p>
                  <RouterLink
                      :to="`/projects/${eventsStore.event.project?.slug}`"
                      class="mt-1 inline-flex items-center text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    Перейти в проект
                    <Icon icon="mdi:chevron-right" class="h-4 w-4"/>
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
            v-if="hasAdditionalData"
            class="bg-white rounded-lg shadow overflow-hidden mb-6"
        >
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-sm font-medium text-gray-900">Контекст события</h3>
          </div>
          <div class="px-6 py-4">
            <JsonViewer
                class="text-sm"
                :data="filteredMetadata"
            />
          </div>
        </div>
      </div>

      <div
          v-show="activeTab === 'stacktrace' && eventsStore.event?.metadata.stacktrace"
          v-if="eventsStore.event.metadata.stacktrace"
      >
        <StacktraceViewer
            :stacktrace="eventsStore.event.metadata.stacktrace"
            class="mb-6"
        />
      </div>

      <div v-show="activeTab === 'issues'">
        <div
            v-if="eventsStore.event.issues && eventsStore.event.issues.length > 0"
            class="bg-white rounded-lg shadow overflow-hidden mb-6"
        >
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 class="text-sm font-medium text-gray-900">Связанные проблемы</h3>
          </div>
          <div class="divide-y divide-gray-200">
            <div
                v-for="issue in eventsStore.event.issues"
                :key="issue.id"
                class="px-6 py-4 hover:bg-gray-50"
            >
              <div class="flex items-center justify-between">
                <div>
                  <div class="flex items-center gap-2">
                    <h4 class="text-sm font-medium text-gray-900">{{ issue.title }}</h4>
                    <Badge
                        :variant="getIssueStatusColor(issue.status)"
                        :text="getReadableIssueStatus(issue.status)"
                        class="text-xs"
                    />
                  </div>
                  <p class="text-sm text-gray-500 mt-1">
                    Создана {{ formatDateTime(issue.created_at) }}
                  </p>
                </div>
                <RouterLink
                    :to="`/issues/${issue.id}`"
                    class="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Подробнее
                  <Icon icon="mdi:chevron-right" class="h-4 w-4"/>
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow overflow-hidden" v-else>
          <EmptyState
              title="Нет связанных задач"
              description="Это событие еще не связано ни с одной задачей."
              icon="mdi:alert-circle-outline"
          />
        </div>
      </div>
    </div>

  </DashboardLayout>
</template>

<script setup lang="ts">
import {EmptyState} from "@/components/projects/settings/notification";
import {Badge, JsonViewer, StacktraceViewer} from '@/components/ui';
import {PLATFORMS} from "@/data";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import {useEventsStore} from "@/stores";
import {
  formatDateTime,
  getIssueStatusColor,
  getLevelColor,
  getLevelIcon,
  getLevelVariant,
  getReadableIssueStatus
} from '@/utils';
import {Icon} from '@iconify/vue';
import {useClipboard} from '@vueuse/core';
import {computed, onMounted, ref} from 'vue';
import {toast} from "vue-sonner";

const props = defineProps<{
  id: string;
}>();

const eventsStore = useEventsStore();
const activeTab = ref('details');

const tabs = [
  {id: 'details', name: 'Детали'},
  {id: 'stacktrace', name: 'Stacktrace'},
  {id: 'issues', name: 'Проблемы'}
];

const hasAdditionalData = computed(() => {
  const metadata = eventsStore.event.metadata || {};
  const excludedKeys = ['file', 'line', 'stacktrace'];
  return Object.keys(metadata).some(key => !excludedKeys.includes(key));
});

const filteredMetadata = computed(() => {
  const {file, line, stacktrace, ...rest} = eventsStore.event.metadata || {};
  return rest;
});

onMounted(async () => {
  await eventsStore.fetchEvent(+props.id);
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>