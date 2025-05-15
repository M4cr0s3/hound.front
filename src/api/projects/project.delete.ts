import { httpClient, type BaseResponse, type Slug } from '..';

export const deleteProject = async (slug: Slug) =>
	httpClient.delete<BaseResponse>(`/projects/${slug}`);
