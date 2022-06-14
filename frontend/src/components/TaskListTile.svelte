<script lang="ts">
	import type { Task } from 'src/models';
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
	class="flex p-4 border-orange-200 border-2 rounded hover:bg-orange-100 transition-all  justify-between space-y-2"
	class:border-orange-200={!task.completed}
	class:border-gray-200={task.completed}
	transition:fade={{ duration: 200 }}
>
	<div class="flex-grow" on:click>
		<div class="flex justify-between">
			<div class="space-x-2">
				<input type="checkbox" checked={task.completed} on:change={toggle} />
				<span class="align-middle">{task.title}</span>
			</div>
			<div class="flex">
				<div class="m-auto">
					<PrioritySticker priority={task.priority} />
				</div>
			</div>
		</div>
		<div>
			<div class="flex space-x-4">
				{#if task.dueDate || task.doDate}
					{#if task.doDate}
						<p class="text-sm text-gray-600 p-1 bg-gray-200 rounded">
							<b>Do</b>: {task.doDate.toDateString()}
						</p>
					{/if}
					{#if task.dueDate}
						<p class="text-sm text-gray-600 p-1 bg-gray-200 rounded">
							<b>Due</b>: {task.dueDate.toDateString()}
						</p>
					{/if}
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
				class="absolute top-4 left-0 bg-white z-[1000] border-2 border-orange-200 hover:bg-orange-100 p-4 rounded"
			>
				<p on:click={(e) => dispatch('delete')}>Delete</p>
			</div>
		{/if}
	</div>
</div>
