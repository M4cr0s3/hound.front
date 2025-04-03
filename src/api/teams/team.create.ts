import {api} from "../";
import type {CreateTeamBody, CreateTeamResponse} from "./";

export const createTeam = async (body: CreateTeamBody) => {
  return api.post<CreateTeamBody, CreateTeamResponse>('/teams', body);
};