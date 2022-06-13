<script lang="ts">
	import TaskListTile from '../components/TaskListTile.svelte';
	import { tasks } from '../stores/tasks';
	import { flip } from 'svelte/animate';

	let taskInput = '';

	$: completedTasks = $tasks.filter((task) => task.completed);
	$: uncompletedTasks = $tasks.filter((task) => !task.completed);

	function addTask() {
		const newTask = {
			title: taskInput,
			completed: false
		};

		tasks.add(newTask);
		taskInput = '';
	}
</script>

<div>
	<div class="bg-orange-500 p-4">
		<h1 class="text-2xl font-bold text-white">Donezo</h1>
	</div>
	<main class="p-8">
		<div class="flex w-full justify-between">
			<div>
				<div class="flex space-x-4">
					<div class="space-y-2">
						<p class="font-semibold">Enter your task...</p>
						<input
							class="p-2 shadow border-2 border-orange-200 focus:border-orange-400 outline-none rounded"
							bind:value={taskInput}
						/>
					</div>
					<button
						class="py-2 px-4 text-center border-2 border-orange-200 bg-orange-100 rounded"
						on:click={addTask}
					>
						Add
					</button>
				</div>
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
