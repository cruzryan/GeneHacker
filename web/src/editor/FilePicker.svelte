<script>

	import ProjectManager from "../ProjectManager";
	import { getData } from "../store";

  	import { editor_info } from "../store";
	let editorinfo;

  	editor_info.subscribe(value => {
		editorinfo = value;
	});

	export let left = 100;
	export let top = 100;
	
	let moving = false;
	
	function onMouseDown() {
		moving = true;
	}
	
	function onMouseMove(e) {
		if (moving) {
			left += e.movementX;
			top += e.movementY;
		}
	}
	
	function onMouseUp() {
		moving = false;
	}
	

	function closeFilePicker(){
		let new_editinfo = editorinfo;
		showSubMenu = false;
    	new_editinfo.show_filepicker = false;
    	editor_info.set(new_editinfo)
	}

	let inventory = editorinfo.current_project.inventory;

	let indexclicked = 1;
	let showSubMenu = false;

	function showSub(index){
		showSubMenu = !showSubMenu;
		indexclicked = index;
	}

	function clone(){
		let ft = inventory[indexclicked];
		let ft_clone = Object.assign({}, ft);
		ProjectManager.addItemToInventory(ft_clone);
	}

	let show_rename = false;
	let in_val = "";
	function showRename(){
		in_val = inventory[indexclicked].name;
		show_rename = true;
	}

	function rename(){
		show_rename = false;
		showSubMenu = false;
		ProjectManager.changeItemName(indexclicked, in_val);
	}

	function deleteItem(){
		show_rename = false;
		showSubMenu = false;
		ProjectManager.deleteItemFromInventory(indexclicked)
	}

	function openTab(i){
		let ft = inventory[i];
		ProjectManager.createNewTab(i)
	}

	let fileinput;

	const onFileSelected = (e) =>{
		let fd = e.target.files[0];
		let reader = new FileReader();
		reader.readAsText(fd)
		reader.onload = e => {
			let data_b64 = getData("gbk?data=" + window.btoa(e.target.result));
			ProjectManager.addPlasmid(data_b64)
        };
	}

</script>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<main>
	<div class="container"style="left:{left}px; top:{top}px;">

		<div class="tooltip"  on:mousedown={onMouseDown} >

			<h1>Inventory</h1>

			<input style="display:none" type="file" accept=".gbk" on:change={(e)=>onFileSelected(e)} bind:this={fileinput} >
			<div class="tools">
				
				<!-- UPLAOD -->
				<div on:click={() => fileinput.click()} class="icon tool-icon">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
				</svg>
				</div>
				<!-- ADD -->
				<div class="icon tool-icon">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
				</div>

				<!-- CLOSE -->
				<div on:click={closeFilePicker} class="icon tool-icon">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
				</div>
			</div>

		</div>

		{#each editorinfo.current_project.inventory as file, i}
		<div class="file">
			{#if file.type == "plasmid"}
			<div class="icon file-icon">
        		<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#767C89">		
        		    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 		0 		118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 		0-1.457.39-2.823 1.07-4" />
        		</svg>
    		</div>
    		{/if}

    		{#if file.type == "text-editor"}
    		<div class="icon file-icon">
        		<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#767C89">
            		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        		</svg>
    		</div>	
    		{/if}

    		{#if show_rename && i == indexclicked}
			<input type="text" bind:value={in_val}/>
			<button on:click={rename}>Done</button>

			{:else}
			<h2 on:click={() => openTab(i)}>{file.name}</h2>
			<div class="icon ham" on:click={() => showSub(i)}>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
				</svg>
			</div>	
			{/if}

		</div>
		{/each}

		
	</div>

	{#if showSubMenu}
   		<div class="submenu" style="left:{left+250}px; top:{(top+40)+(indexclicked*40)}px;">
   				<h1 on:click={showRename}>Rename</h1>
   				<h1 on:click={clone}>Clone</h1>
   				<h1 on:click={deleteItem}>Delete</h1>
   		</div>
    {/if}
</main>

<style>
	
	input{
		width: 60%;
		margin-right: 2.5%;
	}

	button{
		color:  white;
		background-color: #4479FF;
		border:  none;
		padding:  0.1em 0.4em;
		border-radius: 2px;
		cursor:  pointer;
	}
	
	.submenu{
		position: absolute;
		width: 100px;
		z-index: 6;
		background-color: white;
    	text-align: center;
    	border: 1px solid rgba(51, 51, 51, 0.1) !important;
	}

	.submenu h1{
		font-size: 12px;
		font-weight: 500;
		padding-bottom:  0.5em;
		padding-top: 0.5em;
		cursor: pointer;
	}

	.submenu h1:hover{
		background-color: rgba(200, 200, 200, 0.05);
	}

	.container{
		z-index: 5;

		position: absolute;

		width: 250px;
		min-height: 100px;

		background-color: white;

		display: flex;
		flex-direction: column;
    	border: 1px solid rgba(51, 51, 51, 0.1) !important;

	}

	.tooltip{
		display:  flex;
		flex-direction: row;
		margin-top: 0.5em;
		padding-bottom: 0.5em;
    	border-bottom: 1px solid rgba(51, 51, 51, 0.1) !important;

	}

	.tooltip h1{
		font-weight: 500;
		font-size: 15px;
		width:  45%;
		padding-left: 10%;
	}

	.tools{
		display:  flex;
		flex-direction: row;
	}

	.file{
		width:  97%;
		height:  30px;
		cursor: pointer;

		padding:  0.25em;
		display: flex;
		flex-direction: row;
		/*align-items: baseline;*/
		align-items: center;
        text-overflow: ellipsis;
		overflow: hidden;
	}

	.file:hover{
		background-color: rgba(200, 200, 200, 0.05);
	}

	.file h2{
		font-weight: 500;
		font-size: 12px;
		width:  80%;
		overflow: hidden;
        text-overflow: ellipsis;
	}

	.icon{
		height: 15px;
        width: 15px;
	}

	.file-icon{
        height: 15px;
        width: 15px;
        margin: 1em;
        margin-top: 15px;
    }

    .tool-icon{
    	margin-left: 1em;
    	cursor: pointer;
    }

    .tool-icon:hover, .ham:hover{
    	transform: scale(1.2);
    }

</style>