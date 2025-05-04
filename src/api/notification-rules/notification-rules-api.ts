import {httpClient, type Slug, type NotificationRuleForm, type NotificationRule, type Id} from "../";

export const NotificationRulesApi = {
  async create(slug: Slug, form: NotificationRuleForm): Promise<void> {
    await httpClient.post(`/projects/${slug}/notification-rules`, form);
  },
  async getByProject(slug: Slug): Promise<NotificationRule[]> {
    return await httpClient.get<NotificationRule[]>(`/projects/${slug}/notification-rules`);
  },
  async delete(id: Id): Promise<void> {
    await httpClient.delete(`/notification-rules/${id}`);
  },
}