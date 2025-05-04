<template>
	<div>
		<label class="block text-sm font-medium text-gray-700"
			>Назначенные пользователи</label
		>
		<div class="mt-1">
			<SelectField
				:options="users"
				option-label="name"
				option-value="id"
				placeholder="Выберите пользователей"
				multiple
				v-model="selectedAssigneeIds"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { SelectField } from '../../components/ui/';
import { api, type User } from '../../api';

const props = defineProps<{
	modelValue: User[];
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: User[]): void;
}>();

const users = ref<User[]>([]);
const selectedAssigneeIds = ref<number[]>([]);

onMounted(async () => {
	try {
		const response = await api.get('/users');
		users.value = response.data;
	} catch (error) {
		console.error('Error fetching users:', error);
	}
});

watch(selectedAssigneeIds, (newIds) => {
	const selectedUsers = users.value.filter((user) => newIds.includes(user.id));
	emit('update:modelValue', selectedUsers);
});

watch(
	() => props.modelValue,
	(newAssignees) => {
		selectedAssigneeIds.value = newAssignees.map((user) => user.id);
	},
	{ immediate: true }
);
</script>
