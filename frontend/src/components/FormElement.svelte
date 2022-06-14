<script lang="ts">
	export let label: string = '';
</script>

<div class="space-y-4">
	<h2 class="font-semibold text-xl">{label}</h2>
	<slot />
</div>
