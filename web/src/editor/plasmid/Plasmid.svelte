<script>
    import p5 from "../../p5.min";
    let w;
    let h;

let sketch = function(p5) {

	  p5.setup = () => {
	    p5.createCanvas(w, h);
	  };
    
      let draw_plasmid_circle = () =>{
        p5.push()
        p5.stroke(121)
        p5.strokeWeight(3)
        p5.circle(w/2, h/2, (h-((h/2))));    
        p5.pop()
      }
    
	  p5.draw = () => {
        p5.resizeCanvas(w, h);
	    p5.background(255);

        draw_plasmid_circle()

	  };

	  // reset board when mouse is pressed
	  p5.mousePressed = () => {
	  };

	};

	import { onMount } from "svelte";

	onMount(function() {
	  let x = new p5(sketch, "plassketch");
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