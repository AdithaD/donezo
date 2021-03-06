<script lang="ts">
	import type { List } from '$/models/list';
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { ListAPI, TaskAPI } from '../api/api';
	import TaskListTile from '../components/TaskListTile.svelte';
	import { convertTextToTask, initListFromJSON } from '../utils/transformer';

	let naturalInput: string = '';
	let newListName: string = '';
	let color: string = '';

	let lists: List[] = [];
	let currentList: List | null = null;

	onMount(() => {
		ListAPI.getLists().then((l) => {
			console.log(l);

			lists = l.map(initListFromJSON);
		});
	});

	$: completedTasks = currentList ? currentList.tasks.filter((task) => task.completed) : [];
	$: uncompletedTasks = currentList ? currentList.tasks.filter((task) => !task.completed) : [];

	function addNaturalTask() {
		if (currentList) {
			const parsed = convertTextToTask(naturalInput);
			console.log(parsed);
			if (parsed) {
				const withParent = { ...parsed, parent: currentList._id };
				TaskAPI.addTask(withParent)
					.then(() => ListAPI.getLists())
					.then((l) => {
						lists = l.map(initListFromJSON);
						if (currentList != null) {
							currentList = lists.find((list) => list._id == currentList?._id) || null;
						}
					});
			}

			naturalInput = '';
		}
	}

	function addList() {
		if (newListName) {
			ListAPI.addList({ title: newListName, color: color })
				.then(() => ListAPI.getLists())
				.then((l) => {
					lists = l.map(initListFromJSON);
					newListName = '';
				});
		}
	}

	function setCompletion(_id: string, completed: boolean) {
		TaskAPI.setTaskCompletion(_id, completed)
			.then(() => ListAPI.getLists())
			.then((l) => {
				lists = l.map(initListFromJSON);
				if (currentList != null) {
					currentList = lists.find((list) => list._id == currentList?._id) || null;
				}
			});
	}

	function remove(_id: string) {
		TaskAPI.deleteTask(_id)
			.then(() => ListAPI.getLists())
			.then((l) => {
				lists = l.map(initListFromJSON);
				if (currentList != null) {
					currentList = lists.find((list) => list._id == currentList?._id) || null;
				}
			});
	}

	function getStyle(list: List) {
		return `background-color: ${list.color};`;
	}
</script>

<div class="bg-secondary-300 min-h-screen h-full flex ">
	<div class="bg-primary-400 p-4">
		<h1 class="text-2xl font-bold text-white">D</h1>
	</div>
	<div class="lg:flex m-4 space-y-4 lg:space-y-0 lg:space-x-4 flex-grow">
		<div class=" p-8 basis-1/4  bg-white shadow-md rounded space-y-4 ">
			<h1 class="font-semibold text-2xl">Your Lists</h1>
			<div class="flex space-x-4 ">
				<input
					class="p-2 shadow border-2 border-secondary-200 focus:border-secondary-400 outline-none rounded w-full basis-5/6"
					bind:value={newListName}
					placeholder="New List Name"
				/>
				<input type="color" class="my-auto" bind:value={color} />
				<button
					class="py-2 px-4 text-center hover:bg-secondary-500 bg-secondary-400 rounded w-full basis-1/6 font-semibold text-white"
					on:click={addList}
				>
					Add
				</button>
			</div>
			<div class="space-y-2">
				{#each lists as list}
					<div
						class="p-2 shadow border-2 rounded font-semibold flex space-x-4"
						class:border-secondary-500={list._id == currentList?._id}
						on:click={() => (currentList = list)}
					>
						<div class="rounded-full h-4 w-4 my-auto" style={getStyle(list)} />
						<p>{list.title}</p>
					</div>
				{/each}
			</div>
		</div>
		<main class="p-8 basis-3/4  shadow-md mx-auto rounded space-y-8 bg-white flex flex-col">
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
									class="p-2 shadow border-2 border-primary-200 focus:border-primary-400 outline-none rounded w-full basis-5/6"
									bind:value={naturalInput}
									placeholder="e.g. My Task pri:high do:19/06 due:19/06"
								/>
								<button
									class="py-2 px-4 text-center hover:bg-primary-500 bg-primary-400 transition-colors rounded w-full basis-1/6 font-semibold text-white disabled:bg-gray-600"
									on:click={addNaturalTask}
									disabled={!currentList}
								>
									Add
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
			<div class="flex flex-grow flex-col space-y-4">
				<div class="basis-2/3">
					<h2 class="text-2xl font-semibold mb-4">Your Tasks</h2>
					<div class="space-y-2">
						{#each uncompletedTasks as task (task._id)}
							<div animate:flip={{ duration: 500 }}>
								<TaskListTile
									{task}
									on:toggle={() => setCompletion(task._id, !task.completed)}
									on:delete={() => remove(task._id)}
									on:click={() => setCompletion(task._id, !task.completed)}
								/>
							</div>
						{/each}
					</div>
				</div>
				<div class="basis-1/3 flex flex-col">
					<h2 class="text-2xl font-semibold mb-4">Completed Tasks</h2>
					<div class="space-y-2 overflow-y-auto flex-grow">
						{#each completedTasks as task (task._id)}
							<div animate:flip={{ duration: 500 }}>
								<TaskListTile
									{task}
									on:toggle={() => setCompletion(task._id, !task.completed)}
									on:delete={() => remove(task._id)}
									on:click={() => setCompletion(task._id, !task.completed)}
								/>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</main>
	</div>
</div>
