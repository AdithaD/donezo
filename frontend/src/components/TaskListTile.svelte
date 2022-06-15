<script lang="ts">
	import type { Task } from '$/models/task';
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import PrioritySticker from './PrioritySticker.svelte';

	export let task: Task;

	let dispatch = createEventDispatcher();

	let showMenu = false;

	export function toggle() {
		dispatch('toggle');
	}
</script>

<div
	class="flex px-4 py-2 border-orange-200 border-2 rounded hover:bg-orange-100 transition-all  justify-between space-y-2"
	class:border-orange-200={!task.completed}
	class:border-gray-200={task.completed}
	transition:fade={{ duration: 200 }}
>
	<div class="flex-grow flex justify-between items-center" on:click>
		<div class="md:flex md:justify-between md:flex-grow">
			<div class="space-x-2">
				<input type="checkbox" checked={task.completed} on:change={toggle} />
				<span class="align-middle">{task.title}</span>
			</div>
			<div class="flex space-x-4">
				{#if (task.dueDate || task.doDate) && !task.completed}
					{#if task.doDate}
						<p class="text-sm text-gray-600 p-1 h-fit bg-gray-200 rounded ">
							<span class="">
								<b>Do</b>: {task.doDate.toDateString()}
							</span>
						</p>
					{/if}
					{#if task.dueDate}
						<p class="text-sm text-gray-600 p-1 h-fit bg-gray-200 rounded">
							<span class="">
								<b>Due</b>: {task.dueDate.toDateString()}
							</span>
						</p>
					{/if}
				{/if}
			</div>
		</div>
		<div class="flex ml-8">
			<div class="m-auto">
				{#if !task.completed}
					<PrioritySticker priority={task.priority} />
				{/if}
			</div>
		</div>
	</div>
	<div class="flex ml-4 h-fit relative" on:click={(e) => (showMenu = !showMenu)}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6 m-auto	"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="2"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
			/>
		</svg>
		{#if showMenu}
			<div
				class="absolute top-4 left-0 bg-white z-[1000] border-2 border-orange-200 hover:bg-orange-100  rounded flex flex-col"
			>
				<p class="p-4" on:click={(e) => dispatch('delete')}>Delete</p>
			</div>
		{/if}
	</div>
</div>
