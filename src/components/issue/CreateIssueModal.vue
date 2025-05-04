<template>
	<Modal
		:isOpen="isOpen"
		@close="close"
	>
		<template #title> Создание проблемы для события #{{ eventId }} </template>

		<template #content>
			<form @submit.prevent="submit">
				<div class="mb-4">
					<label
						class="block text-gray-700 text-sm font-bold mb-2"
						for="title"
					>
						Заголовок
					</label>
					<input
						id="title"
						v-model="form.title"
						class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						type="text"
						placeholder="Введите заголовок проблемы"
						required
					/>
				</div>

				<div class="mb-4">
					<label
						class="block text-gray-700 text-sm font-bold mb-2"
						for="description"
					>
						Описание
					</label>
					<textarea
						id="description"
						v-model="form.description"
						class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						rows="3"
						placeholder="Опишите проблему подробнее"
					></textarea>
				</div>

				<div class="mb-4">
					<label class="block text-gray-700 text-sm font-bold mb-2">
						Назначить на
					</label>
					<div class="space-y-2">
						<div
							v-for="team in teams"
							:key="team.id"
							class="flex items-center"
						>
							<input
								:id="`team-${team.id}`"
								v-model="form.teams"
								type="checkbox"
								:value="team.id"
								class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
							/>
							<label
								:for="`team-${team.id}`"
								class="ml-2 block text-sm text-gray-700"
							>
								{{ team.name }}
							</label>
						</div>
					</div>
				</div>
			</form>
		</template>

		<template #footer>
			<button
				type="button"
				class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
				@click="close"
			>
				Отмена
			</button>
			<button
				type="submit"
				class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
				@click="submit"
				:disabled="isSubmitting"
			>
				<span v-if="isSubmitting">Создание...</span>
				<span v-else>Создать проблему</span>
			</button>
		</template>
	</Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Modal } from '../ui';

defineProps({
	eventId: {
		type: String,
		required: true,
	},
	isOpen: {
		type: Boolean,
		required: true,
	},
});

const emit = defineEmits(['close', 'created']);

const form = ref({
	title: '',
	description: '',
	teams: [] as string[],
});

const isSubmitting = ref(false);

const close = () => {
	emit('close');
};

const submit = async () => {
	isSubmitting.value = true;
	try {
		emit('created');
		close();
	} finally {
		isSubmitting.value = false;
	}
};

const teams = ref([
	{ id: '1', name: 'Frontend Team' },
	{ id: '2', name: 'Backend Team' },
	{ id: '3', name: 'QA Team' },
]);
</script>
