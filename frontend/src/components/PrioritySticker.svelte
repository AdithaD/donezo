<script lang="ts">
	export let priority: number;
</script>

{#if priority == 1}
	<div class="bg-blue-500 p-2  uppercase rounded h-fit">
		<p class="text-sm  font-bold text-white">LOW</p>
	</div>
{:else if priority == 2}
	<div class="bg-orange-500 p-2 font-semibold uppercase rounded h-fit">
		<p class="text-sm  font-bold text-white">MEDIUM</p>
	</div>
{:else if priority == 3}
	<div class="bg-red-500 p-2 font-semibold uppercase rounded h-fit">
		<p class="text-sm  font-bold text-white">HIGH</p>
	</div>
{/if}
