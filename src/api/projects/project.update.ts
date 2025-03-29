import {api, type Project, type UpdateProjectBody} from "../";
import type {AxiosResponse} from "axios";

interface UpdateProjectResponse {
  success: boolean;
  message: string;
  data: Project;
}

export const updateProject = async (slug: string, body: UpdateProjectBody): Promise<AxiosResponse<UpdateProjectResponse>> => {
  return api.put<UpdateProjectBody, UpdateProjectResponse>(`/projects/${slug}`, body);
};