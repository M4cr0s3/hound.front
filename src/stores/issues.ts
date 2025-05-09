import {httpClient, type Id, type Issue, type IssuePriority, type IssueStatus, type Pagination} from "@/api";
import {defineStore} from "pinia";

export interface IssueFilters {
  search: string;
  status: IssueStatus | null;
  priority: IssuePriority | null;
  tags: string[];
  page: number;
  perPage: number;
}

interface IssuesState {
  issues: Issue[];
  issue: Issue,
  filters: IssueFilters;
  pagination: Pagination | null;
  isLoading: boolean;
}

export const useIssuesStore = defineStore('issues', {
  state: (): IssuesState => ({
    issues: [],
    issue: {} as Issue,
    filters: {
      search: '',
      status: null,
      priority: null,
      tags: [],
      page: 1,
      perPage: 10,
    },
    pagination: null,
    isLoading: false,
  }),

  actions: {
    async fetchIssues() {
      this.isLoading = true;
      try {
        const response = await httpClient.get<{
          issues: Issue[];
          pagination: Pagination;
        }>('/issues', {
          query: {
            search: this.filters.search || undefined,
            status: this.filters.status || undefined,
            priority: this.filters.priority || undefined,
            tags: this.filters.tags.length ? this.filters.tags : undefined,
            page: this.filters.page,
            per_page: this.filters.perPage,
          },
        });
        this.issues = response.issues;
        this.pagination = response.pagination;
      } finally {
        this.isLoading = false;
      }
    },

    async createIssue(data: Partial<Issue>) {
      this.isLoading = true;
      try {
        const response = (await httpClient.post<{ data: Issue }>('/issues', data)).data;
        this.issues.unshift(response);
        return response;
      } finally {
        this.isLoading = false;
      }
    },

    async updateIssue(id: Id, data: Partial<Issue>) {
      this.isLoading = true;
      try {
        await httpClient.patch(`/issues/${id}`, data);
        await this.fetchIssue(id);
      } finally {
        this.isLoading = false;
      }
    },

    async updateIssueStatus(id: Id, status: IssueStatus) {
      this.isLoading = true;
      try {
        await httpClient.patch(`/issues/${id}`, {status});
        await this.fetchIssue(id);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchIssue(id: Id) {
      this.issue = (await httpClient.get<{ issue: Issue }>(`/issues/${id}`)).issue;
    },

    async deleteIssue(id: Id) {
      this.isLoading = true;
      try {
        await httpClient.delete(`/issues/${id}`);
        this.issues = this.issues.filter((issue) => issue.id !== id);
      } finally {
        this.isLoading = false;
      }
    },

    async addAssignee(issueId: Id, type: 'user' | 'team', ids: Id[]) {
      try {
        await httpClient.post(`/issues/${issueId}/assignees`, {type, assignee_ids: ids});
        await this.fetchIssue(issueId)
      } catch (e) {
        console.error(e);
      }
    },

    async removeAssignee(issueId: Id, type: 'user' | 'team', id: Id) {
      try {
        await httpClient.delete(`/issues/${issueId}/assignees/${id}`, {body: {type}});
        await this.fetchIssue(issueId)
      } catch (e) {
        console.error(e);
      }
    },

    updateFilters(filters: Partial<IssueFilters>) {
      this.filters = {...this.filters, ...filters, page: 1};
    },
  },
});