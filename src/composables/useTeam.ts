import { type Ref, ref } from 'vue';
import { type Team, TeamsApi } from '../api';
import axios from 'axios';

interface TeamForm {
	name: string;
	slug: string;
}

interface TeamErrors {
	name?: string;
	slug?: string;
}

interface UseTeamReturn {
	form: Ref<TeamForm>;
	errors: Ref<TeamErrors>;
	isSubmitting: Ref<boolean>;
	createTeamHandler: () => Promise<void>;
	validateForm: () => boolean;
	teams: Ref<Team[]>;
	isLoadingTeams: Ref<boolean>;
	fetchTeams: () => Promise<void>;
}

export const useTeam = (): UseTeamReturn => {
	const form = ref<TeamForm>({
		name: '',
		slug: '',
	});

	const errors = ref<TeamErrors>({});

	const isSubmitting = ref(false);
	const isLoadingTeams = ref(false);

	const teams = ref<Team[]>([]);

	const validateForm = (): boolean => {
		const newErrors: TeamErrors = {};

		if (!form.value.name.trim()) {
			newErrors.name = 'Team name is required';
		} else if (form.value.name.length > 255) {
			newErrors.name = 'Team name must not exceed 255 characters';
		}

		if (form.value.slug && form.value.slug.length > 255) {
			newErrors.slug = 'Team slug must not exceed 255 characters';
		}

		errors.value = newErrors;
		return Object.keys(newErrors).length === 0;
	};

	const createTeamHandler = async (): Promise<void> => {
		if (!validateForm()) return;

		isSubmitting.value = true;

		try {
			await TeamsApi.create({
				name: form.value.name,
				slug: form.value.slug || undefined,
			});
		} catch (error: unknown) {
			if (axios.isAxiosError(error) && error.response) {
				if (error.response.status === 422) {
					errors.value = error.response.data.errors || {};
				} else {
					errors.value = { name: 'An error occurred while creating the team' };
					console.error('Error creating team:', error);
				}
			}
		} finally {
			isSubmitting.value = false;
		}
	};

	const fetchTeams = async (): Promise<void> => {
		isLoadingTeams.value = true;
		try {
			teams.value = TeamsApi.getAll();
		} finally {
			isLoadingTeams.value = false;
		}
	};

	return {
		form,
		errors,
		isSubmitting,
		createTeamHandler,
		validateForm,
		teams,
		isLoadingTeams,
		fetchTeams,
	};
};
