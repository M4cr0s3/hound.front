import { httpClient, type UpdateProjectBody, type UpdateProjectResponse } from '../';

export const updateProject = async (
	slug: string,
	body: UpdateProjectBody
): Promise<UpdateProjectResponse> =>
	httpClient.put(`/projects/${slug}`, body);
