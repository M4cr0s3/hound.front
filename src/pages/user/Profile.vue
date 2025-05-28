<template>
  <DashboardLayout>
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col sm:flex-row gap-8 mb-8">
        <div class="flex-shrink-0">
          <div
              class="h-32 w-32 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
            {{ userInitial }}
          </div>
        </div>

        <div class="flex-1">
          <div class="flex justify-between items-start">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ currentUser.name }}</h1>
              <p class="text-gray-600 mt-1">{{ currentUser.email }}</p>
              <div class="mt-2">
                <Badge :variant="currentUser.role?.title === RoleTitle.Maintainer ? 'primary' : 'secondary'">
                  {{ currentUser.role?.title }}
                </Badge>
              </div>
            </div>
            <button
                @click="showPasswordModal = true"
                class="inline-flex items-center cursor-pointer px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Icon icon="heroicons:lock-closed" class="mr-2 h-4 w-4"/>
              Сменить пароль
            </button>
          </div>

          <div class="grid grid-cols-3 gap-4 mt-6">
            <StatCard
                title="Команд"
                :value="stats.teams"
                icon="heroicons:user-group"
                class="bg-white"
            />
            <StatCard
                title="Активных задач"
                :value="stats.open_issues"
                icon="heroicons:exclamation-triangle"
                variant="warning"
                class="bg-white"
            />
            <StatCard
                title="Решенных задач"
                :value="stats.resolved_issues"
                icon="heroicons:check-badge"
                variant="success"
                class="bg-white"
            />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <h2 class="text-lg font-semibold text-gray-900">Мои команды</h2>
        </div>
        <div class="divide-y divide-gray-100">
          <RouterLink
              v-for="team in currentUser.teams"
              :key="team.id"
              :to="`/teams/${team.slug}`"
              class="block p-5 hover:bg-gray-50 transition-colors duration-150"
          >
            <div class="flex items-center space-x-4">
              <div
                  class="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-medium">
                {{ teamInitial(team.name) }}
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ team.name }}</p>
                <p class="text-sm text-gray-500">{{ team.members_count }} участников</p>
              </div>
            </div>
          </RouterLink>
          <EmptyState
              v-if="!currentUser.teams?.length"
              title="Нет команд"
              icon="heroicons:user-group"
              description="Вы не состоите ни в одной команде"
              class="p-8"
          />
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <h2 class="text-lg font-semibold text-gray-900">Мои задачи</h2>
        </div>
        <div class="divide-y divide-gray-100">
          <div
              v-for="assignment in currentUser.assignments"
              :key="assignment.id"
              class="p-5 hover:bg-gray-50 transition-colors duration-150"
          >
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 pt-1">
                <Badge
                    :variant="getIssueBadgeVariant(assignment.issue.status)"
                    :text="getIssueStatusText(assignment.issue.status)"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ assignment.issue.title }}
                  <Badge
                      :variant="getIssueLevelBadgeColor(assignment.issue.event.level)"
                      :text="assignment.issue.event.level"
                  />
                </p>
                <div class="mt-1 flex items-center space-x-3">
                  <span class="text-xs text-gray-500">
                    Проект: {{ assignment.issue.project?.name }}
                  </span>
                </div>
              </div>
              <RouterLink
                  :to="`/issues/${assignment.issue.id}`"
                  class="text-gray-400 hover:text-gray-500"
              >
                <Icon icon="heroicons:chevron-right" class="h-5 w-5"/>
              </RouterLink>
            </div>
          </div>
          <EmptyState
              v-if="!currentUser.assignments?.length"
              title="Нет задач"
              icon="heroicons:check-badge"
              description="Вам не назначено ни одной задачи"
              class="p-8"
              small
          />
        </div>
      </div>
    </div>

    <Modal
        :is-open="showPasswordModal"
        @close="showPasswordModal = false"
        title="Смена пароля"
    >
      <template #content>
        <TheForm
            class="space-y-3"
            :schema="schema"
            :data="passwordForm"
            :submit="updatePassword"
            ref="passwordFormRef"
            v-slot="{ errors }"
        >
          <InputField
              v-model="passwordForm.current_password"
              label="Текущий пароль"
              type="password"
              required
              icon="heroicons:lock-closed"
              id="current-password"
              placeholder="Текущий пароль"
              :error="errors?.current_password"
          />
          <InputField
              v-model="passwordForm.password"
              label="Новый пароль"
              type="password"
              required
              icon="heroicons:key"
              id="password"
              placeholder="••••••••"
              :error="errors?.password"
          />
          <InputField
              v-model="passwordForm.password_confirmation"
              label="Подтверждение пароля"
              type="password"
              required
              icon="heroicons:key"
              id="password-confirmation"
              placeholder="••••••••"
              :error="errors?.password_confirmation"
          />
          <div class="flex justify-end gap-3">
            <Button variant="secondary" @click="showPasswordModal = false">
              Отмена
            </Button>
            <Button
                type="submit"
                :is-loading="isUpdatingPassword"
            >
              Сохранить
            </Button>
          </div>
        </TheForm>
      </template>
    </Modal>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { httpClient, RoleTitle, type User } from '@/api';
