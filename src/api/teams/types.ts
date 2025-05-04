import type {BaseResponse, Id, User} from "../";

export interface Team {
  id: number;
  name: string;
  slug: string;
  members: User[]
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