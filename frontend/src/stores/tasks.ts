import { convertTextToTask, type Task } from '../models';
import { writable } from 'svelte/store';
import { browser } from '$app/env';

function createTaskStore() {
	const localData = browser ? localStorage.getItem('tasks') : null;
	const stored = localData ? (JSON.parse(localData) as Task[]) : null;

	if (stored) {
		stored.map((task) => {
			if (task.doDate) task.doDate = new Date(task.doDate);
			if (task.dueDate) task.dueDate = new Date(task.dueDate);
		});
	}

	const store = writable((stored || []) as Task[]);
	const { subscribe, update } = store;

	if (browser) store.subscribe((value) => localStorage.setItem('tasks', JSON.stringify(value)));

	return {
		subscribe,
		add: (task: Omit<Task, 'id'>) =>
			update((tasks) => {
				const newId = tasks.reduce((max, task) => Math.max(task.id, max), 0) + 1;
				if (validateTask(task)) {
					return [...tasks, { ...task, id: newId }];
				} else {
					return tasks;
				}
			}),
		parseAndAdd: (text: string) => {
			update((tasks) => {
				const newId = tasks.reduce((max, task) => Math.max(task.id, max), 0) + 1;
				const task = convertTextToTask(text);
				if (task && validateTask(task)) {
					return [...tasks, { ...task, id: newId }];
				} else {
					return tasks;
				}
			});
		},
		remove: (id: number) => update((tasks) => tasks.filter((task) => task.id !== id)),
		setCompletion: (id: number, completed: boolean) =>
			update((tasks) => tasks.map((task) => (task.id === id ? { ...task, completed } : task)))
	};
}

function validateTask(task: Omit<Task, 'id'>): boolean {
	return task.title.length > 0;
}

export const tasks = createTaskStore();
