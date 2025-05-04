export type Id = number;
export type Slug = string;

export interface BaseResponse {
	success: boolean;
	message: string;
}

export interface PaginationLink {
	url: string | null;
	label: string;
	active: boolean;
}

export interface Pagination {
	from: number;
	to: number;
	total: number;
	links: PaginationLink[];
	current_page: number;
}
