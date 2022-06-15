import { TaskAPI } from '../api/api';
import { writable } from 'svelte/store';
import type { AddTaskRequestBody, Task } from '$/models/task';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

function initTaskFromJSON(task: Task) {
	return {
		...task,
		doDate: task.doDate ? dayjs(task.doDate).toDate() : null,
		dueDate: task.dueDate ? dayjs(task.dueDate).toDate() : null
	};
}

function createTaskStore() {
	const store = writable([] as Task[]);
	const { subscribe, update } = store;

	TaskAPI.getTasks().then(parseTasksFromJson);

	function parseTasksFromJson(tasks: Task[]) {
		store.set(tasks.map(initTaskFromJSON));
	}

	return {
		subscribe,
		add: (task: AddTaskRequestBody) => {
			if (validateTask(task)) {
				TaskAPI.addTask(task)
					.then(() => TaskAPI.getTasks())
					.then(parseTasksFromJson);
			}
		},
		parseAndAdd: (text: string) => {
			const task = convertTextToTask(text);
			if (task && validateTask(task)) {
				TaskAPI.addTask(task)
					.then(() => TaskAPI.getTasks())
					.then(parseTasksFromJson);
			}
		},
		remove: (_id: string) =>
			TaskAPI.deleteTask(_id)
				.then(() => TaskAPI.getTasks())
				.then(parseTasksFromJson),
		setCompletion: (_id: string, completed: boolean) =>
			TaskAPI.setTaskCompletion(_id, completed)
				.then(() => TaskAPI.getTasks())
				.then(parseTasksFromJson)
	};
}

function validateTask(task: AddTaskRequestBody): boolean {
	return task.title.length > 0;
}

const prefixes = ['pri', 'do', 'due'];
export function convertTextToTask(text: string): AddTaskRequestBody | null {
	const preRegex = new RegExp(`(${prefixes.map((p) => `(${p})`).join('|')}):[^\\s]+`, 'g');

	const arr = Array.from(text.matchAll(preRegex));
	const values = arr.map((m) => m[0]);

	const endIndex = values.length > 0 ? arr[0].index : text.length;

	const title = text.substring(0, endIndex);
	if (title.trim().length === 0) return null;

	const task: Omit<Task, '_id'> = {
		title,
		completed: false,
		priority: 0,
		doDate: null,
		dueDate: null
	};

	console.log(values);
	if (values.length > 0) {
		for (const match of values) {
			console.log(match);
			const split = match.split(':');

			const key = split[0];
			const value = split[1];

			switch (key) {
				case 'pri':
					switch (value) {
						case 'low':
							task.priority = 1;
							break;
						case 'med':
							task.priority = 2;
							break;
						case 'high':
							task.priority = 3;
							break;
					}
					break;
				case 'do': {
					const date = dayjs(value, ['DD/MM/YYYY', 'DD/MM/YY', 'DD/MM']);
					if (date.isValid()) {
						task.doDate = date.toDate();
					}
					break;
				}
				case 'due': {
					const date = dayjs(value, ['DD/MM/YYYY', 'DD/MM/YY', 'DD/MM']);
					if (date.isValid()) {
						task.dueDate = date.toDate();
					}
					break;
				}
			}
		}
	}

	return task;
}

export const tasks = createTaskStore();
