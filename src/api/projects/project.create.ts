import {type CreateProjectBody, type CreateProjectResponse, httpClient} from "../";

export const createProject = async (body: CreateProjectBody) => {
  return httpClient.post<CreateProjectResponse>('/projects', body);
};