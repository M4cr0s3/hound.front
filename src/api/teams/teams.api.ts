import {
  type AddMembersBody,
  type CreateTeamBody,
  httpClient,
  type Id,
  type Slug,
  type Team,
  type UpdateTeamBody,
  type User
} from "../";

export const TeamsApi = {
  async getAll() {
    return httpClient.get<Team[]>('/teams');
  },
  async get(slug: Slug): Promise<Team> {
    return httpClient.get<Team>(`/teams/${slug}`);
  },
  async getAvailableUsers(id: Id, query?: string): Promise<{ users: User[] }> {
    return httpClient.get(`/teams/${id}/available-users`, {
      query: {
        search: query
      }
    });
  },
  async create(body: CreateTeamBody) {
    return httpClient.post('/teams', body);
  },
  async update(id: Id, body: UpdateTeamBody) {
    return httpClient.put(`/teams/${id}`, body);
  },
  async delete(id: Id) {
    return httpClient.delete(`/teams/${id}`);
  },
  async addMembers(id: Id, body: AddMembersBody) {
    return httpClient.post(`/teams/${id}/members`, body);
  },
  async removeMember(id: Id, userId: Id) {
    return httpClient.delete(`/teams/${id}/members/${userId}`);
  }
}