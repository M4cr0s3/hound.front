import type {Id, Team} from '@/api';

export interface Project {
  id: number;
  team_id: number;
  name: string;
  slug: string;
  platform: string;
  team?: Team;
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

export interface ProjectStatistic {
  total_events: number;
  errors_last_day: number;
  error_rate_change: number;
  avg_response_time: number;
}

export interface LastDayStat {
  id: Id;
  name: string;
  slug: string;
  platform: string;

  stats: ProjectStatistic;
  events_last_day: {
    hour: string;
    count: number;
  }[];
}

export type LastDayStatsResponse = LastDayStat[];
