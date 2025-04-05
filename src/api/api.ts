import axios, {
	type AxiosError,
	type AxiosInstance,
	type AxiosRequestConfig,
	type AxiosResponse,
} from 'axios';

interface RetryConfig extends AxiosRequestConfig {
	_retry?: boolean;
}

const api = axios.create({
	baseURL: '/api',
	withCredentials: true,
	headers: {
		Authorization: `Bearer ${localStorage.getItem('token')}`,
	},
});

export function setupAuthInterceptor(axiosInstance: AxiosInstance): void {
	axiosInstance.interceptors.request.use(
		(config) => {
			const token = localStorage.getItem('accessToken');
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		},
		(error) => {
			return Promise.reject(error);
		}
	);

	axiosInstance.interceptors.response.use(
		(response: AxiosResponse) => response,
		async (error: AxiosError) => {
			const originalRequest = error.config as RetryConfig;

			if (error.response?.status === 401 && !originalRequest._retry) {
				originalRequest._retry = true;

				const response = await axios.get('/api/auth/refresh', {
					headers: {
						Authorization: 'Bearer ' + localStorage.getItem('token'),
					},
				});

				const { token } = response.data;

				localStorage.setItem('token', token);

				if (originalRequest.headers) {
					originalRequest.headers.Authorization = `Bearer ${token}`;
				}

				return axiosInstance(originalRequest);
			}

			return Promise.reject(error);
		}
	);
}

setupAuthInterceptor(api);

export default api;
