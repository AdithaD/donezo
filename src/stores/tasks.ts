import type { Task } from 'src/models';
import { writable } from 'svelte/store';
import { browser } from '$app/env';

function createTaskStore() {
	const localData = browser ? localStorage.getItem('tasks') : null;
	const stored = localData ? JSON.parse(localData) : null;

	const store = writable((stored || []) as Task[]);
	const { subscribe, update } = store;

	if (browser) store.subscribe((value) => localStorage.setItem('tasks', JSON.stringify(value)));

	return {
		subscribe,
		add: (task: Omit<Task, 'id'>) =>
			update((tasks) => {
				const newId = tasks.reduce((max, task) => Math.max(task.id, max), 0) + 1;
				if (validateTask(task)) {
					return [...tasks, { id: newId, title: task.title, completed: task.completed }];
				} else {
					return tasks;
				}
			}),
		remove: (id: number) => update((tasks) => tasks.filter((task) => task.id !== id)),
		setCompletion: (id: number, completed: boolean) =>
			update((tasks) => tasks.map((task) => (task.id === id ? { ...task, completed } : task)))
	};
}

function validateTask(task: Omit<Task, 'id'>): boolean {
	return task.title.length > 0;
}

export const tasks = createTaskStore();
