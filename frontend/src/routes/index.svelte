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

<div>
	<div class="bg-orange-500 p-4">
		<h1 class="text-2xl font-bold text-white">Donezo</h1>
	</div>
	<main class="p-8 ">
		<div class="flex w-full justify-between space-x-8">
			<div class="flex justify-between w-1/2">
				<form
					class="space-y-4"
					on:submit={(e) => {
						e.preventDefault();
						addNaturalTask();
					}}
				>
					<h1 class="font-semibold text-2xl">Enter your natural-ish task...</h1>
					<FormElement label="Natural Input">
						<input
							class="p-2 shadow border-2 border-orange-200 focus:border-orange-400 outline-none rounded w-full"
							bind:value={naturalInput}
						/>
					</FormElement>
					<button
						class="py-2 px-4 text-center border-2 border-orange-200 bg-orange-100 rounded w-full "
						on:click={addNaturalTask}
					>
						Add
					</button>
				</form>
			</div>
			<div class="w-1/2 flex space-x-8">
				<div class="basis-1/2">
					<h2 class="text-2xl font-semibold mb-4">Your Tasks</h2>
					<div class="space-y-2">
						{#each uncompletedTasks as task (task.id)}
							<div animate:flip={{ duration: 500 }}>
								<TaskListTile
									{task}
									on:toggle={() => tasks.setCompletion(task.id, !task.completed)}
									on:delete={() => tasks.remove(task.id)}
									on:click={() => tasks.setCompletion(task.id, !task.completed)}
								/>
							</div>
						{/each}
					</div>
				</div>
				<div class="basis-1/2">
					<h2 class="text-2xl font-semibold mb-4">Completed Tasks</h2>
					<div class="space-y-2">
						{#each completedTasks as task (task.id)}
							<div animate:flip={{ duration: 500 }}>
								<TaskListTile
									{task}
									on:toggle={() => tasks.setCompletion(task.id, !task.completed)}
									on:delete={() => tasks.remove(task.id)}
									on:click={() => tasks.setCompletion(task.id, !task.completed)}
								/>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</main>
</div>
