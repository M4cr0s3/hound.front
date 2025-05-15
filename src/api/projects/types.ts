import type { Team } from '@/api';
import type { HealthCheckEndpoint } from '@/stores';

export interface Project {
  id: number;
  team_id: number;
  name: string;
  slug: string;
  platform: string;
  team?: Team;
  key: ProjectKey;
  events: [],
  issues: [],
  endpoints: HealthCheckEndpoint[]
  notificationRules: [],
  stats?: ProjectStatistic,
  events_last_day?: {
    hour: string;
    count: number;
  }[];
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

export type LastDayStatsResponse = Project[];

export interface ProjectKey {
  id: number;
  public_key: string;
  private_key: string;
  dsn: string;
}