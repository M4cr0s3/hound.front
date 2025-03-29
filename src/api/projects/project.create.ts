import {api, type CreateProjectBody} from "../";

export const createProject = async (body: CreateProjectBody) => {
  return api.post<CreateProjectBody, CreateProjectResponse>('/projects', body);
};