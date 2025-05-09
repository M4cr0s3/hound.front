import {defineStore} from 'pinia';
import {type Team, type CreateTeamBody, type Id, TeamsApi} from '@/api';
import {ref, type Ref} from 'vue';
import {router} from '@/router';
import {ROUTES} from '@/router/routes.ts';

export const useTeamsStore = defineStore('teams', () => {
  const teams = ref<Team[]>([]);
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

  const fetchTeams = () =>
      handleLoading(async () => {
        teams.value = await TeamsApi.getAll();
      }, isLoadingTeams);

  const create = (body: CreateTeamBody) =>
      handleLoading(async () => {
        await TeamsApi.create(body);
        await router.push({path: ROUTES.TEAM.INDEX});
      }, isLoading);

  const destroy = (id: Id) =>
      handleLoading(async () => {
        await TeamsApi.delete(id);
        await fetchTeams();
      }, isLoading);

  return {teams, isLoading, isLoadingTeams, fetchTeams, create, destroy};
});
