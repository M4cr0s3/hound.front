<template>
  <form @submit.prevent="submit" class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700">Название</label>
      <input
          v-model="form.title"
          type="text"
          required
          class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
      />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Статус</label>
      <SelectField
          v-model="form.status"
          :options="statusOptions"
          placeholder="Выберите статус"
          required
      />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Приоритет</label>
      <SelectField
          v-model="form.priority"
          :options="priorityOptions"
          placeholder="Выберите приоритет"
          required
      />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Срок</label>
      <input
          v-model="form.due_date"
          type="date"
          class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
      />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Назначенные пользователи</label>
      <SelectField
          v-model="form.assignees"
          :options="userOptions"
          placeholder="Выберите пользователей"
          multiple
          searchable
      />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Теги</label>
      <SelectField
          v-model="form.tags"
          :options="tagOptions"
          placeholder="Выберите теги"
          multiple
          searchable
      />
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" variant="secondary" @click="emit('cancel')">Отмена</Button>
      <Button type="submit" :disabled="isSubmitting">Сохранить</Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {SelectField, Button} from '@/components/ui'
import {httpClient, type IssueStatus, type IssuePriority, type Issue, type User} from '@/api';

const props = defineProps<{
  issue?: Issue;
}>();

const emit = defineEmits<{
  (e: 'submit', data: Partial<Issue>): void;
  (e: 'cancel'): void;
}>();

const isSubmitting = ref(false);
const form = ref<Partial<Issue>>({
  title: props.issue?.title || '',
  status: props.issue?.status || IssueStatus.Open,
  priority: props.issue?.priority || IssuePriority.Low,
  due_date: props.issue?.due_date || '',
  assignees: props.issue?.assignees || [],
  tags: props.issue?.tags || [],
});

const statusOptions = Object.values(IssueStatus).map((status) => ({
  value: status,
  label: status.replace('_', ' ').toUpperCase(),
}));

const priorityOptions = Object.values(IssuePriority).map((priority) => ({
  value: priority,
  label: priority.toUpperCase(),
}));

const tagOptions = [
  {value: 'bug', label: 'Bug'},
  {value: 'feature', label: 'Feature'},
  {value: 'enhancement', label: 'Enhancement'},
];

const userOptions = ref<{ value: User; label: string }[]>([]);

const fetchUsers = async () => {
  try {
    const response = await httpClient.get<User[]>('/users');
    userOptions.value = response.data.map((user) => ({
      value: user,
      label: user.name,
    }));
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
};

onMounted(fetchUsers);

const submit = () => {
  isSubmitting.value = true;
  emit('submit', {...form.value, assignees: form.value.assignees?.map((user: User) => user.id)});
  isSubmitting.value = false;
};
</script>