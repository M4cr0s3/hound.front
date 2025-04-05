export interface Team {
	id: number;
	name: string;
	slug: string;
}

export interface CreateTeamBody {
	name: string;
	slug?: string;
}

export interface CreateTeamResponse {
	success: boolean;
	message: string;
}
