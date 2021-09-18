<script>
  	import { onMount, onDestroy } from "svelte";
	
	export let inventory_id = 0;

	import { editor_info } from "../store";
	let editorinfo;
	editor_info.subscribe(value => {
		editorinfo = value;
	});

	function handleContentEditor(e){
		let new_editinfo = editorinfo;
   		new_editinfo.current_project.inventory[inventory_id].html = e.detail;
    	editor_info.set(new_editinfo)   
	}

   import Editor from "cl-editor/src/Editor.svelte"
   let editor

   $: html2 = editorinfo.current_project.inventory[inventory_id].html
   onMount(() => {
	   	$: html2, editor.setHtml(html2)
   })

   function hack(){
   		if(editor != undefined){
   			if(editor.getHtml() != html2){
   				editor.setHtml(html2, 1)
   			}
   		}
   }

	$: html2, hack()

</script>

<main>
<Editor bind:this={editor} html={html2} 
 actions={["h1", "h2", "b", "i", "strike", "ul", "left", "center", "justify", "undo", "redo"]} on:change={(evt)=> handleContentEditor(evt)}/>
</main>
<style>

	main{
		width:  100%;
		height:  100%;
	}
	*{
		border: none !important;
	}

</style>