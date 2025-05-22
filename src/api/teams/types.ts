import type { BaseResponse, Id, Issue, Project, User } from "../";

export interface Team {
  id: number;
  name: string;
  slug: string;
  members: User[]
  projects: Project[],
  assignments: Assignments[]
}

export interface Assignments { 
  id: number,
  issue: Pick<Issue, "id" | "title" | "status">
}

export interface CreateTeamBody {
  name: string;
  slug?: string;
}

export type UpdateTeamBody = Partial<CreateTeamBody>;

export interface CreateTeamResponse extends BaseResponse {
}

export interface AddMembersBody {
  user_ids: Id[];
}