export interface Team {
  id: number;
  name: string;
  slug: string;
}

interface CreateTeamBody {
  name: string
  slug?: string
}

interface CreateTeamResponse {
  success: boolean
  message: string
}