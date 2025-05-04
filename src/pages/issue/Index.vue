<template>
  <DashboardLayout>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">Проблемы</h1>
      <Button @click="openCreateModal">Создать проблему</Button>
    </div>
    <div class="flex gap-2 items-center">
      <IssuesFilter v-model="filters"/>
      <Button class="ml-2" @click="() => resetForm(filters)">
        Сбросить фильтры
      </Button>
    </div>
    <template v-if="issues.length">
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
    <Modal :is-open="showCreateModal" @close="showCreateModal = false">
      <template #title>{{ editIssue ? 'Редактировать проблему' : 'Создать проблему' }}</template>
      <template #content>
        <IssueCreateForm
            :issue="editIssue"
            @submit="handleSubmit"
            @cancel="showCreateModal = false"
        />
      </template>
    </Modal>
  </DashboardLayout>

    <!--      <IssueDetailsModal-->
    <!--          v-if="selectedIssue"-->
    <!--          :is-open="!!selectedIssue"-->
    <!--          :issue="selectedIssue"-->
    <!--          @close="selectedIssue = null"-->
    <!--          @edit="handleEdit"-->
    <!--          @delete="handleDelete"-->
    <!--      />-->
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from 'vue';
import {IssuesFilter, IssuesTable, IssueKanban, IssueCreateForm} from '@/components/issue'
import {Button, Modal} from '@/components/ui'
import DashboardSidebar from "@/components/dashboard/DashboardSidebar.vue";
import {useIssuesStore} from '@/stores'
import type {Issue} from '@/api';
import {watchDebounced} from "@vueuse/core";
import {resetForm} from "@/utils";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import {EmptyState} from "@/components/projects/settings/notification";
import {router} from "@/router";
import {ROUTES} from "@/router/routes.ts";

const issuesStore = useIssuesStore();
// const authStore = useAuthStore();

const filters = ref({
  search: '',
  status: '',
  priority: '',
  tags: []
});

const issues = computed(() => issuesStore.issues);
const pagination = computed(() => issuesStore.pagination);
const isLoading = computed(() => issuesStore.isLoading);

const showCreateModal = ref(false);
const selectedIssue = ref<Issue | null>(null);
const editIssue = ref<Issue | null>(null);
const viewMode = ref<'table' | 'board'>('table');

// const canCreate = computed(() => authStore.user?.role === 'admin' || authStore.user?.role === 'manager');

watchDebounced(filters, () => {
  issuesStore.updateFilters(filters.value);
  issuesStore.fetchIssues()
}, {debounce: 500, deep: true});

const openCreateModal = () => {
  editIssue.value = null;
  showCreateModal.value = true;
};

const openDetailsModal = (issue: Issue) => {
  selectedIssue.value = issue;
};

const handleEdit = () => {
  editIssue.value = selectedIssue.value;
  showCreateModal.value = true;
  selectedIssue.value = null;
};

const handleSubmit = async (data: Partial<Issue>) => {
  if (editIssue.value) {
    await issuesStore.updateIssue(editIssue.value.event_id, data);
  } else {
    await issuesStore.createIssue(data);
  }
  showCreateModal.value = false;
  editIssue.value = null;
};

const handleDelete = async (event_id: string) => {
  await issuesStore.deleteIssue(event_id);
  selectedIssue.value = null;
};

const handlePageChange = (page: string) => {
  issuesStore.filters.page = Number(page);
  issuesStore.fetchIssues();
};

onMounted(async () => {
  await issuesStore.fetchIssues();
})
</script>