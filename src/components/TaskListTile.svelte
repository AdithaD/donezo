<script lang="ts">
	import type { Task } from 'src/models';
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	export let task: Task;

	let dispatch = createEventDispatcher();

	export function toggle() {
		dispatch('toggle');
	}
</script>

<div
	class="p-4 border-orange-200 border-2 rounded flex space-x-2 hover:bg-orange-100 transition-all hover:transform hover:scale-105"
	class:border-orange-200={!task.completed}
	class:border-gray-200={task.completed}
	on:click
	transition:fade={{ duration: 200 }}
>
	<input type="checkbox" checked={task.completed} on:change={toggle} />
	<p>{task.title}</p>
</div>
