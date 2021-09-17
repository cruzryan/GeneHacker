<script>
	import { quill } from 'svelte-quill'
	
	let options = { placeholder: "", theme:"snow"}
	
	let content = { html: '', text: ''};
	
	function handleContentEditor(e){
		content = e.detail
		console.log(e.detail)
	}

</script>

<svelte:head>
	<link href="//cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
	<style>
			div .ql-toolbar{
				/*background-color: blueviolet !important;*/
				border:  none !important;
				margin-top: 1em;
				margin-left: 1em;
			}

			div .ql-editor{
				-webkit-user-select: all !important;
				user-select: all !important;
				margin-left: 1em;
				/*background-color: red !important;*/
			}

			div .ql-snow .ql-editor pre.ql-syntax {
  	  	background-color: #f8f8f8 !important;
	    	color: #0d0d0d !important;
    		overflow: visible !important;
			}

	</style>
</svelte:head>

<main>
  <div class="editor" use:quill={options} on:text-change={e => handleContentEditor(e)}/>
</main>


<style>

	main{
		width:  100%;
		height:  100%;
	}

	.editor{
		width:  100%;
		height:  100%;
	}

	*{
		border: none !important;
	}

</style>