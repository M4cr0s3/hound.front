<template>
  <DashboardLayout>
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div class="flex items-center space-x-4">
        <div class="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-md">
          <Icon icon="heroicons:user-group" class="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Редактирование команды</h1>
          <p class="text-sm text-gray-500">Обновите информацию о команде и управляйте участниками</p>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h2 class="text-lg font-semibold text-gray-900">Основные настройки</h2>
          </div>
          <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
            <div class="space-y-5">
              <InputField
                  id="name"
                  label="Название команды"
                  v-model="form.name"
                  :error="errors?.name"
                  required
                  placeholder="Введите название команды"
              >
                <template #icon>
                  <Icon icon="heroicons:tag" class="h-5 w-5 text-gray-400" />
                </template>
              </InputField>

              <InputField
                  id="slug"
                  label="URL-идентификатор"
                  v-model="form.slug"
                  :error="errors?.slug"
                  description="Уникальный идентификатор команды в URL. Можно оставить пустым для автоматической генерации."
                  placeholder="team-identifier"
              >
                <template #icon>
                  <Icon icon="heroicons:link" class="h-5 w-5 text-gray-400" />
                </template>
              </InputField>
            </div>

            <div class="pt-4 flex justify-end gap-x-3 border-t border-gray-100">
              <Button
                  variant="secondary"
                  @click="resetForm"
                  class="px-4 py-2"
              >
                <Icon icon="heroicons:arrow-path" class="mr-2 h-4 w-4" />
                Сбросить
              </Button>
              <Button
                  @click="handleSubmit"
                  :is-loading="isSubmitting"
                  :loading-text="'Сохранение...'"
                  :disabled="isSubmitting"
                  class="px-4 py-2"
              >
                <Icon icon="heroicons:check" class="mr-2 h-4 w-4" />
                Сохранить изменения
              </Button>
            </div>
          </form>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Участники команды</h2>
              <p class="text-sm text-gray-500 mt-1">Управляйте составом вашей команды</p>
            </div>
            <Button
                @click="isAddMemberModalOpen = true"
                variant="outline"
                class="text-sm px-4 py-2"
            >
              <Icon icon="heroicons:plus" class="mr-2 h-4 w-4" />
              Добавить участника
            </Button>
          </div>

          <div class="divide-y divide-gray-100">
            <div v-if="team?.members?.length" class="p-6">
              <ul class="space-y-4">
                <li
                    v-for="member in team?.members"
                    :key="member.id"
                    class="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                >
                  <div class="flex items-center space-x-4">
                    <div class="relative">
                      <div class="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-medium shadow-sm">
                        {{ getInitials(member.name) }}
                      </div>
                      <span class="absolute -bottom-1 -right-1 bg-green-400 rounded-full h-3 w-3 border-2 border-white"></span>
                    </div>
                    <div>
                      <p class="text-base font-medium text-gray-900">{{ member.name }}</p>
                      <p class="text-sm text-gray-500">{{ member.email }}</p>
                    </div>
                  </div>
                  <button
                      @click="removeMember(member.id)"
                      class="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity duration-150 p-1 rounded-full hover:bg-red-50"
                  >
                    <Icon icon="heroicons:trash" class="h-5 w-5 cursor-pointer" />
                  </button>
                </li>
              </ul>
            </div>
            <EmptyState
                v-else
                title="Нет участников"
                icon="heroicons:user-group"
                description="Добавьте участников в команду, чтобы начать совместную работу."
                class="p-8 text-center"
            />
          </div>
        </div>
      </div>

      <Modal
          :is-open="isAddMemberModalOpen"
          @close="isAddMemberModalOpen = false"
      >
        <template #title>
          <div class="flex items-center space-x-2">
            <Icon icon="heroicons:user-plus" class="h-6 w-6 text-indigo-600" />
            <span>Добавить участника</span>
          </div>
        </template>

        <template #content>
          <form @submit.prevent="handleAddMembers" class="space-y-6">
            <SelectField
                v-model="selectedUserIds"
                label="Выберите участников"
                :options="availableUsers"
                option-label="name"
                option-value="id"
                :error="memberErrors?.user_ids?.[0]"
                multiple
                searchable
                :search-debounce="500"
                @search="handleUserSearch"
                placeholder="Выберите участников"
            >
              <template #option="{ option }">
                <div class="flex items-center space-x-3">
                  <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-medium">
                    {{ getInitials(option.name) }}
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ option.name }}</p>
                    <p class="text-xs text-gray-500">{{ option.email }}</p>
                  </div>
                </div>
              </template>
            </SelectField>
          </form>
        </template>

        <template #footer>
          <div class="flex justify-end gap-3">
            <Button
                variant="secondary"
                @click="isAddMemberModalOpen = false"
                class="px-4 py-2"
            >
              Отмена
            </Button>
            <Button
                :is-loading="isAddingMember"
                :disabled="isAddingMember || selectedUserIds.length === 0"
                @click="handleAddMembers"
                class="px-4 py-2"
            >
              <template v-if="isAddingMember">
                <Icon icon="heroicons:arrow-path" class="h-4 w-4 animate-spin mr-2" />
                Добавление...
              </template>
              <template v-else>
                <Icon icon="heroicons:plus" class="h-4 w-4 mr-2" />
                Добавить выбранных ({{ selectedUserIds.length }})
              </template>
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
import { Icon } from '@iconify/vue';
import {toast} from "vue-sonner";

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
    toast.success('Команда успешно обновлена');
  } catch (error: any) {
    if (error?.data?.errors) {
      errors.value = error.data.errors;
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
    toast.success('Участник(и) успешно добавлены');
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
  try {
    await TeamsApi.removeMember(team.value.id, userId);
    await fetchTeam();
    await fetchAvailableUsers();
    toast.success('Участник успешно удален');
  } catch (error) {
    toast.error('Ошибка при удалении участника');
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

<style scoped>
button, a, .select-field {
  transition: all 0.2s ease;
}

.modal-content {
  scrollbar-width: thin;
  scrollbar-color: #6366f1 #f1f1f1;
}

.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.modal-content::-webkit-scrollbar-thumb {
  background-color: #6366f1;
  border-radius: 10px;
}
</style>