<script>
  import { CircularMap } from "./CircularMap";
  import { SequenceMap } from "./SequenceMap";
  import Insert from "./Insert.svelte";
  import { editor_info } from "../../store";
  import { GeneAMA } from "../GeneAMA";

  import { watchResize } from "svelte-watch-resize";

  import ProjectManager from "../../ProjectManager";
  import Optimizer from "./Optimizer.svelte";

  export let src = {};
  $: src, loadNew()

  let prevsrc = {};

  function loadNew(){
    if(JSON.stringify(prevsrc) === JSON.stringify(src)){
      return;
    }else{
      prevsrc = Object.assign({}, src);
      let new_src = Object.assign({}, src);
      ProjectManager.loadNewPlasmid(new_src);  
    }
  }

  let editorinfo;

  editor_info.subscribe(value => {
		editorinfo = value;
	});

  $: editorinfo, handleResize()

  let w;
  let h;

  function handleResize(node){
    try{
      CircularMap.resize(w,h);
      SequenceMap.resize(w,h);
      CircularMap.loop()
      SequenceMap.loop()
    }catch(e){

    }
  }

  function getLowestVal(v1, v2) {
    let v = v1 > v2 ? v1 : v2; 
    return v;
  }

  //Variables to handle sequence copying
  let copyval;
  let textarea;

  let k;
  document.onkeypress = function (event) {
    let char = typeof event !== "undefined" ? event.keyCode : event.which;
    k = String.fromCharCode(char);

    //If the window is split then SequenceMap is not showing
    if(editorinfo.split_window) return;
    if(editorinfo.screen_on_top_showing) return;

    switch(k){

      case "s": CircularMap.activateSelection(); break; 
      case "m": {
        SequenceMap.addMarker(); 
        let numShown = SequenceMap.getNumberOfMarkers();
        if (numShown == 2){
          let [start, end] = SequenceMap.getSelected()
          if(start === null || end === null) return;
          let seq = GeneAMA.getSequence().substring(start,end);
          copyval = seq;
        }
      }break; 
      case "r": {
              let new_editinfo = editorinfo;
              new_editinfo.show_replace = true;
              new_editinfo.screen_on_top_showing = true;
              editor_info.set(new_editinfo)
      }break;

      case "g": { showGoto() }break;
    }

  };
 
  /*---------------- Circular Map -------------------------- */
  let CM;
  let circularmap = (p5) => {
    CM = new CircularMap(p5, getLowestVal(w, h), getLowestVal(w, h));

    p5.setup = () => {
      let sz = getLowestVal(w, h);
      p5.createCanvas(sz, sz);
    };

    p5.draw = () => {
      let sz = getLowestVal(w, h);
      p5.resizeCanvas(sz, sz);
      p5.background(255);
      CM.draw();
    };

    // reset board when mouse is pressed
    p5.mousePressed = (e) => {
      try{
      CM.mouseClicked(e);
      p5.loop()
      }catch(e){

      }
    };

  };

  /*---------------- Sequence Map -------------------------- */
  let SM;
  let sequencemap = (p5) => {
    SM = new SequenceMap(p5, getLowestVal(w, h), getLowestVal(w, h))

    p5.setup = () => {
      let sz = getLowestVal(w, h);
      p5.createCanvas(sz, sz);
    }

    p5.draw = () => {
      let sz = getLowestVal(w, h);
      p5.resizeCanvas(sz, sz);
      p5.background(255);
      SM.draw()
      p5.noLoop()
    }

// reset board when mouse is pressed
    p5.mousePressed = (e) => {
      try{
      SM.mouseClicked(e);
      p5.loop()
      }catch(e){

      }
    };

    p5.mouseWheel = (e) => {
      try{
      let dir = e.delta < 0? "up" : "down";
      SM.scroll(dir)
      }catch(e){

      }
    }
  }

  import { onMount, onDestroy } from "svelte";

  let cm, sm;

  let root;

  $: outerWidth = 0
  $: innerWidth = 0
  $: outerHeight = 0
  $: innerHeight = 0

  onMount(function () {
    cm = new p5(circularmap, "circularmap");

    if(editorinfo.split_window === false){
      sm = new p5(sequencemap, "sequencemap");
    }
    
    // CircularMap.resize(innerWidth/2,innerHeight);
    // SequenceMap.resize(innerWidth/2,innerHeight);
    // console.log("DEF: ", Math.floor(innerWidth/2), innerHeight)

  });


  onDestroy(function(){
    const removeElements = (elms) => elms.forEach(el => el.remove());
    removeElements( document.querySelectorAll(".canvtracker") );

    CircularMap.destroy()
    SequenceMap.destroy()

    cm = null;
    CM = null;
    sm = null;
    SM = null;
  })

  /*----------- COPY -------------*/
  function copySequence(){
    textarea.select();
    document.execCommand('copy');
  }

  /*----------- CUT -------------*/

  function cutSequence(){
    textarea.select();
    document.execCommand('copy');
    deleteSequence()
  }

  /*----------- DELETE -------------*/

  function deleteSequence(){
      let [start, end] = SequenceMap.getSelected()
      if(start === null || end === null) return;

      let oldseq = GeneAMA.getSequence();
      let newseq = oldseq.substring(0,start) + oldseq.substring(end);
      GeneAMA.updateSequence(newseq)

      let lenDeleted = end-start;

      let Allf = GeneAMA.getFeatures();
      let newF = [];

      for(let i = 0; i < Allf.length; i++){

        if(start < Allf[i].start && end > Allf[i].end){
          continue;
        }

        if(start > Allf[i].start && end < Allf[i].end){
          let f = Allf[i];
          f.end =  Allf[i].end - lenDeleted;
          newF.push(f);
          continue;
        }

        if(start < Allf[i].end){

          let f = Allf[i];

          f.start = Allf[i].start - lenDeleted;
          f.end =  Allf[i].end - lenDeleted;

          newF.push(f);
        }else{
          newF.push(Allf[i])
        }
      }

      GeneAMA.updateFeatures(newF);
      SequenceMap.loop()
      CircularMap.loop()

  }

  /*----------- INSERT -------------*/

  function showInsert(){
    let new_editinfo = editorinfo;
    new_editinfo.show_insert = true;
    new_editinfo.screen_on_top_showing = true;
    editor_info.set(new_editinfo)
  }

  /*----------- NEW FEATURE -------------*/

  let feature_input = "";

  function showNewFeature(){
    let new_editinfo = editorinfo;
    new_editinfo.show_new_feature = true;
    new_editinfo.screen_on_top_showing = true;
    editor_info.set(new_editinfo)
  }
  

  function stopNewFeature(){
    let new_editinfo = editorinfo;
    new_editinfo.show_new_feature = false;
    new_editinfo.screen_on_top_showing = false;
    editor_info.set(new_editinfo)
  }

  function handleNewFeature(){
    let [start, end] = SequenceMap.getSelected()
      if(start === null || end === null) return;

      GeneAMA.addFeature(start, end, feature_input);
      SequenceMap.loop()
      CircularMap.loop()
      stopNewFeature()
  }

  /*----------- GOTO -------------*/
    
  let goto_input = "";

  function showGoto(){
    let new_editinfo = editorinfo;
    if(editorinfo.screen_on_top_showing) return;
    new_editinfo.show_goto = true;
    new_editinfo.screen_on_top_showing = true;
    editor_info.set(new_editinfo)    
    goto_input = "";
  }

  function stopGoto(){
      let new_editinfo = editorinfo;
      new_editinfo.show_goto = false;
      new_editinfo.screen_on_top_showing = false;
      editor_info.set(new_editinfo)    
      goto_input = "";
  }

  function handleGoto(){
    if(goto_input == "" || !isNumeric(goto_input)){
      stopGoto()
      return;
    }

    SequenceMap.goto(parseInt(goto_input), true)
    SequenceMap.loop()
    stopGoto()
  }

  function isNumeric(value) {
      return /^-?\d+$/.test(value);
  }
 
  /*----------- REPLACE -------------*/

  let replace_input = "";

  function stopReplace(){
    let new_editinfo = editorinfo;
    new_editinfo.show_replace = false;
    new_editinfo.screen_on_top_showing = false;
    editor_info.set(new_editinfo)
    replace_input = "";
  }

  function handleReplace(){

      let [start, end] = SequenceMap.getSelected()

      if(replace_input === "" || start === null || end === null) return;
 
      //Can't replace if input is bigger than the thing to replace.

      let final_sequence = "";
      for(let i = 0; i < replace_input.length; i++){
        let c = replace_input[i];

        let isAmino = c == 'a' || c == 't' || c == 'g' || c == 'c';

        if(isAmino){
          final_sequence += c;
        }else{
          final_sequence += RNA_to_DNA(codon_to_RNA(c.toUpperCase()));
        }
      }

      /*if the thing replacing isn't the same length, don't replace
      This is important because if the change the size of
      the gene sequence, we must also alter the features
      */
      if(final_sequence.length != (end-start)){
        stopReplace()
        console.log("Out of bounds replace error. e-s was: ", end-start, " but len was: ", final_sequence, "final_sequence")
        return;
      }

      let oldseq = GeneAMA.getSequence();
      let newseq = oldseq.substring(0,start) + final_sequence + oldseq.substring(end);
      GeneAMA.updateSequence(newseq)
      SequenceMap.loop()
      stopReplace()
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

  function openOpti(){
    let new_editinfo = editorinfo;
    new_editinfo.show_optimizer = true;
    new_editinfo.screen_on_top_showing = true;
    editor_info.set(new_editinfo)
  }

</script>
<svelte:window bind:innerWidth bind:outerWidth bind:innerHeight bind:outerHeight />
<main bind:this={root}>
  <div use:watchResize={handleResize} bind:clientWidth={w} bind:clientHeight={h}  id="circularmap" class="main-canvas canvtracker"></div>
  {#if editorinfo.split_window == false}
  <div class="right-side">
    <div class="tooltip">
      
      <div class="icon" on:click={copySequence}>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
      </div>

      <div class="icon" on:click={cutSequence}>
       <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
        </svg>
      </div>

      <div class="icon" on:click={deleteSequence}>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      </div>

      <div class="icon" on:click={showInsert}>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </div>

      <div class="icon" on:click={showNewFeature}>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </div>

      <div class="icon" on:click={showGoto}>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

    </div>
    <div id="sequencemap" class="second-canvas canvtracker"></div>
  </div>
  {/if}

  {#if editorinfo.show_replace == true}
  <div class="whitebg">    
    <div class="replace">
      <h1>Replace</h1>
      <input bind:value={replace_input} type="text" placeholder="Type any codon or sequence here...">
      <div class="buttons">
      <button class="cancel" on:click={stopReplace}>Cancel</button>
      <button class="ok" on:click={handleReplace}>Done</button>
      </div>
    </div>
  </div>
  {/if}


  {#if editorinfo.show_new_feature == true}
  <div class="whitebg">    
    <div class="replace">
      <h1>Name feature</h1>
      <input bind:value={feature_input} type="text" placeholder="Type a name...">
      <div class="buttons">
      <button class="cancel" on:click={stopNewFeature}>Cancel</button>
      <button class="ok" on:click={handleNewFeature}>Done</button>
      </div>
    </div>
  </div>
  {/if}


  {#if editorinfo.show_goto == true}
  <div class="whitebg">    
    <div class="replace">
      <h1>Go to</h1>
      <input bind:value={goto_input} type="text" placeholder="Where do you want to go?">
      <div>
      <button class="cancel" on:click={stopGoto}>Cancel</button>
      <button class="ok" on:click={handleGoto}>Go</button>
      </div>
    </div>
  </div>
  {/if}

  {#if editorinfo.show_insert == true}
    <Insert/>
  {/if}
  <textarea bind:value={copyval} bind:this={textarea} class="copyarea"></textarea>

  {#if editorinfo.show_optimizer == true}
    <Optimizer/>
  {/if}


  <button on:click={openOpti} class="optibutton">Optimize</button>

</main>

<style>
  main {
    width: 100%;
    height: 100%;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .optibutton{
    position: absolute;
    left: calc(25vw - 57.5px);
    top: 90vh;
    /*border:  1px solid black;*/
    border-radius: 20px;
    font-size: 13px;
    z-index: 6;
    padding: 0.25em 0em;
    width: 115px;
    background-color: white;
    color: rgba(0, 0, 0, 0.8);
    border:  none;
    border: 1px solid rgba(51, 51, 51, 0.1);
    cursor: pointer
  }

  .optibutton:hover{
    transform: scale(1.05);
  }

  .copyarea{
    position: absolute;
    left:  -100vh;
    right:  -100vw;
    z-index: -1;
    display:  hidden;
  }

  .whitebg{
    display:  flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 99.5%;
    height:  70%;
    background-color: rgba(255, 255, 255, 0.7);
    z-index: 3;
  }

  .replace{
    display:  flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width:  500px;
    height:  200px;
    background-color: white;
    box-shadow: 0px 0px 10px rgba(51, 51, 51, 0.3);
    border-radius: 5px;
  }

  .replace h1{
    font-size: 19px;
    margin-bottom: 1em;
  }

  .replace input{
    padding:  0.5em 0.5em  0.5em 2em;
    border-radius: 5px;
    border:  1px solid rgba(51, 51, 51, 0.3);
  }

  .replace button{
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

  .main-canvas{
    width: 100%;
    width:  50vw !important;
    height: 100%;
  }

  .second-canvas{
    width:  100%;
    width:  50vw !important;
    height:  85vh !important;
  }

  .right-side{
    display: flex;
    flex-direction: column;
  }

  .tooltip{
    width:  100%;
    height:  15vh;
    /*margin-bottom: -5%;*/
    display:  flex;
    flex-direction: row;
    align-items: center;
    z-index: 2;
  }

  .icon{
    width:  25px;
    height:  25px;
    cursor:  pointer;
    opacity: 0.7;
    margin-left: 2em;
  }

  .icon:hover{
    opacity: 1;
  }

</style>
