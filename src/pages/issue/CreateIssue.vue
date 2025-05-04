<template>
	<DashboardLayout>
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
			<h1 class="text-2xl font-bold text-gray-900 mb-6">Создать проблему</h1>
			<form
				@submit.prevent="submitIssue"
				class="space-y-6"
			>
				<div>
					<label
						for="title"
						class="block text-sm font-medium text-gray-700"
						>Заголовок</label
					>
					<input
						id="title"
						v-model="form.title"
						type="text"
						required
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					/>
				</div>

				<div>
					<label
						for="culprit"
						class="block text-sm font-medium text-gray-700"
						>Виновник</label
					>
					<input
						id="culprit"
						v-model="form.culprit"
						type="text"
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					/>
				</div>

				<div>
					<SelectField
						id="status"
						label="Статус"
						v-model="form.status"
						:options="statusOptions"
						option-label="label"
						option-value="value"
						placeholder="Выберите статус"
					/>
				</div>

				<div>
					<SelectField
						id="priority"
						label="Приоритет"
						v-model="form.priority"
						:options="priorityOptions"
						option-label="label"
						option-value="value"
						placeholder="Выберите приоритет"
					/>
				</div>

				<div>
					<label
						for="due_date"
						class="block text-sm font-medium text-gray-700"
						>Дата выполнения</label
					>
					<input
						id="due_date"
						v-model="form.due_date"
						type="date"
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					/>
				</div>

				<!-- <AssigneeSelector v-model="form.assignees" />

				<TeamSelector v-model="form.teams" />

				<TagInput v-model="form.tags" /> -->

				<div class="flex justify-end space-x-3">
					<button
						type="button"
						class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
						@click="cancel"
					>
						Отмена
					</button>
					<button
						type="submit"
						class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
						:disabled="isSubmitting"
					>
						Создать
					</button>
				</div>
			</form>
		</div>
	</DashboardLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import DashboardLayout from '../../layouts/DashboardLayout.vue';
import { SelectField } from '../../components/ui';
// import { AssigneeSelector, TeamSelector } from '../../components/issue';
import {
	api,
	IssueStatus,
	IssuePriority,
	type Issue,
	// type User,
	// type Team,
} from '../../api';

const router = useRouter();
// const route = useRoute();

const props = defineProps<{
	slug: string;
	eventId: string;
}>();

const isSubmitting = ref(false);

const form = ref<Issue>({
	event_id: props.eventId,
	title: '',
	culprit: '',
	status: IssueStatus.Open,
	priority: IssuePriority.Medium,
	due_date: '',
	assignees: [],
	teams: [],
	tags: [],
});

const statusOptions = [
	{ value: IssueStatus.Open, label: 'Открыта' },
	{ value: IssueStatus.InProgress, label: 'В работе' },
	{ value: IssueStatus.Resolved, label: 'Решена' },
	{ value: IssueStatus.Closed, label: 'Закрыта' },
];

const priorityOptions = [
	{ value: IssuePriority.Low, label: 'Низкий' },
	{ value: IssuePriority.Medium, label: 'Средний' },
	{ value: IssuePriority.High, label: 'Высокий' },
	{ value: IssuePriority.Critical, label: 'Критический' },
];

const submitIssue = async () => {
	isSubmitting.value = true;
	try {
		await api.post(`/projects/${props.slug}/issues`, {
			...form.value,
			assignees: form.value.assignees?.map((user) => user.id),
			teams: form.value.teams?.map((team) => team.id),
		});
		router.push(`/projects/${props.slug}/events/${props.eventId}`);
	} catch (error) {
		console.error('Error creating issue:', error);
	} finally {
		isSubmitting.value = false;
	}
};

const cancel = () => {
	router.push(`/projects/${props.slug}/events/${props.eventId}`);
};
</script>
