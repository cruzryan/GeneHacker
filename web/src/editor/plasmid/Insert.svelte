<script>
	
  import { editor_info } from "../../store";
  import {SequenceMap} from "./SequenceMap";
  import {CircularMap} from "./CircularMap";
  import { GeneAMA } from "../GeneAMA";
	import { Proteins } from "./Proteins";

  let editorinfo;

  editor_info.subscribe(value => {
		editorinfo = value;
	});

	//Screens: menu, sequence, protein
	let screenToShow = "menu";

	function showSequenceScreen(){screenToShow = "sequence"}
	function showProteinScreen(){screenToShow = "protein"}

	let insert_sequence_input = "";
	function stopInsert(){
    screenToShow = "menu";
		let new_editinfo = editorinfo;
    new_editinfo.show_insert = false;
    new_editinfo.screen_on_top_showing = false;
    editor_info.set(new_editinfo)
    insert_sequence_input = "";
	}

	function handleInsertSequence(){

      let [cursor, _] = SequenceMap.getSelected()

      if(cursor == null) return;

      let oldseq = GeneAMA.getSequence();
      let final_sequence = "";

      for(let i = 0; i < insert_sequence_input.length; i++){

      	let c = insert_sequence_input[i];
        let isAmino = c == 'a' || c == 't' || c == 'g' || c == 'c';

        if(isAmino){
          final_sequence += c;
        }else{
          final_sequence += RNA_to_DNA(codon_to_RNA(c.toUpperCase()));
        }

      }
      let newseq = oldseq.substring(0,cursor) + final_sequence + oldseq.substring(cursor);

      GeneAMA.updateSequence(newseq)

      let f = GeneAMA.getFeatures();
      let newF = [];

      for(let i = 0; i < f.length; i++){
      	if(cursor > f[i].start  &&  cursor < f[i].end){
      		f[i].end += final_sequence.length;
      	}

      	if(cursor < f[i].start){
      		f[i].start += final_sequence.length;
      		f[i].end += final_sequence.length;
      	}
      		
      		newF.push(f[i])
      }


			SequenceMap.updateMarkers(cursor, cursor+final_sequence.length)

      SequenceMap.loop()
      CircularMap.loop()

      stopInsert()

	}

	function RNA_to_DNA(RNA){
    return RNA.toLowerCase().replace(/u/g,"t")
  }

  function codon_to_RNA(codon){
    switch(codon){
      case 'A': return "GCU";
      case 'I': return "AUU";
      case 'R': return "CGU";
      case 'L': return "CUU";
      case 'N': return "AAU";
      case 'K': return "AAA";
      case 'D': return "GAU";
      case 'M': return "AUG";
      case 'F': return "UUU";
      case 'C': return "UGU";
      case 'P': return "CCU";
      case 'Q': return "CAA";
      case 'S': return "UCU";
      case 'E': return "GAA";
      case 'T': return "ACU";
      case 'W': return "UGG";
      case 'G': return "GGU";
      case 'Y': return "UAU";
      case 'H': return "CAU";
      case 'V': return "GUU";
      case 'X': return "UAA";
      default: return "";
    }
  }

  let protein_input = "";
  let proteins_to_display = Proteins.lookUp(protein_input);

  function insertProtein(seq){
  	insert_sequence_input = seq;
  	handleInsertSequence();
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

	{#if screenToShow == "protein"}
		<div class="container bigcontainer ">
				<h1>Insert protein</h1>
      	<input on:input={()=>proteins_to_display = Proteins.lookUp(protein_input)} bind:value={protein_input} type="text" placeholder="What are you looking for?">

      	<div class="protein-container">

      		{#each proteins_to_display as {name, desc, sequence}}
      			<div class="protein" on:click={() => insertProtein(sequence)}>
      					<h2>{name}</h2>
      					<h3>{desc}</h3>
      			</div>
      		{/each}
      	</div>
      	<div class="buttons">
      			<button class="cancel" on:click={stopInsert}>Cancel</button>
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

	.bigcontainer{
		min-width:  400px !important;
		min-height:  370px !important;

		height:  80%;
    justify-content: start !important;
	}

	.bigcontainer h1{
			margin-top: 2em !important;
	}

	.bigcontainer input{
		border:  1px solid rgba(171, 171, 171, 0.3) !important;
	}

	.protein-container{
		width: 80%;
		height: 70%;
	}

	.protein{
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100%;
		height: 70px;
		box-shadow: 0px 0px 3px rgba(171, 171, 171, 0.3);
		cursor:  pointer;
		margin-top: 5%;
	}

	.protein:hover{
		transform: scale(1.05);
	}

	.protein h2{
		font-size: 17px;
		margin-left: 5%;
		font-weight: 500;
		width: 250px;
  	white-space: nowrap;
  	overflow: hidden;
 		text-overflow: ellipsis;
	}

	.protein h3{
		font-size: 15px;
		font-weight: 500;
		margin-left: 5%;
		color: rgba(151, 151, 151, 1.0);
		width: 250px;
  	white-space: nowrap;
  	overflow: hidden;
 		text-overflow: ellipsis;
	}	

	.container{
		min-width:  400px;
		min-height:  230px;
		background-color: white;
		box-shadow: 0px 0px 10px rgba(171, 171, 171, 0.3);
    border-radius: 5px;
    display:  flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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