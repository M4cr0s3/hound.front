import {api} from "../";

interface CreateTeamBody {
  name: string
  slug?: string
}

interface CreateTeamResponse {
  success: boolean
  message: string
}

export const createTeam = async (body: CreateTeamBody) => {
  return api.post<CreateTeamBody, CreateTeamResponse>('/teams', body);
};