<template>
	<div>
		<label class="block text-sm font-medium text-gray-700">Команды</label>
		<div class="mt-1">
			<SelectField
				:options="teams"
				option-label="name"
				option-value="id"
				placeholder="Выберите команды"
				multiple
				v-model="selectedTeamIds"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { httpClient, type Team } from '../../api';
import { SelectField } from '../../components/ui';

const props = defineProps<{
	modelValue: Team[];
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: Team[]): void;
}>();

const teams = ref<Team[]>([]);
const selectedTeamIds = ref<number[]>([]);

onMounted(async () => {
	try {
		const response = await httpClient.get<Team[]>('/teams');
		teams.value = response;
	} catch (error) {
		console.error('Error fetching teams:', error);
	}
});

watch(selectedTeamIds, (newIds) => {
	const selectedTeams = teams.value.filter((team) => newIds.includes(team.id));
	emit('update:modelValue', selectedTeams);
});

watch(
	() => props.modelValue,
	(newTeams) => {
		selectedTeamIds.value = newTeams.map((team) => team.id);
	},
	{ immediate: true }
);
</script>