import { EmptyState } from "@/components/projects/settings/notification";
import StatCard from "@/components/projects/StatCard.vue";
import { Badge, Button, InputField, Modal, TheForm } from '@/components/ui';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import { useUsersStore } from '@/stores/users.ts';
import { Icon } from '@iconify/vue';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { toast } from "vue-sonner";
import { schema } from "./password.schema.ts";

const store = useUsersStore();
const { currentUser } = storeToRefs(store)

const stats = ref({
  teams: 0,
  open_issues: 0,
  resolved_issues: 0
});

const passwordFormRef = ref<HTMLFormElement | null>(null);
const showPasswordModal = ref(false);
const isUpdatingPassword = ref(false);

const passwordForm = ref({
  current_password: '',
  password: '',
  password_confirmation: ''
});

const BADGE_VARIANT = { 
  open: 'primary',
  in_progress: 'warning',
  resolved: 'success',
  closed: 'secondary'
}

const BADGE_COLOR = {
  error: 'danger',
  warning: 'warning',
  info: 'info',
}

const ISSUE_STATUS = {
  open: 'Открыта',
  in_progress: 'В работе',
  resolved: 'Решена',
  closed: 'Закрыта'
}

const userInitial = computed(() => {
  return currentUser.value.name ? currentUser.value.name.charAt(0).toUpperCase() : '';
});

const teamInitial = (name: string) => {
  return name ? name.charAt(0).toUpperCase() : '';
};

const getIssueBadgeVariant = (status: keyof typeof BADGE_VARIANT): Variant => {
  return (BADGE_VARIANT[status] || 'default') as Variant;
};

const getIssueLevelBadgeColor = (status: keyof typeof BADGE_COLOR): Variant => {
  return (BADGE_COLOR[status] || 'default') as Variant;
};

const getIssueStatusText = (status: keyof typeof ISSUE_STATUS): Variant  => {
  return (ISSUE_STATUS[status] || status) as Variant;
};

const fetchProfile = async () => {
  try {
    const response = await httpClient.get<{ user: User, stats: typeof stats.value }>('/users/profile');
    currentUser.value = response.user;
    stats.value = response.stats;
  } catch (error) {
    console.error('Error fetching profile:', error);
  }
};

const updatePassword = async () => {
  isUpdatingPassword.value = true;
  try {
    await httpClient.post('/users/profile/password', passwordForm.value);
    showPasswordModal.value = false;
    passwordForm.value = {
      current_password: '',
      new_password: '',
      new_password_confirmation: ''
    };
    toast.success('Пароль успешно обновлен');
  } catch (error) {
    toast.error('Ошибка обновления пароля', {description: error.data.message});
  } finally {
    isUpdatingPassword.value = false;
  }
};

onMounted(async () => {
  await fetchProfile();
});
</script>

<style scoped>
.avatar {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>