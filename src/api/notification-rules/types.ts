export interface NotificationRule {
  id: number;
  project_id: number;
  event_type: EventType;
  trigger_type: TriggerType;
  trigger_params: {
    threshold?: number;
    time_window?: number;
  };
  channels: Channel[];
  created_at: string;
  updated_at: string;
}

export type EventType = 'error' | 'warning' | 'info' | 'critical';
export type TriggerType = 'rate_limit' | 'count';
export type Channel = 'email' | 'slack' | 'telegram' | 'webhook';

export type NotificationRuleForm = Omit<NotificationRule, 'id', 'project_id', 'created_at', 'updated_at'>