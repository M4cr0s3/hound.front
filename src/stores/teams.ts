import { defineStore } from 'pinia';
import type { Team, CreateTeamBody } from '../api';
import { ref } from 'vue';
import { createTeam, getTeams } from '../api';
import { router } from '../router';
import { ROUTES } from '../router/routes.ts';

export const useTeamsStore = defineStore('teams', () => {
	const teams = ref<Team[]>([]);
	const isLoadingTeams = ref(false);
	const isLoading = ref(false);

	const fetchTeams = async () => {
		isLoadingTeams.value = true;
		try {
			const response = await getTeams();
			teams.value = response.data;
		} finally {
			isLoadingTeams.value = false;
		}
	};

	const create = async (body: CreateTeamBody) => {
		isLoading.value = true;
		try {
			await createTeam(body);
			await router.push(ROUTES.TEAMS);
		} finally {
			isLoading.value = false;
		}
	};

	return { teams, isLoadingTeams, fetchTeams, create };
});
