<script>
	
	import { editor_info } from "../store";
	let editorinfo;

	import {current_screen} from "../store";
	let current_screen_value;

	import {getData} from "../store";

	current_screen.subscribe(value => {
		current_screen_value = value;
	});

  	editor_info.subscribe(value => {
		editorinfo = value;
	});

  	//menus: file, view, help 
  	export let key = 0;

	function stopShowingMenu(){
		let new_editinfo = editorinfo;
    	new_editinfo.show_menu = false;
    	editor_info.set(new_editinfo)   
	}

	function goToHome(){
		current_screen.set("HOME")
	}

	function showInventory(){
		let new_editinfo = editorinfo;
    	new_editinfo.show_filepicker = !new_editinfo.show_filepicker;
    	editor_info.set(new_editinfo)   
	}

	function splitScreen(){
		let new_editinfo = editorinfo;
    	new_editinfo.split_window = !new_editinfo.split_window;
    	editor_info.set(new_editinfo)   
	}

	function goToWebsite(url){
		window.open(url)
	}

	function saveEverything(){
		let path = editorinfo.project_path;
		let proj =JSON.stringify(editorinfo.current_project);
		let data = window.btoa(path +"|"+proj)
		console.log(data)
		getData("save?data=" + data)
		console.log("everything saved!")
	}


</script>

<main>

	<div on:click={stopShowingMenu} class="getoff"></div>

	<div class="menu" style="left: {key*90}px">
		<!-- File -->
		{#if key == 0}
		<h1 on:click={saveEverything} class="item">Save</h1>
		<h1 on:click={goToHome} class="item">Exit without saving</h1>
		{/if}

		<!-- View -->
		{#if key == 1}
		<h1 on:click={showInventory} class="item">Inventory</h1>
		<h1 on:click={splitScreen} class="item">Split window</h1>
		{/if}

		<!-- Help -->
		{#if key == 2}
		<h1 on:click={() => goToWebsite("https://www.ncbi.nlm.nih.gov/")} class="item">Go to NCBI</h1>
		<h1 on:click={() => goToWebsite("https://www.addgene.org/")} class="item">Go to AddGene</h1>
		<h1 on:click={() => goToWebsite("https://www.uniprot.org/")} class="item">Go to UniProt</h1>
		{/if}


	</div>
</main>

<style>

	.getoff{
		position: absolute;
		width:  100vw;
		height:  80vh;
		z-index: 5;
		padding-top: 5vh;
	}

	.menu{
		position: absolute;
		min-width: 120px;
		z-index: 6;
		background-color: white;
    	border: 1px solid rgba(51, 51, 51, 0.1) !important;
    	border-top: 0px solid red !important;
	}		

	.menu h1{
		font-size: 12px;
		font-weight: 500;
		padding-bottom:  0.5em;
		padding-top: 0.5em;
		cursor: pointer;
		padding-left: 2em;
		padding-right: 2em;
	}

	.menu h1:hover{
		background-color: rgba(200, 200, 200, 0.05);
	}

	*{
		user-select: none;
    	-webkit-user-select: none;
    }

</style>