<script>
  import { CircularMap } from "./CircularMap";
  import { SequenceMap } from "./SequenceMap";
  import { editor_info } from "../../store";
  
  import { watchResize } from "svelte-watch-resize";

  let editorinfo;

  editor_info.subscribe(value => {
		editorinfo = value;
	});

  let w;
  let h;

  function handleResize(node){
    CircularMap.resize(w,h);
    SequenceMap.resize(w,h);
  }

  function getLowestVal(v1, v2) {
    let v = v1 > v2 ? v1 : v2; 
    return v;
  }

  let k;
  document.onkeypress = function (event) {
    let char = typeof event !== "undefined" ? event.keyCode : event.which;
    k = String.fromCharCode(char);

    if(k == "s"){
        CircularMap.activateSelection();
    }

    if(char == '39'){
        SequenceMap.moveCursor("right");
    }

    if(char == '37'){
        SequenceMap.moveCursor("left");
    }
    console.log(char)

    // p5.loop()
  };

  /*---------------- Circular Map -------------------------- */

  let circularmap = (p5) => {
    let CM = new CircularMap(p5, getLowestVal(w, h), getLowestVal(w, h));

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
      CM.mouseClicked(e);
      p5.loop()
    };

  };

  /*---------------- Sequence Map -------------------------- */


  let sequencemap = (p5) => {
    let SM = new SequenceMap(p5, getLowestVal(w, h), getLowestVal(w, h))

    p5.setup = () => {
      let sz = getLowestVal(w, h);
      p5.createCanvas(sz, sz);
      // p5.textFont("Oxygen");
      // p5.noLoop()
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
      // p5.resizeCanvas(getLowestVal(w, h), getLowestVal(w, h));
      SM.mouseClicked(e);
      p5.loop()
    };

    p5.mouseWheel = (e) => {
      let dir = e.delta < 0? "up" : "down";
      SM.scroll(dir)
    }

  }

  import { onMount } from "svelte";

  onMount(function () {
    let cm = new p5(circularmap, "circularmap");

    if(editorinfo.split_window === false){
      let sm = new p5(sequencemap, "sequencemap");
    }

  });
</script>

<main>
  <div  use:watchResize={handleResize} bind:clientWidth={w} bind:clientHeight={h}  id="circularmap" class="main-canvas"></div>
  {#if editorinfo.split_window == false}
  <div class="right-side">
    <div class="tooltip">
      
      <div class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
      </div>

      <div class="icon">
       <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
        </svg>
      </div>

      <div class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      </div>

      <div class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </div>

      <div class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

    </div>
    <div id="sequencemap" class="second-canvas"></div>
  </div>
  {/if}
</main>

<style>
  main {
    width: 100%;
    height: 100%;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;

  }

  .main-canvas{
    width: 100%;
    height: 100%;
  }

  .second-canvas{
    width:  100%;
    height:  100%;
  }

  .right-side{
    display: flex;
    flex-direction: column;
  }

  .tooltip{
    width:  100%;
    height:  10vh;
    margin-top: 15vh;
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
    opacity: 0.8;
    margin-left: 2em;
  }

  .icon:hover{
    opacity: 1;
  }

</style>
