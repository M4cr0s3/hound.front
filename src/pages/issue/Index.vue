<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-gray-900">Задачи</h1>
        <div class="flex gap-2 items-center">
          <IssuesFilter v-model="filters"/>
          <Button class="ml-2" @click="() => resetForm(filters)">
            Сбросить фильтры
          </Button>
        </div>
      </div>
      <div class="flex justify-end mb-4">
        <Button
            icon="heroicons:table-cells"
            :variant="viewMode === 'table' ? 'primary' : 'secondary'"
            @click="viewMode = 'table'"
        >
          Таблица
        </Button>
        <Button
            icon="heroicons:rectangle-stack"
            :variant="viewMode === 'board' ? 'primary' : 'secondary'"
            @click="viewMode = 'board'"
            class="ml-2"
        >
          Доска
        </Button>
      </div>
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <template v-if="issues.length">
          <IssuesTable
              v-if="viewMode === 'table'"
              :issues="issues"
              :pagination="pagination"
              :is-loading="isLoading"
              @select="(row) => router.push(ROUTES.ISSUE.SHOW.replace(':id', row.id))"
              @page-change="handlePageChange"
          />
          <IssueKanban
              v-else
              :issues="issues"
              :is-loading="isLoading"
              @select="openDetailsModal"
          />
        </template>
        <template v-else>
          <EmptyState title="Проблемы отсутствуют" icon="heroicons:document-text" description="Проблемы не найдены"/>
        </template>
      </div>
    </div>

  </DashboardLayout>
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from 'vue';
import {IssuesFilter, IssuesTable, IssueKanban} from '@/components/issue'
import {Button} from '@/components/ui'
import {useIssuesStore} from '@/stores'
import {watchDebounced} from "@vueuse/core";
import {resetForm} from "@/utils";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import {EmptyState} from "@/components/projects/settings/notification";
import {ROUTES} from "@/router/routes.ts";
import {useRouter} from "vue-router";

const issuesStore = useIssuesStore();
const router = useRouter();

const filters = ref({
  search: '',
  status: '',
  priority: '',
  tags: []
});

const issues = computed(() => issuesStore.issues);
const pagination = computed(() => issuesStore.pagination);
const isLoading = computed(() => issuesStore.isLoading);

const viewMode = ref<'table' | 'board'>('table');

watchDebounced(filters, () => {
  issuesStore.updateFilters(filters.value);
  issuesStore.fetchIssues()
}, {debounce: 500, deep: true});

const handlePageChange = (page: string) => {
  issuesStore.filters.page = Number(page);
  issuesStore.fetchIssues();
};

onMounted(async () => {
  await issuesStore.fetchIssues();
})
</script>