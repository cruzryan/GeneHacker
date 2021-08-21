<script>
  import { CircularMap } from "./CircularMap";
  import { watchResize } from "svelte-watch-resize";
  let w;
  let h;

  function handleResize(node){
    CircularMap.resize(w,h);
  }

  function getLowestVal(v1, v2) {
    return v1 > v2 ? v1 : v2;
  }

  let k;

  document.onkeypress = function (event) {
    let char = typeof event !== "undefined" ? event.keyCode : event.which;
    k = String.fromCharCode(char);

    if(k == "s"){
        CircularMap.activateSelection();
    }
  };

  let s = (p5) => {
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
    };
  };

  import { onMount } from "svelte";

  onMount(function () {
    let x = new p5(s, "plassketch");
  });
</script>

<main>
  <div use:watchResize={handleResize} bind:clientWidth={w} bind:clientHeight={h}  id="plassketch" class="main-canvas"></div>
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
