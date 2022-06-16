import axios, { type AxiosResponse } from 'axios';
import type { AddTaskRequestBody, Task } from '$/models/task';
import type { AddListRequestBody, List } from '$/models/list';
const baseURL = 'http://localhost:4000/';

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

const responseBody = (response: AxiosResponse) => response.data.data;

const requests = {
	get: (url: string, params?: Record<string, unknown>) =>
		apiClient.get(url, { params }).then(responseBody),
	post: (url: string, body: Record<string, unknown>) =>
		apiClient.post(url, body).then(responseBody),

	patch: (url: string, body: Record<string, unknown>) =>
		apiClient.patch(url, body).then(responseBody),
	put: (url: string, body: Record<string, unknown>) => apiClient.put(url, body).then(responseBody),
	delete: (url: string) => apiClient.delete(url).then(responseBody),
	graphql: (query: string, variables?: Record<string, unknown>) =>
		apiClient.post('/graphql', { query, variables }).then(responseBody)
};
export const TaskAPI = {
	addTask: (body: AddTaskRequestBody) =>
		requests.graphql(
			`mutation CreateList($title: String!, $parent: ID!, $doDate: String, $dueDate: String, $priority: Int) {
			createTask(title: $title, parent: $parent, doDate: $doDate, dueDate: $dueDate, priority: $priority) {
		  		_id
			}
	  	}`,
			body
		),
	getTask: (id: string): Promise<Task> => requests.get(`/task/${id}`).then((r) => r.task),

	getTasks: (options?: { limit?: number; completed?: boolean }): Promise<Task[]> =>
		requests
			.graphql(
				`query Tasks($limit: Int, $completed: Boolean) {
			tasks(limit: $limit, completed: $completed) {
			  _id
			  title
			  completed
			  doDate
			  dueDate
			  priority
			  parent
			}
		  }`,
				options
			)
			.then((r) => r.tasks),
	setTaskCompletion: (_id: string, completed: boolean) =>
		requests.graphql(
			`mutation SetTaskCompletion($_id: ID!) {
			completeTask(_id: $_id)
		  }`,
			{ _id, completed }
		),
	deleteTask: (_id: string) =>
		requests.graphql(
			`mutation DeleteTask($_id: ID!) {
		deleteTask(_id: $_id)
	  }`,
			{ _id: _id }
		)
};
export const ListAPI = {
	getList: (_id: string): Promise<List> =>
		requests
			.graphql(
				`query Lists($_id: ID!) {
		list(_id: $_id) {
		  _id
		  title
		  color
		  tasks {
			_id
			title
			completed
			doDate
			dueDate
			priority
		  }
		}
	  }`,
				{ _id: _id }
			)
			.then((r) => r.list),
	getLists: (options?: { limit?: number }): Promise<List[]> =>
		requests
			.graphql(
				`query Lists($limit: Int) {
			lists(limit: $limit) {
			  _id
			  title
			  color
			  tasks {
				_id
				title
				completed
				doDate
				dueDate
				priority
			  }
			}
		  }`,
				options
			)
			.then((r) => r.lists),
	addList: (body: AddListRequestBody) =>
		requests.graphql(
			`mutation CreateList($title: String!, $color: String!) {
		createList(title: $title, color: $color) {
		  _id
		}
	  }`,
			body
		)
};
