<script lang="ts">
	import TaskListTile from '../components/TaskListTile.svelte';
	import FormElement from '../components/FormElement.svelte';
	import { tasks } from '../stores/tasks';
	import { flip } from 'svelte/animate';
	import dayjs from 'dayjs';

	let name = '';
	let priority = 1;

	let dueDateString: string = '';
	let doDateString: string = '';

	let naturalInput: string = '';

	$: completedTasks = $tasks.filter((task) => task.completed);
	$: uncompletedTasks = $tasks.filter((task) => !task.completed);

	function addTask() {
		const dueDate = dayjs(dueDateString);
		const doDate = dayjs(doDateString);

		const newTask = {
			title: name,
			priority,
			dueDate: dueDate.isValid() ? dueDate.toDate() : null,
			doDate: doDate.isValid() ? dueDate.toDate() : null,
			completed: false
		};

		tasks.add(newTask);
		name = '';
	}

	function addNaturalTask() {
		tasks.parseAndAdd(naturalInput);
		naturalInput = '';
	}
</script>

<div class="bg-indigo-300 h-screen">
	<div class="bg-orange-400 p-4">
		<h1 class="text-2xl font-bold text-white">Donezo</h1>
	</div>
	<div class="flex ">
		<main class="p-8 m-4 w-1/2 shadow-md mx-auto rounded space-y-8 bg-white">
			<div class="w-full flex">
				<div class="justify-between mx-auto w-full">
					<form
						class="space-y-4"
						on:submit={(e) => {
							e.preventDefault();
							addNaturalTask();
						}}
					>
						<h1 class="font-semibold text-2xl">Enter your task...</h1>
						<div>
							<div class="flex space-x-8">
								<input
									class="p-2 shadow border-2 border-orange-200 focus:border-orange-400 outline-none rounded w-full basis-5/6"
									bind:value={naturalInput}
									placeholder="e.g. My Task pri:high do:19/06 due:19/06"
								/>
								<button
									class="py-2 px-4 text-center hover:bg-orange-500 bg-orange-400 rounded w-full basis-1/6 font-semibold text-white"
									on:click={addNaturalTask}
								>
									Add
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
			<div class="flex space-x-8">
				<div class="basis-1/2">
					<h2 class="text-2xl font-semibold mb-4">Your Tasks</h2>
					<div class="space-y-2">
						{#each uncompletedTasks as task (task._id)}
							<div animate:flip={{ duration: 500 }}>
								<TaskListTile
									{task}
									on:toggle={() => tasks.setCompletion(task._id, !task.completed)}
									on:delete={() => tasks.remove(task._id)}
									on:click={() => tasks.setCompletion(task._id, !task.completed)}
								/>
							</div>
						{/each}
					</div>
				</div>
				<div class="basis-1/2">
					<h2 class="text-2xl font-semibold mb-4">Completed Tasks</h2>
					<div class="space-y-2">
						{#each completedTasks as task (task._id)}
							<div animate:flip={{ duration: 500 }}>
								<TaskListTile
									{task}
									on:toggle={() => tasks.setCompletion(task._id, !task.completed)}
									on:delete={() => tasks.remove(task._id)}
									on:click={() => tasks.setCompletion(task._id, !task.completed)}
								/>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</main>
	</div>
</div>
