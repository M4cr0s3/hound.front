import { httpClient } from '../';
import type { Pagination, Slug } from '../types';

interface Params {
	per_page: number;
	page: number;
	level?: string;
	release?: string;
	environment?: string;
}

export const getProjectEvents = async (slug: Slug, params: Params) => {
	const response = await httpClient.get<Pagination>(`/projects/${slug}/events`, { params });

	return {
		pagination: {
			from: response.from,
			to: response.to,
			total: response.total,
			links: response.links,
			current_page: response.current_page,
			data: response.data
		},
		events: response.data,
	};
};
