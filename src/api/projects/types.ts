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
