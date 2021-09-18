<script>
	import ProjectManager from "../ProjectManager.js";
	import Project from "./Project.svelte";

	let gh_icon_monochrome = "./gh_icon_monochrome.png";

	import { getData } from "../store";

	let settings = ProjectManager.getSettings()
	let number_of_projs = settings.project_paths.length;

	import { editor_info } from "../store";
	let editorinfo;
	editor_info.subscribe(value => {
		editorinfo = value;
	});

	let showSaveDialog = false;
	let name_input = "";
	let authors_input = "";
	let location = "";

	function cancel(){
		showSaveDialog = false;
		name_input = "";
		authors_input = "";
		location = "";
	}

	function pickLocation(){
		console.log("Picking location")
		let path = getData("loc");
		location = path + ".gh"
	}

	function saveAs(){
		let settings = ProjectManager.getSettings()
		let ns = settings;
		settings.project_paths.push({name: name_input, path: location})

		let settings_b64 = window.btoa(unescape(encodeURIComponent( JSON.stringify(settings) )));
		getData("update?settings="+settings_b64);

		let project = {
			name: name_input,
			authors: authors_input,
			inventory: []
		}
		let data = window.btoa(unescape(encodeURIComponent( location + "|" + JSON.stringify(project) )));
		getData("saveAs?data="+data);
		ProjectManager.openProject(location)
		cancel()
	}

</script>

<main>
	<div class="sidebar">
		<div class="sidebar-logo">
			<img src={gh_icon_monochrome} alt="monochrome logo"/>
		</div>

		<div class="sidebar-icons">
			<div class="sidebar-icons-icon">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
				  </svg>
			</div>

			<div class="sidebar-icons-icon">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
				  </svg>
			</div>
			<div class="sidebar-icons-icon">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
				  </svg>
			</div>
		</div>
	</div>
	<div class="projects">

		<div class="search">	
			<div class="search-icon">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				  </svg>
			</div>


			<input class="search-input" placeholder="Type in to search..." type="text"/>
		</div>
		
		<div class="projects-info">	
			<div class="projects-info-circle"></div>
			<h1 class="projects-info-title">Projects</h1>
			<h1 class="projects-info-number">{number_of_projs}</h1>
		</div>

		<div class="projects-list">
			<div on:click={() => showSaveDialog = true} class="project project-new">
				<h1 class="project-letter">+</h1>
				<h1 class="project-title">New Project</h1>
			</div>

			{#each settings.project_paths as proj, i}
				<Project key={i} name={proj.name} path={proj.path}/>
			{/each}
		</div>
	</div>


	{#if showSaveDialog}
	<div class="save">
		<div class="container">
			<h1>New project</h1>
			<input bind:value={name_input} placeholder="Project name..." />
			<input bind:value={authors_input} placeholder="Authors..." />
			<button on:click={pickLocation} class={location != ""? "location" : ""}>Pick location</button>

			<div class="buttons">
				<button on:click={cancel} class="cancelbtn">Cancel</button>
				<button on:click={saveAs} class="savebtn">Save</button>
			</div>
		</div>
	</div>
	{/if}

</main>

<style>

	main {
		display: flex;
		flex-direction: row;
	}

	.save{
		width:  100vw;
		height:  100vh;
		position: absolute;
		display:  flex;
		align-items:  center;
		justify-content: center;
	}

	button{
		border:  2px solid rgba(51, 51, 51, 0.7);
		font-size: 15px;
		padding:  0.25em 1em;
		/*border-radius: 40px;*/
		background-color: white;
		color:  rgba(51, 51, 51, 0.9);
		margin-left: 2vw;
		margin-top: 1.2em;
		cursor:  pointer;
	}

	.buttons{
		display:  flex;
		flex-direction: row;
		align-items: center;
		width:  100%;
	}

	.savebtn{
		border:  2px solid #4479FF;
		background-color: #4479FF;
		color:  white;
	}

	.location{
		border:  2px solid #4479FF;
		color:  #4479FF;
	}

	.cancelbtn{
		margin-right: 5em;
	}

	.container{
		width:  300px;
		height: 300px;
		background-color: white;
		border: 1px solid rgba(51, 51, 51, 0.1) !important;
	}

	.container h1{
		font-size: 22px;
		margin-top: 1em;
		margin-left: 2vw;
		margin-bottom: 0.5em;
		opacity: 0.8;
	}

	.container input{
		margin-left: 2vw;
		margin-top: 1em;
		padding:  0.5em;
		width:  80%;
		box-shadow: none;
		border-radius: 0px;
		border:  none;
		border-bottom: 2px solid rgba(51, 51, 51, 0.5);
	}

	.container input:focus{
		outline:  none;
		padding-bottom: 0.7em;
		border-bottom: 2px solid rgba(51, 51, 51, 0.9);
	}

	.sidebar{
		position: fixed;
		width: 7vw;
		height: 100vh;
		box-shadow: 0px 0px 5px rgb(214, 214, 214);
		display: flex;
		flex-direction: column;
		align-items: center;
	}


	.sidebar-logo{
		height: 30%;
	}


	.sidebar-logo img{
		width: 40px;
		height: 40px;
		padding-top: 2.5vh;
	}

	.sidebar-icons-icon{
		width: 25px;
		height: 25px;
		margin-top: 4vh;
		cursor: pointer;
		opacity: 0.6;
	}

	.sidebar-icons-icon:hover{
		opacity: 1;
	}

	.projects{
		margin-left: 7vw;
		width: 93vw;
		height: 100vh;
		background-color: #FCFCFC;


	}
	.search{
		position: fixed;
		width: 100%;
		height: 10vh;
		border-bottom: 1px solid #F2F2F2;
		background-color: #FCFCFC;

		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.search-icon{
		width: 25px;
		height: 25px;
		opacity: 0.3;
		margin: 0vw 2.5vw 0vw 5vw;
	}

	.search-input{
		border: none;
		height: 90%;
		width: 50%;
		background-color: transparent;
	}
	
	.projects-info{
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-left: 5vw;
		margin-top: 15vh;
	}

	.projects-info-circle{
		border-radius: 1000px;
		border: 3px solid #D34E5B;
		width: 5px;
		margin-right: 1em;
		height: 5px;
	}

	.projects-info-title{
		color: #4C4C4C;
		font-size: 22px;
		margin-right: 0.5em;
	}

	.projects-info-number{
		color: #898989;
		font-weight: 500;
		font-size: 22px;
	}

	.projects-list{
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		height: auto;
	}

	.project{
		background-color: #E8DEF7;
		height: 200px;
		width: 200px;
		margin-left: 5vw;
		margin-top: 5vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}

	.project:hover{
		transform: scale(1.05);
	}

	.project h1{
		color: #5B5268;
	}

	.project-letter{
		font-size: 50px;
		margin-bottom: 2vh;
	}

	.project-title{
		font-size: 15px; 
		font-weight: 500;
	}

	.project-new{
		background-color: #EFEFEF;
	}

</style>