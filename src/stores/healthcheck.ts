import { defineStore } from 'pinia';
import { api, type Slug } from '../api';

export interface HealthCheckResult {
	id: number;
	endpoint_id: number;
	response_time: number;
	status_code: number;
	success: boolean;
	created_at: string;
	error_message?: string;
}

export interface HealthCheckStats {
	avg_response_time: number;
	uptime_percentage: number;
	total_checks: number;
	success_checks: number;
	failure_checks: number;
}

export interface HealthCheckEndpoint {
	id: number;
	project_id: number;
	url: string;
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
	expected_status: number;
	interval: number;
	is_active: boolean;
	created_at: string;
	updated_at: string;
}

export interface HealthCheckEndpointForm {
	url: string;
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
	expected_status: number;
	interval: number;
	is_active: boolean;
}

interface HealthCheckState {
	endpoints: HealthCheckEndpoint[];
	results: HealthCheckResult[];
	endpoint: HealthCheckEndpoint | null;
	stats: HealthCheckStats | null;
	isLoading: boolean;
	isAdding: boolean;
}

export const useHealthCheckStore = defineStore('healthCheck', {
	state: (): HealthCheckState => ({
		endpoints: [],
		results: [],
		endpoint: {} as HealthCheckEndpoint,
		stats: null,
		isLoading: false,
		isAdding: false,
	}),

	actions: {
		async fetchEndpoints(slug: Slug) {
			try {
				this.isLoading = true;
				const response = await api.get<HealthCheckEndpoint[]>(
					`/projects/${slug}/healthcheck`
				);
				this.endpoints = response.data;
			} catch (error) {
				console.error('Failed to fetch endpoints:', error);
				throw error;
			} finally {
				this.isLoading = false;
			}
		},
		async fetchEndpointResults(endpointId: number) {
			try {
				this.isLoading = true;
				const response = await api.get<{
					data: HealthCheckResult[];
					stats: HealthCheckStats;
					endpoint: HealthCheckEndpoint;
				}>(`/healthcheck/${endpointId}`);
				this.results = response.data.data;
				this.stats = response.data.stats;
				this.endpoint = response.data.endpoint;
			} catch (error) {
				console.error('Failed to fetch endpoint results:', error);
				throw error;
			} finally {
				this.isLoading = false;
			}
		},

		async addEndpoint(slug: Slug, form: HealthCheckEndpointForm) {
			try {
				this.isAdding = true;
				await api.post<HealthCheckEndpoint>(`/healthcheck/${slug}`, form);
				await this.fetchEndpoints(slug);
			} catch (error) {
				console.error('Failed to add endpoint:', error);
				throw error;
			} finally {
				this.isAdding = false;
			}
		},

		async toggleEndpointStatus(endpointId: number) {
			try {
				const endpoint = this.endpoints.find((e) => e.id === endpointId);
				if (!endpoint) return;

				const newStatus = !endpoint.is_active;
				await api.patch<HealthCheckEndpoint>(`/healthcheck/${endpointId}`, {
					is_active: newStatus,
				});

				endpoint.is_active = newStatus;
			} catch (error) {
				console.error('Failed to toggle endpoint status:', error);
				throw error;
			}
		},

		async deleteEndpoint(endpointId: number) {
			try {
				await api.delete(`/healthcheck/${endpointId}`);
				this.endpoints = this.endpoints.filter((e) => e.id !== endpointId);
			} catch (error) {
				console.error('Failed to delete endpoint:', error);
				throw error;
			}
		},
	},
	getters: {
		chartData(): { hour: string; avg_time: number }[] {
			const hourlyData: Record<string, { sum: number; count: number }> = {};

			this.results.forEach((result) => {
				const date = new Date(result.created_at);
				const hour = `${date.getHours().toString().padStart(2, '0')}:00`;

				if (!hourlyData[hour]) {
					hourlyData[hour] = { sum: 0, count: 0 };
				}

				hourlyData[hour].sum += result.response_time;
				hourlyData[hour].count++;
			});

			return Object.entries(hourlyData)
				.map(([hour, data]) => ({
					hour,
					avg_time: Math.round(data.sum / data.count),
				}))
				.sort((a, b) => a.hour.localeCompare(b.hour));
		},
	},
});
