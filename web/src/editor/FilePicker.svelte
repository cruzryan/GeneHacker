<script>

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
    	new_editinfo.show_filepicker = false;
    	editor_info.set(new_editinfo)
	}

</script>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<main>
	<div class="container"style="left:{left}px; top:{top}px;">

		<div class="tooltip"  on:mousedown={onMouseDown} >

			<h1>File Picker</h1>

			<div class="tools">
				
				<!-- UPLAOD -->
				<div class="icon tool-icon">
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

		<div class="file">
			<div class="icon file-icon">
        		<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#767C89">		
        		    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 		0 		118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 		0-1.457.39-2.823 1.07-4" />
        		</svg>
    		</div>
			<h2>Name</h2>
		</div>

		<div class="file">
			<div class="icon file-icon">
        		<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#767C89">		
        		    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 		0 		118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 		0-1.457.39-2.823 1.07-4" />
        		</svg>
    		</div>
			<h2>Name</h2>
		</div>
	</div>

</main>

<style>
	
	main{
		position: absolute;
		width:  100vw;
		height: 100vh;
		z-index: 5;
	}

	.container{

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
		width:  100%;
		height:  30px;
		cursor: pointer;

		padding:  0.25em;
		display: flex;
		flex-direction: row;
		/*align-items: baseline;*/
		align-items: center;
	}

	.file:hover{
		background-color: rgba(200, 200, 200, 0.05);
	}

	.file h2{
		font-weight: 500;
		font-size: 12px;
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

    .tool-icon:hover{
    	transform: scale(1.2);
    }

</style>