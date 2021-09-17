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
        plasmid = Object.assign({}, plasmid_json.data);
        self = this;
        // console.log("PLASMID LOADDED, FEATURE LENGTH: ", plasmid.Features.length)
    }

    static getCurrentState(){
        return plasmid_json;
    }

    static loadNewData(data){
        plasmid = Object.assign({}, data);
    }

    static getFeatures(){
        return [...plasmid.Features]
        // return plasmid.Features;
    }

    static getSequence(){
        return plasmid.DNA
        // return plasmid.DNA;
    }

    static getName(){
        return plasmid.Keywords;
    }

    static updateFeatures(features){
        plasmid.Features = Object.assign({}, features);
    }

    static addFeature(start, end, label){
        let f = {
            Kind: "any",
            note: "",
            start, end, label
        }
        plasmid.Features.push(f);
    }

    static updateSequence(newSequence){
        plasmid.DNA = newSequence;        
    }

    //Returns an array of feature datas;
    static getFeatureDataFromPosition(position){     

        let pos = position+1;
        let fd = []

        let features = plasmid.Features;

        for(let i = 0; i < features.length; i++){

            let feature = features[i];

            if (feature.label === undefined) continue;

            if(pos >= feature.start && pos <= feature.end){
                fd.push(feature)
            }
        }

        return fd;
    }

}