/*GeneAMA (Gene Ask Me Anything)

    This file does serveral things:

    1. Manages state of the current gene
    2. Parses gene 
    3. Locates primers etc
*/


let plasmid = {};
let self;

export class GeneAMA{

    constructor(plasmid_json){
        plasmid = JSON.parse(plasmid_json)
        self = this;
        // console.log(plasmid)
    }


    static getJSON(){
        return plasmid_json;
    }

    static loadNewData(data){
        plasmid = JSON.parse(data);
    }

    static getFeatures(){
        return plasmid.Features;
    }

    static getSequence(){
        return plasmid.DNA;
    }

    static getName(){
        return plasmid.Keywords;
    }

}