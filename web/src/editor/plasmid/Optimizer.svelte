<script>

let yeast_hz_str = `
UUU 25.9(118900)  |UCU 23.6(108308)  |UAU 18.7( 85651)  |UGU  8.0( 36624)
UUC 18.3( 83880)  |UCC 14.3( 65421)  |UAC 14.7( 67599)  |UGC  4.6( 21255)
UUA 26.3(120698)  |UCA 18.7( 85618)  |UAA  1.0(  4476)  |UGA  0.6(  2742)
UUG 27.2(124967)  |UCG  8.5( 39137)  |UAG  0.4(  2058)  |UGG 10.4( 47694)

|CUU 12.1( 55578)  |CCU 13.6( 62239)  |CAU 13.7( 62778)  |CGU  6.5( 29889)
|CUC  5.3( 24356)  |CCC  6.8( 31159)  |CAC  7.9( 36091)  |CGC  2.6( 11745)
|CUA 13.4( 61295)  |CCA 18.3( 84043)  |CAA 27.6(126408)  |CGA  3.0( 13696)
|CUG 10.4( 47502)  |CCG  5.3( 24197)  |CAG 12.1( 55674)  |CGG  1.7(  7817)

|AUU 30.2(138594)  |ACU 20.3( 93201)  |AAU 35.8(163988)  |AGU 14.1( 64654)
|AUC 17.2( 78930)  |ACC 12.6( 57989)  |AAC 25.0(114583)  |AGC  9.6( 43963)
|AUA 17.6( 80793)  |ACA 17.8( 81436)  |AAA 41.9(192152)  |AGA 21.3( 97775)
|AUG 20.9( 95777)  |ACG  8.0( 36487)  |AAG 30.8(141373)  |AGG  9.2( 42079)

|GUU 22.1(101373)  |GCU 21.3( 97801)  |GAU 37.8(173483) |GGU 24.2(111169)
|GUC 11.7( 53607)  |GCC 12.7( 58177)  |GAC 20.4( 93454) |GGC  9.7( 44449)
|GUA 11.7( 53529)  |GCA 16.2( 74272)  |GAA 45.9(210641) |GGA 10.8( 49693)
|GUG 10.6( 48745)  |GCG  6.1( 28165)  |GAG 19.0( 87277) |GGG  5.9( 27160)
`;

function getCodon(amino_seq){
        let aminos = amino_seq.toUpperCase().replace(/T/g,"U");
        if ("GCU, GCC, GCA, GCG ".includes(aminos)) return "A";
        if ("AUU, AUC, AUA".includes(aminos)) return "I";
        if ("CGU, CGC, CGA, CGG; AGA, AGG".includes(aminos)) return "R";
        if ("CUU, CUC, CUA, CUG; UUA, UUG".includes(aminos)) return "L";
        if ("AAU, AAC".includes(aminos)) return "N";
        if ("AAA, AAG".includes(aminos)) return "K";
        if ("GAU, GAC".includes(aminos)) return "D";
        if ("AUG".includes(aminos)) return "M";
        if ("UUU, UUC".includes(aminos)) return "F";
        if ("UGU, UGC".includes(aminos)) return "C";
        if ("CCU, CCC, CCA, CCG".includes(aminos)) return "P";
        if ("CAA, CAG".includes(aminos)) return "Q";
        if ("UCU, UCC, UCA, UCG; AGU, AGC".includes(aminos)) return "S";
        if ("GAA, GAG".includes(aminos)) return "E";
        if ("ACU, ACC, ACA, ACG".includes(aminos)) return "T";
        if ("UGG".includes(aminos)) return "W";
        if ("GGU, GGC, GGA, GGG".includes(aminos)) return "G";
        if ("UAU, UAC".includes(aminos)) return "Y";
        if ("CAU, CAC".includes(aminos)) return "H";
        if ("GUU, GUC, GUA, GUG".includes(aminos)) return "V";
        if ("UAA, UGA, UAG".includes(aminos)) return "X";

        return "0";
}

function inArray(codon, seq){
	for(let i = 0; i < seq.length; i++){
		if(seq[i].codon == codon) return true;
	}
	return false;
}

// {codon: "S", seq: ""}
let yeast_hz = [];

function parse(str_uncleaned){

	let str = str_uncleaned.replace(/\n/g,"").split("|");
	// console.log(str)
	let parsed = [];

	mainLoop:
	for(let i = 0; i < str.length; i++){
		let u = str[i];

		let hz_str = "";
		u_searcher:
		for(let k = 3; k < u.length; k++){
			if(u[k] == "(") break u_searcher;
			hz_str += u[k];
		}

		let amino = u.slice(0,3); 
		let codon = getCodon(amino);
		let hz = parseFloat(hz_str);

		if(!inArray(codon, parsed)){
			parsed.push({ codon, amino, hz });
			continue mainLoop;
		}

		for(let n = 0; n < parsed.length; n++){
			let c = parsed[n].codon;
			if(c == codon){
				if(parsed[n].hz < hz){
					parsed[n].hz = hz;
					parsed[n].amino = amino;

				}
				break;
			}
		}
	}

	return parsed;
}

