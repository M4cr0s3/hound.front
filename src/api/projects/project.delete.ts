import { api, type BaseResponse, type Slug } from '..';

export const deleteProject = async (slug: Slug) =>
	api.delete<BaseResponse>(`/projects/${slug}`);
