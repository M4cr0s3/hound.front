import { api, type UpdateProjectBody, type UpdateProjectResponse } from '../';
import type { AxiosResponse } from 'axios';

export const updateProject = async (
	slug: string,
	body: UpdateProjectBody
): Promise<AxiosResponse<UpdateProjectResponse>> =>
	api.put(`/projects/${slug}`, body);
