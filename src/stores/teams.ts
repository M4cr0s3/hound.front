import {defineStore} from "pinia";
import type {Team} from "../api";
import {ref} from "vue";
import {getTeams} from "../api";

export const useTeamsStore = defineStore('teams', () => {
  const teams = ref<Team[]>([]);
  const isLoadingTeams = ref(false);

  const fetchTeams = async () => {
    if (teams.value.length > 0) return;

    isLoadingTeams.value = true;
    try {
      const response = await getTeams();
      teams.value = response.data;
    } finally {
      isLoadingTeams.value = false;
    }
  };

  return {teams, isLoadingTeams, fetchTeams};

})