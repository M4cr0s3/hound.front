import {api, type CreateProjectBody, type CreateProjectResponse} from "../";

export const createProject = async (body: CreateProjectBody) => {
  return api.post<CreateProjectBody, CreateProjectResponse>('/projects', body);
};