<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Редактирование команды {{ team?.name }}
          </h3>
        </div>

        <form
            @submit.prevent="handleSubmit"
            class="px-4 py-5 sm:p-6"
        >
          <div class="space-y-6">
            <InputField
                id="name"
                label="Название команды"
                v-model="form.name"
                :error="errors?.name"
                required
            />

            <InputField
                id="slug"
                label="URL-идентификатор"
                v-model="form.slug"
                :error="errors?.slug"
                description="Уникальный идентификатор команды в URL. Можно оставить пустым для автоматической генерации."
            />

            <div class="pt-5">
              <div class="flex justify-end gap-x-3">
                <Button
                    variant="secondary"
                    @click="resetForm"
                >
                  Сбросить
                </Button>
                <Button
                    @click="handleSubmit"
                    :is-loading="isSubmitting"
                    :loading-text="'Сохранение...'"
                    :disabled="isSubmitting"
                >
                  Сохранить изменения
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Участники команды
          </h3>
          <Button
              @click="isAddMemberModalOpen = true"
              class="text-xs px-3 py-1"
          >
            Добавить участника
          </Button>
        </div>

        <div class="px-4 py-5 sm:p-6" v-if="team?.members?.length">
          <ul class="divide-y divide-gray-200">
            <li
                v-for="member in team?.members"
                :key="member.id"
                class="py-4 flex items-center justify-between"
            >
              <div class="flex items-center">
                <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span class="text-gray-600">{{ getInitials(member.name) }}</span>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">{{ member.name }}</p>
                  <p class="text-sm text-gray-500">{{ member.email }}</p>
                </div>
              </div>
              <button
                  @click="removeMember(member.id)"
                  class="text-red-600 hover:text-red-900 text-sm font-medium cursor-pointer"
              >
                Удалить
              </button>
            </li>
          </ul>
        </div>
        <EmptyState
            v-else
            title="Участники не найдены"
            icon="heroicons:user-group"
            description="Участники в данной команде отсутствуют. Добавьте их."
        />
      </div>

      <Modal
          :is-open="isAddMemberModalOpen"
          @close="isAddMemberModalOpen = false"
      >
        <template #title>Добавить участника</template>

        <template #content>
          <form @submit.prevent="handleAddMembers" class="space-y-4">
            <SelectField
                v-model="selectedUserIds"
                label="Выберите участников"
                :options="availableUsers"
                option-label="name"
                option-value="id"
                :error="memberErrors?.user_ids?.[0]"
                :multiple="true"
                :search-debounce="500"
                @search="handleUserSearch"
            />
          </form>
        </template>

        <template #footer>
          <div class="flex gap-2">
            <Button
                variant="secondary"
                @click="isAddMemberModalOpen = false"
            >
              Отмена
            </Button>
            <Button
                :is-loading="isAddingMember"
                :disabled="isAddingMember || selectedUserIds.length === 0"
                @click="handleAddMembers"
            >
              <span v-if="isAddingMember">Добавление...</span>
              <span v-else>Добавить выбранных ({{ selectedUserIds.length }})</span>
            </Button>
          </div>
        </template>
      </Modal>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import {Button, InputField, Modal, SelectField} from '@/components/ui';
import {TeamsApi, type Team, type User} from '@/api';
import {EmptyState} from "@/components/projects/settings/notification";

const {slug} = defineProps<{
  slug: string;
}>();

const team = ref<Team>({} as Team);
const form = ref({
  name: '',
  slug: '',
});
const errors = ref<Record<string, string[]>>({});
const isSubmitting = ref(false);

const availableUsers = ref<User[]>([]);
const isAddMemberModalOpen = ref(false);
const isAddingMember = ref(false);
const memberErrors = ref<Record<string, string[]>>({});
const selectedUserIds = ref<number[]>([]);
const searchQuery = ref('');

const fetchTeam = async () => {
  try {
    const response = await TeamsApi.get(slug);
    team.value = response;
    form.value = {
      name: response.name,
      slug: response.slug,
    };
  } catch (error) {
    console.error('Ошибка загрузки команды:', error);
  }
};

const fetchAvailableUsers = async () => {
  try {
    availableUsers.value = (await TeamsApi.getAvailableUsers(team.value.id, searchQuery.value)).users;
  } catch (error) {
    console.error('Ошибка загрузки пользователей:', error);
  }
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  errors.value = {};

  try {
    await TeamsApi.update(team.value.id, form.value);
    await fetchTeam();
  } catch (error: any) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors;
    }
    console.error('Ошибка обновления команды:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleUserSearch = async (query: string) => {
  searchQuery.value = query;
  try {
    availableUsers.value = (await TeamsApi.getAvailableUsers(team.value.id, query)).users;
  } catch (error) {
    console.error('Ошибка поиска пользователей:', error);
  }
};

const resetForm = () => {
  if (team.value) {
    form.value = {
      name: team.value.name,
      slug: team.value.slug,
    };
  }
  errors.value = {};
};

const handleAddMembers = async () => {
  if (selectedUserIds.value.length === 0) return;

  isAddingMember.value = true;
  memberErrors.value = {};

  try {
    await TeamsApi.addMembers(team.value.id, {user_ids: selectedUserIds.value});
    await fetchTeam();
    selectedUserIds.value = [];
    await fetchAvailableUsers();
    isAddMemberModalOpen.value = false;
  } catch (error: any) {
    if (error.response?.data?.errors) {
      memberErrors.value = error.response.data.errors;
    }
    console.error('Ошибка добавления участников:', error);
  } finally {
    isAddingMember.value = false;
  }
};

const removeMember = async (userId: number) => {
  if (!confirm('Вы уверены, что хотите удалить этого участника?')) return;

  try {
    await TeamsApi.removeMember(team.value.id, userId);
    await fetchTeam();
    await fetchAvailableUsers();
  } catch (error) {
    console.error('Ошибка удаления участника:', error);
  }
};

const getInitials = (name: string) => {
  return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
};

onMounted(async () => {
  await fetchTeam();
  await fetchAvailableUsers();
});
</script>