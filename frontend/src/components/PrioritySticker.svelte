<script lang="ts">
	export let priority: number;

	function getText(): string {
		switch (priority) {
			case 3:
				return 'HIGH';
			case 2:
				return 'HIGH';
			case 1:
				return 'HIGH';
			default:
				return '';
		}
	}

	function getClasses(): string {
		let bgClass: string = '';
		switch (priority) {
			case 3:
				bgClass = 'bg-red-500';
				break;
			case 2:
				bgClass = 'bg-orange-500';
				break;

			case 1:
				bgClass = 'bg-green-500';
				break;

			default:
				bgClass = '';
				break;
		}

		return `${bgClass} text-white font-semibold uppercase w-16 px-2 py-1 rounded text-center`;
	}
</script>

<div class={getClasses()}>
	<span class="text-sm font-bold text-white ">{getText()}</span>
</div>
