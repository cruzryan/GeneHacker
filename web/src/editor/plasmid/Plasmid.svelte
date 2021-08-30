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
    p5.loop()
  };

  /*---------------- Circular Map -------------------------- */

  let circularmap = (p5) => {
    let CM = new CircularMap(p5, getLowestVal(w, h), getLowestVal(w, h));

    p5.setup = () => {
      let sz = getLowestVal(w, h);
      p5.createCanvas(sz, sz);
      p5.noLoop()
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
      p5.noLoop()
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
      // SM.mouseClicked(e);
      p5.loop()
    };


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
    <div id="sequencemap" class="main-canvas"></div>
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

</style>
