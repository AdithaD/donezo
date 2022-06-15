import axios, { type AxiosResponse } from 'axios';
import type { AddTaskRequestBody, Task } from '$/models/task';

const baseURL = 'http://localhost:8080/api/v1';

const apiClient = axios.create({
	baseURL: baseURL,
	responseType: 'json',
	timeout: 20000
});

// apiClient.interceptors.request.use(
// 	async (config) => {
// 		const token = localStorage.getItem('token');
// 		token;
// 		if (token && config.headers) {
// 			config.headers.Authorization = `Bearer ${token}`;
// 		}
// 		config.params = { ...config.params, timestamp: Date.now() };
// 		return config;
// 	},
// 	(error) => {
// 		return Promise.reject(error);
// 	}
// );

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
	get: (url: string, params?: Record<string, unknown>) =>
		apiClient.get(url, { params }).then(responseBody),
	post: (url: string, body: Record<string, unknown>) =>
		apiClient.post(url, body).then(responseBody),

	patch: (url: string, body: Record<string, unknown>) =>
		apiClient.patch(url, body).then(responseBody),
	put: (url: string, body: Record<string, unknown>) => apiClient.put(url, body).then(responseBody),
	delete: (url: string) => apiClient.delete(url).then(responseBody)
};
export const TaskAPI = {
	addTask: (body: AddTaskRequestBody) => requests.post('/task', body),
	getTask: (id: string, options?: { limit?: number; completed?: boolean }): Promise<Task> =>
		requests.get(`/task/${id}`, options),
	getTasks: (): Promise<Task[]> => requests.get('/task'),
	setTaskCompletion: (id: string, completed: boolean) =>
		requests.patch(`/task/${id}/complete`, { completed }),
	deleteTask: (id: string) => requests.delete(`/task/${id}`)
};
