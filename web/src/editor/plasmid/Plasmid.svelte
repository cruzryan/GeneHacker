<script>
    import {CircularMap} from "./CircularMap";
    let w;
    let h;

function getLowestVal(v1, v2){
    return (v1 > v2)? v1 : v2;
}

let s = (p5) => {

    let CM = new CircularMap(p5, "", getLowestVal(w,h),getLowestVal(w,h));
    
    p5.setup = () => {

        let s = getLowestVal(w,h);
        p5.createCanvas(s, s);
    }; 

    p5.draw = () => {
        let s = getLowestVal(w,h);
        p5.resizeCanvas(s, s);
        p5.background(255);

        CM.draw();
    };

    // reset board when mouse is pressed
    p5.mousePressed = (e) => {
        CM.mouseClicked(e);
        console.log(e)
    };

};

	import { onMount } from "svelte";

	onMount(function() {
	  let x = new p5(s, "plassketch");
	});

</script>
<main id="plassketch" bind:clientWidth={w} bind:clientHeight={h} >
  
</main>
<style>

    main{
        width: inherit;
        height: inherit;
        background-color: white;
    }

</style>