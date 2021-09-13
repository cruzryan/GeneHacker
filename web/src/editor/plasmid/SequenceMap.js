import { GeneAMA } from "../GeneAMA";
import { CircularMap } from "./CircularMap";

let p5, w, h;
//The sequence position to start drawing from
let sp = 0;
let n_rendered = 0;

//Maximum aminoacids shown per line
let maxamino = 0;

//Cursor stuff
let lastClicked = {x: null, y: null}

let cursor_info = {
    unit: null,
    pos: null
} 

//We use these later to delete / copy / paste aminoacids 
let markers_info = {
    m1: null,
    m2: null,
    //0 = no markers, 1 = one marker, 2 = two markers
    num_shown: 0,
}

export class SequenceMap {

    constructor(ctx, width, height){
        p5 = ctx;
        w = width;
        h = height;
    }

    //When we want to draw again
    static loop(){
        p5.loop()
    }

    static resize(newWidth, newHeight){
        w = newWidth;
        h = newHeight;
    }


    static goToFeature(feature_name){
        let ft = GeneAMA.getFeatures();
        for(let i = 0; i < ft.length; i++){
            if(ft[i].label == feature_name){
                sp = ft[i].start-1;
                p5.loop()
                return;
            }
        }
    }

    static moveCursor(dir){
        console.log("moving cursor!")
        if(dir == "right"){
            cursor_info.pos++;
        }else{
            cursor_info.pos--;
        }
    }

    static addMarker(){
        switch(markers_info.num_shown){
            case 0: {
                markers_info.m1 = sp+(maxamino*cursor_info.unit)+cursor_info.pos;
                markers_info.num_shown = 1;
            } break;

            case 1: {
                markers_info.m2 = sp+(maxamino*cursor_info.unit)+cursor_info.pos;
                markers_info.num_shown = 2;
            }break;

            case 2: {
                markers_info = {
                    m1: null,
                    m2: null,
                    num_shown: 0,
                }

                CircularMap.clearSelection()
            }
        }

        //Stop showing cursor
        cursor_info = {
            unit: null,
            pos: null
        } 
        p5.loop()
    } 

    static updateMarkers(m1, m2){
        markers_info.m1 = m1;
        markers_info.m2 = m2;
        markers_info.num_shown = 2;
        this.goto(m1, false)
    }

    static goto(pos, moveCursor){
        for(let i = 0; i < GeneAMA.getSequence().length; i+=maxamino){
            if(i > pos){
                sp = i - maxamino;
                if(moveCursor === true){
                    cursor_info.unit = 0;
                    cursor_info.pos = pos - sp;    
                }
                return;
            }
        }
    }

    static clearMarkers(){
        markers_info.m1 = null;
        markers_info.m2 = null;
        markers_info.num_shown = 0;
        p5.loop()
    }


    static getSelected(){
        let start = markers_info.m1;
        let end = markers_info.m2;
        return [start, end]
    }

    static getNumberOfMarkers(){
        return markers_info.num_shown;
    }

    mouseClicked(e){

        //Check if user clicked on the letters
        cursor_info.unit = this.hitboxCheck()
        if(cursor_info.unit != -1){
            cursor_info.pos = this.mouse_to_sequence(cursor_info.unit)
        }

    }

    scroll(dir){
        let seq = GeneAMA.getSequence()

        switch(dir){
            case "up":
                    if (sp - maxamino > 0){
                        sp -= maxamino;
                        p5.loop()
                    }else{
                        sp = 0;
                        p5.loop()
                    } 
 
            break;

            case "down":
                if (sp+(maxamino*n_rendered) > seq.length) return;
                sp += maxamino;
                p5.loop()
            break;  
        }
    }
    
    calculate_sequence_width(sequence, x){
        return (x*1.5) + ((sequence.length-1)*10) + 5 ;
    }

    get_amino_inverse(amino){
        switch(amino){
            case "a": return "t";
            case "t": return "a";
            case "g": return "c";
            case "c": return "g";
            default: console.warn("Couldn't get inverse aminoacid")
        }
    }


    //Since codons need 3 aminoacids, we need to display the maximum multiple of 3 of aminoacids given
    maxAminoacidsShown(sequence){
        // return Math.floor(sequence.length/3)*3;
        return sequence.length;
    } 

