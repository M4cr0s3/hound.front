import {httpClient, type Issue} from '@/api';

export const IssuesApi = {
  async get(issueId: string | number) {
    return httpClient.get<Issue>(`/issues/${issueId}`);
  },

  async updateStatus(issueId: number, status: string): Promise<void> {
    await httpClient.patch(`/issues/${issueId}/status`, {status});
  },

  async updatePriority(issueId: number, priority: string): Promise<void> {
    await httpClient.patch(`/issues/${issueId}/priority`, {priority});
  },

  async updateDueDate(issueId: number, dueDate: string | null): Promise<void> {
    await httpClient.patch(`/issues/${issueId}/due-date`, {due_date: dueDate});
  },

  async addAssignee(issueId: number, type: 'user' | 'team', id: number): Promise<void> {
    await httpClient.post(`/issues/${issueId}/assignees`, {type, id});
  },

  async removeAssignee(issueId: number, type: 'user' | 'team', id: number): Promise<void> {
    await httpClient.delete(`/issues/${issueId}/assignees`, {data: {type, id}});
  },

  async addComment(issueId: number, text: string): Promise<void> {
    await httpClient.post(`/issues/${issueId}/comments`, {text});
  },
};