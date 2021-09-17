<script>
	import Home from "./home/Home.svelte";
	import IDE from "./editor/IDE.svelte";
	import {current_screen} from "./store";
	let current_screen_value;

	current_screen.subscribe(value => {
		current_screen_value = value;
	});

	import ProjectManager from "./ProjectManager.js";
	new ProjectManager();

	ProjectManager.getSettings();
</script>

<main>
	{#if current_screen_value == "HOME"}
	<Home/>
	{/if}

	{#if current_screen_value == "EDITOR"}
	<IDE/>
	{/if}
</main>

<style></style>