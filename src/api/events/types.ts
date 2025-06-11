import type { Issue, Project } from "@/api";

export interface Event {
  id: number;
  event_id: string;
  project_id: number;
  environment: string;
  type: string;
  level: 'error' | 'warning' | 'info' | 'debug' | 'critical' | 'debug';
  message: string;
  release: string | null;
  metadata: {
    file?: string;
    line?: number;
    context?: string;
    fingerprint: string;
    [key: string]: any;
  };
  project?: Project;
  issues: Issue[];
  count: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
