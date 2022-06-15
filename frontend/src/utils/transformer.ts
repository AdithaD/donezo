import type { List } from '$/models/list';
import type { AddTaskRequestBody, Task } from '$/models/task';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const prefixes = ['pri', 'do', 'due'];
export function convertTextToTask(text: string): Omit<AddTaskRequestBody, 'parent'> | null {
	const preRegex = new RegExp(`(${prefixes.map((p) => `(${p})`).join('|')}):[^\\s]+`, 'g');

	const arr = Array.from(text.matchAll(preRegex));
	const values = arr.map((m) => m[0]);

	const endIndex = values.length > 0 ? arr[0].index : text.length;

	const title = text.substring(0, endIndex);
	if (title.trim().length === 0) return null;

	const task: Omit<AddTaskRequestBody, 'parent'> = {
		title,
		priority: 0,
		doDate: null,
		dueDate: null
	};

	console.log(values);
	if (values.length > 0) {
		for (const match of values) {
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
					console.log(value);
					const date = dayjs(value, ['DD/MM/YYYY', 'DD/MM/YY', 'DD/MM']);
					console.log(date);
					if (date.isValid()) {
						task.doDate = date.toDate();
					}

					break;
				}
				case 'due': {
					console.log(value);

					const date = dayjs(value, ['DD/MM/YYYY', 'DD/MM/YY', 'DD/MM']);
					console.log(date);

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
export function initTaskFromJSON(task: Task) {
	return {
		...task,
		doDate: task.doDate ? dayjs(task.doDate).toDate() : null,
		dueDate: task.dueDate ? dayjs(task.dueDate).toDate() : null
	};
}

export function initListFromJSON(list: List) {
	return {
		...list,
		tasks: list.tasks.map((t) => initTaskFromJSON(t))
	};
}
