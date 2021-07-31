<script>
    import p5 from "../../p5.min";
    import {CircularMap} from "./CircularMap";
    let w;
    let h;

let s = (p5) => {

    let CM = new CircularMap(p5, "", w,h);
    
    p5.setup = () => {
        p5.createCanvas(w, h);
    }; 

    p5.draw = () => {
        p5.resizeCanvas(w, h);
        p5.background(255);

        CM.draw();
    };

    // reset board when mouse is pressed
    p5.mousePressed = () => {
    };

};

	import { onMount } from "svelte";

	onMount(function() {
	  let x = new p5(s, "plassketch");
	});

</script>
<main id="plassketch" bind:clientWidth={w} bind:clientHeight={h}>
  
</main>
<style>

    main{
        width: inherit;
        height: inherit;
        background-color: white;
    }

</style>