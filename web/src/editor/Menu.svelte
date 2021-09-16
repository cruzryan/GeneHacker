<script>
	
	import { editor_info } from "../store";
	let editorinfo;

  	editor_info.subscribe(value => {
		editorinfo = value;
	});

  	//menus: file, view, help 
	let current_menu = "file";

</script>

<main>
	


</main>

<style>
		

</style>