let totalReplaced = 0;
function optimized(name, seq, optilist){
	for(let i = 0; i < optilist.length; i++){
		if(optilist[i].codon == name){
			if(seq != optilist[i].amino){
				totalReplaced++;
				return optilist[i].amino.toLowerCase().replace(/u/g,"t"); 
			}
		}
	}
	return seq;
}

function optimizeSequence(sequence, p){
	let ns = sequence;
	for(let i = 0; i < sequence.length; i+=3){
		let c = sequence[i] + sequence[i + 1] + sequence[i + 2];
		let codon = getCodon(c);
		let opti = optimized(codon,c,p); 
		if(c != opti){
			ns = ns.substring(0, i) + opti + ns.substring(i+3);	
		}
	}
	return ns;
}

import { editor_info } from "../../store";

 let editorinfo;

 editor_info.subscribe(value => {
	editorinfo = value;
 });

import { onMount, onDestroy } from "svelte";
let showReplaced = false;
let selected = 0;

onMount(() => {
	yeast_hz = parse(yeast_hz_str)
})

onDestroy(() => {
	totalReplaced = 0;
	showReplaced = false;
	selected = 0;
})


function cancel(){
	let new_editinfo = editorinfo;
    new_editinfo.show_optimizer = false;
    new_editinfo.screen_on_top_showing = false;
    editor_info.set(new_editinfo)
}

import {GeneAMA} from "../GeneAMA";

function optimizeAll(){
	let sq = GeneAMA.getSequence()
	let ft = GeneAMA.getFeatures()
	showReplaced = true;

	ft.forEach(f => {
		if(f.Kind == "CDS"){
			console.log("ORINGINAL SEQ: ", sq.length);
			let cds = sq.substring(f.start, f.end)
			let ns = optimizeSequence(cds, yeast_hz)
			sq = sq.substring(0, f.start) + ns + sq.substring(f.end);	
			console.log("NEW SEQ: ", sq.length);

		}
	})

	GeneAMA.updateSequence(sq);
}

function select(e){
	selected = e;
}

</script>

<main>
		{#if showReplaced == false}
		<div class="container">
			<h1>Optimize for</h1>

			<h2 class={selected == 1? "selected" : ""} on:click={() =>select(1)}>Escherichia coli</h2>
			<h2 class={selected == 2? "selected" : ""} on:click={() =>select(2)}>Saccharomyces cerevisiae</h2>
			<h2 class={selected == 3? "selected" : ""} on:click={() =>select(3)}>Human</h2>

			<div class="buttons">
				<button on:click={cancel}>Cancel</button>
				<button on:click={optimizeAll} class="opti">Optimize</button>
			</div> 
		</div>
		{:else if showReplaced == true}
		<div class="container">
			<h1>Optimized! 🥳🎉🎉</h1>
			<h3>We've replaced {totalReplaced} codons!</h3>
			<button on:click={cancel}>Close</button>
		</div>
		{/if}

</main>

<style>

main { 
	position: absolute;
	z-index:  10;
	display:  flex;
	align-items: center;
	justify-content: center;
	width:  100vw;
	height: 80vh;
	background-color:rgba(255,255,255,0.7);
	/*background-color: red;*/
	overflow: hidden;
}

h3 {
	font-weight: 500;
}
	
.container{
	width:  300px;
	height:  auto;
	margin-top: -10vh;
	background-color: white;
    box-shadow: 0px 0px 5px rgba(151, 151, 151, 0.3);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    border-radius: 10px;
}

.buttons{
	display:  flex;
	flex-direction: row;
	width:  90%;
	justify-content: center;
	align-items: center;
}


.selected{
	background-color: #4479FF;
	color:  white;
}

h1{
	font-size: 19px;
	margin: 1em;
}
 
h2{
	width: 60%;
	padding: 0.25em;
    border: 1px solid rgba(151, 151, 151, 0.3);
    font-size: 15px;
    font-weight: 500;
    border-radius: 5px;
    margin-bottom: 1em;
    cursor:  pointer;

}

button{
	padding:  0.25em 1em;
	border:  1px solid rgba(151, 151, 151, 0.3);	
	border-radius: 15px;
	background-color: white;
	cursor: pointer;
	margin: 1em;
}

.opti:hover{
	background-color: #4479FF;
	color:  white;
}

</style>