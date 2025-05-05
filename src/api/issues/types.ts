import type {Team, Event} from "@/api";

export enum IssueStatus {
  Open = 'open',
  InProgress = 'in_progress',
  Resolved = 'resolved',
  Closed = 'closed',
}

export enum IssuePriority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Critical = 'critical',
}

export interface User {
  id: number;
  name: string;
  email: string;
  role?: Role;
  invitations?: Invitation[]
}

export interface Invitation {
  id: number;
  token: string;
  inviter: User;
  user: User;
}

export interface Role {
  id: number;
  title: RoleTitle;
}

export enum RoleTitle {
  Maintainer = 'Maintainer',
  Developer = 'Developer',
}

export interface Comment {
  id: number;
  user: User;
  text: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  replies: Comment[];
  parent: Comment;
  issue: Issue;
}

export interface Issue {
  id: number;
  event_id: number;
  title: string;
  culprit: string | null;
  status: IssueStatus;
  priority: IssuePriority;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  event: Event;
  assignees: {
    users: User[];
    teams: Team[];
  };
  comments?: Comment[];
}