import {$fetch, type FetchOptions} from 'ofetch';

const apiFetcher = $fetch.create({
  baseURL: '/api',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },

  async onRequest({options}) {
    const token = localStorage.getItem('token');
    if (token) {
      options.headers.append('Authorization', `Bearer ${token}`);
    }
  },

  async onResponseError({response}) {
    if (response.status === 401) {
      try {
        const response = await httpClient.get<{ token: string }>('/auth/refresh')
        localStorage.removeItem('token');
        if (!response.token) {
          window.location.href = '/login';
        }

        localStorage.setItem('token', response.token);
        window.location.reload();
      } catch (e) {
        localStorage.removeItem('token');
      }
    }
  },
});

type ApiResponse<T> = T

type RequestMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export const httpClient = {
  async request<T>(
      method: RequestMethod,
      url: string,
      data?: any,
      options?: FetchOptions<'json'>
  ): Promise<ApiResponse<T>> {
    try {
      return await apiFetcher<ApiResponse<T>>(url, {
        method,
        body: data,
        ...options,
      });
    } catch (error: any) {
      if (error.response) {
        throw {
          status: error.response.status,
          data: error.data,
          message: error.data?.message || 'Произошла ошибка',
        };
      } else {
        throw {
          status: 500,
          message: 'Не удалось подключиться к серверу',
        };
      }
    }
  },

  get<T>(url: string, options?: FetchOptions<'json'>) {
    return this.request<T>('get', url, undefined, options);
  },

  post<T>(url: string, data: any, options?: FetchOptions<'json'>) {
    return this.request<T>('post', url, data, options);
  },

  put<T>(url: string, data: any, options?: FetchOptions<'json'>) {
    return this.request<T>('put', url, data, options);
  },

  patch<T>(url: string, data: any, options?: FetchOptions<'json'>) {
    return this.request<T>('patch', url, data, options);
  },

  delete<T>(url: string, options?: FetchOptions<'json'>) {
    return this.request<T>('delete', url, undefined, options);
  },
};

export const $api = apiFetcher;
