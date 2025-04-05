export interface Project {
	id: number;
	team_id: number;
	name: string;
	slug: string;
	platform: string;
}

export interface UpdateProjectBody {
	name: string;
	slug?: string;
}

export interface UpdateProjectResponse {
	success: boolean;
	message: string;
	data: Project;
}

export interface CreateProjectBody extends UpdateProjectBody {
	team_id: number;
	platform: string;
}

export interface CreateProjectResponse {
	success: boolean;
	message: string;
}
