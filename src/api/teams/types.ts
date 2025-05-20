import type { BaseResponse, Id, Project, User } from "../";

export interface Team {
  id: number;
  name: string;
  slug: string;
  members: User[]
  projects: Project[],
  assignments: [{ 
    id: number,
    issue:{
      id:string,
      title:string,
      status:string
    }
  }]
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