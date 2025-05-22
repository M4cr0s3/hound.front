import { type Assignments, type CreateTeamBody, type Id, type Project, type Team, TeamsApi, type User } from '@/api';
import { router } from '@/router';
import { ROUTES } from '@/router/routes.ts';
import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

export const useTeamsStore = defineStore('teams', () => {
  const teams = ref<Team[]>([]);
  const team = ref<Team>(
    {
      id: 0,
      name: 'none',
      slug: '',
      members: {} as User[],
      projects: {} as Project[],
      assignments: {} as Assignments[]
    });
  const isLoadingTeams = ref(false);
  const isLoading = ref(false);

  const handleLoading = async (
    action: () => Promise<void>,
    loadingRef: Ref<boolean>
  ) => {
    loadingRef.value = true;
    try {
      await action();
    } finally {
      loadingRef.value = false;
    }
  };

  const fetchTeam = (slug: string) => {
    handleLoading(async () => {
      team.value = await TeamsApi.get(slug)
    }, isLoading);
  };

  const fetchTeams = () =>
    handleLoading(async () => {
      teams.value = await TeamsApi.getAll();
    }, isLoadingTeams);

  const create = (body: CreateTeamBody) =>
    handleLoading(async () => {
      await TeamsApi.create(body);
      await router.push({ path: ROUTES.TEAM.INDEX });
    }, isLoading);

  const destroy = (id: Id) =>
    handleLoading(async () => {
      await TeamsApi.delete(id);
      await fetchTeams();
    }, isLoading);

  return { teams, team, isLoading, isLoadingTeams, fetchTeam, fetchTeams, create, destroy };
});
