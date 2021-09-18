<script>

	import ProjectManager from "../ProjectManager.js";

    export let key = 0;
    export let name = "";
    export let path = "";

    function getColorClass(n){
        switch(n % 5){
            case 0: return "project purple";
            case 1: return "project lightblue";
            case 2: return "project pink";
            case 3: return "project orange";
            case 4: return "project teal";
        }
    }

    function openPath(){
    	updateProj(path,name)
    	ProjectManager.openProject(path);
    }

	import { editor_info } from "../store";
	let editorinfo;
	editor_info.subscribe(value => {
		editorinfo = value;
	});

	function updateProj(path, name){
		let new_editinfo = {

			name: name,
		    project_path: path,
		
		    split_window: false,
		    show_filepicker: true,
		    show_menu: false,
		
		    screen_on_top_showing: false,
		    show_replace: false,
		    show_goto: false,
		    show_insert: false,
		    show_new_feature: false,
		
		    current_project: {},
		
		    //Active tabs
		    activeTab: 0,
		    activePanel: "left",
		
		    left_panel: {
		        current_tab: 0,
		        tabs: []
		    },
		    right_panel: {
		        current_tab: 0,
		        tabs: []
		    }
		};
    	editor_info.set(new_editinfo) 
	}

</script>

<div on:click={() => openPath()} class={getColorClass(key)}>
    <h1 class="project-letter">{name.charAt(0)}</h1>
    <h1 class="project-title">{name}</h1>
</div>

<style>

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

    .purple{
        background-color: #E8DEF7;
    }

    .lightblue{
        background-color: #C9E5FF;
    }

    .pink{
        background-color: #E0B1DA;
    }

    .orange{
        background-color: #E0B8C0;
    }

    .teal{
        background-color: #B3D5E2;
    }

</style>
