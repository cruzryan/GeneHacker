<script>
	import {current_screen} from "./store";
	import Home from "./home/Home.svelte";
	import Editor from "./editor/Editor.svelte";
	let current_screen_value;

	current_screen.subscribe(value => {
		current_screen_value = value;
	});

</script>

<main>
	{#if current_screen_value == "HOME"}
	<Home/>
	{/if}

	{#if current_screen_value == "EDITOR"}
	<Editor/>
	{/if}
</main>

<style></style>