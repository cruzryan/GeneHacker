<script>
	

	//Screens: menu, sequence, protein
	let screenToShow = "sequence";

	function showSequenceScreen(){screenToShow = "sequence"}
	function showProteinScreen(){screenToShow = "protein"}

	let insert_sequence_input = "";
	let insert_sequence_name = "";
	function stopInsert(){

	}

	function handleInsertSequence(){

	}

</script>

<main>

	{#if screenToShow == "menu"}
	<div class="container">
      	<h1>Insert</h1>
		<div on:click={showSequenceScreen} class="c-option">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#4479FF">
  			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
			</svg>
			<h2>Sequence</h2>
		</div>
		<div on:click={showProteinScreen} class="c-option">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#4479FF">
  			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
			</svg>
			<h2>Protein</h2>
		</div>
	</div>
	{/if}


	{#if screenToShow == "sequence"}
		<div class="container">
      		<h1>Insert sequence</h1>
      		<input bind:value={insert_sequence_input} type="text" placeholder="Type any codon or sequence here...">
      		<div class="buttons">
      			<button class="cancel" on:click={stopInsert}>Cancel</button>
      			<button class="ok" on:click={handleInsertSequence}>Insert</button>
      		</div>
		</div>		
	{/if}

</main>

<style>
	
	main{
		position:  absolute;
		z-index: 4;
		overflow: hidden;
		display:  flex;
    	align-items: center;
    	justify-content: center;
    	position: absolute;
    	width: 99.5%;
    	height:  70%;
    	background-color: rgba(255, 255, 255, 0.7);
	}

	.container{
		min-width:  400px;
		min-height:  230px;
		background-color: white;
		box-shadow: 0px 0px 10px rgba(171, 171, 171, 0.3);
    	border-radius: 5px;
    	display:  flex;
    	flex-direction: column;
    	align-items: center !important;
    	justify-content: center !important;
	}

	.container h1{
		font-size: 20px;
		margin: 0.5em;
		opacity: 0.9;
	}

	.c-option{
		display:  flex;
		flex-direction: row;
		align-items: center;
		border:  1px solid rgba(171, 171, 171, 0.3);
		width:  80%;
		padding:  0.5em;
		margin:  0.5em;
		cursor:  pointer;
	}

	.c-option:hover{
		border:  1px solid rgba(131, 131, 131, 0.3);
	}

	.c-option h2{
		font-size: 20px;
		opacity: 0.8;
	}

	svg{
		width:  25px;
		height: 25px;
		margin-right: 1em;
		margin-left: 1em;
	}

	.container input{
    padding:  0.5em 0.5em  0.5em 2em;
    border-radius: 5px;
    border:  1px solid rgba(51, 51, 51, 0.3);
    margin-top: 1em;
  }

  .buttons{
    /*display:  flex;*/
    /*flex-direction: row;*/
    padding-bottom: 1em;
  }

  .container button{
    padding: 0.5em 0.5em;
    width: 120px;
    cursor: pointer;
    border-radius: 15px;
    border:  none;
    background-color: #fff;
    color:  black;
    margin-top: 1.5em;
    border: 1px solid black;
    background-color: white !important;
    border: 1px solid rgba(51, 51, 51, 0.3) !important;
    color: black !important;
  }

  .cancel:hover{
    border: 1px solid rgba(51, 51, 51, 0.7) !important;
  }

  .ok:hover{
    background-color: #4479FF !important;
    color: white !important;
    border:  none !important;
  }

</style>