    getCodon(amino_seq){
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

    getCodonColor(codon){
        switch(codon){
            case "I": return "#FFE0E0";
            case "R": return "#ffc4d6";
            case "L": return "#ffac81";
            case "N": return "#eae4e9";
            case "K": return "#fff1e6";
            case "D": return "#fde2e4";
            case "M": return "#eeddd3";
            case "F": return "#e2ece9";
            case "C": return "#bee1e6";
            case "P": return "#f0efeb";
            case "Q": return "#dfe7fd";
            case "S": return "#cddafd";
            case "E": return "#BAE394";
            case "T": return "#a8e6cf";
            case "W": return "#cddcdf";
            case "G": return "#b8c0ff";
            case "Y": return "#4B8CA8";
            case "H": return "#71A7CD";
            case "V": return "#dfe7fd";
            case "A": return "#EFD581";
            case "X": return "#f08080";
            case "0": return "#fff";
        }
    }

    getMaxAminosPerLine(sequence){

        let x = 0;
        let y = 0;

        let unit_w = w-(w/10);
        let unit_h = h/4;

        let real_x = x;
        let real_y = y + (unit_h - (unit_h/10));
        let maxAminoacids = this.maxAminoacidsShown(sequence); 


        for(let i = 0; i < maxAminoacids; i++){
            let k = (real_x*1.5) + (i*10) + 5
            if(k > unit_w+15){ return  i; }
        }
    }

    featureListContainsCDS(fl){
        for(let i = 0; i < fl.length; i++){
            if (fl[i].Kind === "CDS"){
                return [true, i];

            }
        }
        return [false, -1];
    }

    renderUnit(x,y,sequence, seq_start, feature_data, index){
        
        let unit_w = w-(w/10);
        let unit_h = h/4;

        let real_x = x;
        let real_y = y + (unit_h - (unit_h/10));
        let maxAminoacids = this.maxAminoacidsShown(sequence); 

        n_rendered++;

        p5.push()
        //Draw separator line
        p5.strokeWeight(2)
        p5.line(real_x*1.5, real_y, unit_w+15, real_y)

        p5.textFont("Poppins")
        p5.fill("#636363")
        let last_pos_drawn = 0;
        //Draw inverse sequence
        p5.strokeWeight(0.5)
        p5.fill(120)
        p5.textAlign(p5.CENTER);
        p5.textSize(12)
        for(let i = 0; i < maxAminoacids; i++){
            let k = (real_x*1.5) + (i*10) + 5
            if(seq_start + i >= sequence.length) break;
            if(k > unit_w+15){ last_pos_drawn = seq_start + i; break; }
            p5.text(this.get_amino_inverse(sequence[seq_start+i]), k, real_y-12)
        }
        //Draw regular sequence
        p5.fill(0)
        for(let i = 0; i < maxAminoacids; i++){
            let k = (real_x*1.5) + (i*10) + 5
            if(k > unit_w+15) break;
            p5.text(sequence[seq_start+i], k, real_y-30)
            
            //Draw character position lines + numbers
            if(i % 10 == 0) {
                let pos = (real_x*1.5) + ((i+1)*10) + 5;
                p5.line(real_x+pos,real_y,real_x+pos,real_y+10)
                p5.text((seq_start+i+2).toString(),real_x+pos, real_y+22)
            }
        }
        p5.noStroke()
        //Draw codons
        for(let i = 0; i < maxAminoacids; i+=3){
            let k = (real_x*1.5) + (i*10)

            //Draw end of sequence if its the end 
            if(seq_start + i >= sequence.length){
                p5.fill(230)
                p5.rect(k,real_y-61,3, 60)
                break;
            }

            //TO-DO: Fix this so it renders the right codons LOL 
            let [isCDS, index] = this.featureListContainsCDS(feature_data)

            if(isCDS){
                if(k > unit_w) break;
                let codon = this.getCodon(sequence[seq_start+i]+sequence[seq_start+i+1]+sequence[seq_start+i+2])
                p5.fill(parseInt(codon[0]))
                let color = this.getCodonColor(codon)
                p5.fill(color)
                p5.rect(k+1,real_y-60,30,15);
                p5.fill(12)
                p5.text(codon, k+15, real_y-48)
            }            
        }

        //Draw highlighted genes & markers
        if(markers_info.num_shown != 0){
            // console.log(markers_info)
            for(let i = 0; i < maxAminoacids; i++){
                let k = (real_x*1.5) + (i*10)
                if(k > unit_w) break;

                if(markers_info.num_shown > 0 && seq_start+i == markers_info.m1){
                    //Drawing the cursor
                    p5.fill("#4479FF")
                    p5.stroke("#4479FF")
                    p5.rect(k,real_y, 1,-45)
                    p5.triangle(k-3,real_y-45, k+4, real_y-45, k+1, real_y-40)
            
                    //Drawing the square with the position
                    p5.fill(255)
                    p5.stroke(220)
                    p5.rect(k-19, real_y+2, 40, 20, 20)
                    p5.fill(0)
                    p5.textSize(9)
                    p5.textAlign(p5.CENTER)
                    p5.text(markers_info.m1.toString(), k+1, real_y+15)
                }

                if(seq_start+i == markers_info.m2){
                    //Drawing the cursor
                    p5.fill("#4479FF")
                    p5.stroke("#4479FF")
                    p5.rect(k,real_y, 1,-45)
                    p5.triangle(k-3,real_y-45, k+4, real_y-45, k+1, real_y-40)
            
                    //Drawing the square with the position
                    p5.fill(255)
                    p5.stroke(220)
                    p5.rect(k-19, real_y+2, 40, 20, 20)
                    p5.fill(0)
                    p5.textSize(9)
                    p5.textAlign(p5.CENTER)
                    p5.text(markers_info.m2.toString(), k+1, real_y+15)
                }

                p5.noStroke()
                if(markers_info.num_shown == 2){
                    if(seq_start+i >= markers_info.m1 && seq_start+i < markers_info.m2){
                        p5.fill(68, 121, 255, 23)
                        p5.rect(k+1,real_y-40,10,39);
                    }    
                }
            }       
        }

        if(feature_data.length == 0){
            p5.noStroke()
            p5.fill("#00e676")
            p5.rect(real_x,real_y-80, unit_w-10, 12, 20, 0,0,20);
            p5.triangle(unit_w-10, real_y-80+12, unit_w-10, real_y-80, unit_w, real_y-80+6)
            p5.fill("#fff")
            p5.stroke("#fff")
            p5.textSize(11)
            p5.text("source", real_x+80, real_y-80+10)
        }

        //Draw feature titles 
        for(let k = 0; k < feature_data.length; k++){
            let f = feature_data[k];
            let y = real_y-80 - (k*20);

            p5.noStroke()

            let direction = f.direction === undefined? "right" : "left";

            if(direction === "right"){
                p5.fill("#4479FF")
                p5.rect(real_x,y, unit_w-10, 12, 20, 0,0,20);
                p5.triangle(unit_w-10, y+12, unit_w-10, y, unit_w, y+6)
            }else{
                p5.fill("#89ACFF");
                p5.rect(real_x+15,y, unit_w, 12, 0, 20, 20, 0);
                p5.triangle(real_x+15, y, real_x+15, y+12, real_x, y+6)
            }

            p5.fill("#fff")
            p5.stroke("#fff")
            p5.textSize(11)
            p5.text(f.label, real_x+80, y+10)
        }

        p5.pop()
        return last_pos_drawn;
    }

    render_units(){
        let sequence = GeneAMA.getSequence()
        maxamino = this.getMaxAminosPerLine(sequence);
        for(let i = 0; i < 10; i++){
            let maxsize = (i*150 + ((h/4) - ((h/4)/10))) + 150 > h
            if(maxsize) break;
            let pos = i*maxamino;
            n_rendered = i;
            let ft = GeneAMA.getFeatureDataFromPosition(sp+(pos)); 
            let new_sp = this.renderUnit(0, i*150, sequence, sp+(pos), ft, i)
        } 
    }

    hitboxCheck(){
        let unit_w = w-(w/10);
        let unit_h = h/4;
        let sequence = GeneAMA.getSequence()

        let bx = -1; 

        for(let i = 0; i < 10; i++){
            let maxsize = (i*150 + ((h/4) - ((h/4)/10))) + 150 > h
            if(maxsize) break;

            let mx = p5.mouseX;
            let my = p5.mouseY;

            if(mx > 0 && mx < unit_w+15 && my > (i*150)+(2*unit_h/3.5)){
                bx = i;
            }
        } 

        return bx;
    }

    mouse_to_sequence(unit){
        let mx = p5.mouseX;
        let my = p5.mouseY;

        let y = unit*150;
        let real_x = 0;
        let unit_h = h/4;
        let real_y = y + (unit_h - (unit_h/10));

        for(let i = 0; i < maxamino; i++){
            let k = (real_x*1.5) + (i*10) + 5
            if(mx > k-5 && mx < k+5){
                return i;
            }
        }
    } 

    drawCursor(unit, pos, dynamic_sp, color){

        //If nothing has ben clicked, don't draw a cursor
        if(unit == null || pos == null){
            return;
        }

        //This decided when and when not to show the cursor
        let pos_map = (sp+(maxamino*unit)+pos);
        if(dynamic_sp != null && pos_map != dynamic_sp+(maxamino*unit)+pos){
            return;
        }

        if(pos_map < 0 || pos_map < sp){
            return;
        }

        let unit_h = h/4;
        let real_y = unit*150 + (unit_h - (unit_h/10));
        let k = (pos*10) + 5

        p5.push()
        //Drawing the cursor
        p5.fill(color)
        p5.stroke(color)
        p5.rect(k-6,real_y, 1,-45)
        p5.triangle(k-9,real_y-45, k-2, real_y-45, k-5, real_y-40)

        //Drawing the square with the position
        p5.fill(255)
        p5.stroke(220)
        p5.rect(k-25, real_y+2, 40, 20, 20)
        p5.fill(0)
        p5.textSize(9)
        p5.textAlign(p5.CENTER)
        p5.noStroke()
        p5.text(pos_map.toString(), k-5, real_y+15)
        p5.pop()
    }
    draw(){
        this.render_units()
        this.drawCursor(cursor_info.unit, cursor_info.pos, null, "#000");
    }

}