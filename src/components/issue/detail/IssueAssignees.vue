<template>
  <div class="bg-white shadow rounded-lg p-4 mt-4">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-medium text-gray-900">Назначенные</h3>
      <button
          @click="isAddAssigneeOpen = true"
          class="text-sm text-indigo-600 hover:text-indigo-900 cursor-pointer"
      >
        Добавить
      </button>
    </div>

    <div class="space-y-3">
      <div v-if="assignees.users.length > 0">
        <h4 class="text-xs font-medium text-gray-500 mb-2">Пользователи</h4>
        <ul class="space-y-2">
          <li v-for="user in assignees.users" :key="`user-${user.id}`" class="flex items-center justify-between">
            <div class="flex items-center">
              <Avatar
                  class="mr-3"
                  size="sm"
                  :name="user.name"
              />
              <span class="text-sm font-medium text-gray-900">{{ user.name }}</span>
            </div>
            <button
                @click="issueStore.removeAssignee(issueStore.issue.id, 'user', user.id)"
                class="text-gray-400 hover:text-gray-500"
            >
              <Icon icon="mdi:close" class="h-5 w-5 cursor-pointer"/>
            </button>
          </li>
        </ul>
      </div>

      <div v-if="assignees.teams.length > 0">
        <h4 class="text-xs font-medium text-gray-500 mb-2">Команды</h4>
        <ul class="space-y-2">
          <li v-for="team in assignees.teams" :key="`team-${team.id}`" class="flex items-center justify-between">
            <div class="flex items-center">
              <span class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                <Icon icon="mdi:account-group" class="h-5 w-5 text-gray-600"/>
              </span>
              <span class="text-sm font-medium text-gray-900">{{ team.name }}</span>
            </div>
            <button
                @click="issueStore.removeAssignee(issueStore.issue.id, 'team', team.id)"
                class="text-gray-400 hover:text-gray-500"
            >
              <Icon icon="mdi:close" class="h-5 w-5 cursor-pointer"/>
            </button>
          </li>
        </ul>
      </div>

      <p v-if="assignees.users.length === 0 && assignees.teams.length === 0" class="text-sm text-gray-500">
        <EmptyState
            title="Назначенные отсутствуют"
            description="Добавьте ответственных за эту задачу"
            icon="heroicons:user-group"
        />
      </p>
    </div>

    <Modal :is-open="isAddAssigneeOpen" @close="isAddAssigneeOpen = false">
      <template #title>Добавить ответственного</template>
      <template #content>
        <div class="space-y-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Тип</label>
          <SelectField
              :options="[{ value: 'user', label: 'Пользователь' }, { value: 'team', label: 'Команда' }]"
              option-label="label"
              option-value="value"
              v-model="assigneeType"
          />

          <div v-if="assigneeType === 'user'">
            <label class="block text-sm font-medium text-gray-700 mb-1">Выбрать пользователей</label>
            <SelectField
                @search="fetchAvailableUsers"
                :options="availableUsers"
                option-label="name"
                option-value="id"
                v-model="selectedUserIds"
                multiple
                searchable
                placeholder="Выберите пользователей"
            />
          </div>

          <div v-else>
            <label class="block text-sm font-medium text-gray-700 mb-1">Выберите команды</label>
            <SelectField
                @search="fetchAvailableTeams"
                :options="availableTeams"
                option-label="name"
                option-value="id"
                v-model="selectedTeamIds"
                multiple
                searchable
                placeholder="Выберите команды"
            />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex gap-2">
          <Button
              variant="secondary"
              @click="isAddAssigneeOpen = false"
          >
            Отмена
          </Button>
          <Button @click="addAssignee">
            Добавить
          </Button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, watch} from 'vue';
import {Icon} from '@iconify/vue'
import {Avatar, Button, Modal, SelectField} from '@/components/ui';
import {httpClient, type Team, type User} from '@/api';
import {useIssuesStore} from "@/stores";
import {EmptyState} from "@/components/projects/settings/notification";

const props = defineProps<{
  assignees: {
    users: any[];
    teams: any[];
  };
}>();

const emit = defineEmits(['assignee-added', 'assignee-removed']);

const issueStore = useIssuesStore();

const isAddAssigneeOpen = ref(false);
const assigneeType = ref<'user' | 'team'>('user');
const selectedUserIds = ref<number[]>([]);
const selectedTeamIds = ref<number[]>([]);
const availableUsers = ref<User[]>([]);
const availableTeams = ref<Team[]>([]);

const addAssignee = () => {
  if (assigneeType.value === 'user') {
    issueStore.addAssignee(issueStore.issue.id, 'user', selectedUserIds.value);
  } else {
    issueStore.addAssignee(issueStore.issue.id, 'team', selectedTeamIds.value);
  }
  isAddAssigneeOpen.value = false;
};

const removeAssignee = (type: 'user' | 'team', id: number) => {
  issueStore.removeAssignee(issueStore.issue.id, type, id);
}

const resetSelection = () => {
  selectedUserIds.value = null;
  selectedTeamIds.value = null;
};

const fetchAvailableUsers = async (query: string) => {
  try {
    availableUsers.value = (await httpClient.post<{ users: User[] }>('/users/available', {
      query: {q: query},
      issue_id: issueStore.issue.id,
    })).users;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const fetchAvailableTeams = async (query: string) => {
  try {
    availableTeams.value = (await httpClient.get<{ teams: Team[] }>('/teams/available', {
      query: {q: query},
      issue_id: issueStore.issue.id,
    })).teams;
  } catch (error) {
    console.error('Error fetching teams:', error);
  }
};

onMounted(async () => {
  if (issueStore.issue.id) {
    await fetchAvailableUsers();
    await fetchAvailableTeams();
  }
});

watch(isAddAssigneeOpen, (val) => {
  if (val) {
    if (assigneeType.value === 'user') {
      fetchAvailableUsers();
    } else {
      fetchAvailableTeams();
    }
  } else {
    resetSelection();
  }
});

watch(assigneeType, (newType) => {
  if (newType === 'user') {
    fetchAvailableUsers();
  } else {
    fetchAvailableTeams();
  }
  resetSelection();
});
</script>