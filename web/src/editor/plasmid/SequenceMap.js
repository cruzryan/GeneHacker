let p5, w, h;

export class SequenceMap {

    constructor(ctx, width, height){
        p5 = ctx;
        w = width;
        h = height;
    }


    static resize(newWidth, newHeight){
        w = newWidth;
        h = newHeight;
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
        return Math.floor(sequence.length/3)*3;
    }

    getCodon(amino_seq){
        let aminos = amino_seq.toUpperCase().replace("T","U");
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
        return "X";
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
            case "X": return "#f08080";
        }
    }

    renderUnit(x,y,sequence, seq_start){
        
        let unit_w = w-(w/10);
        let unit_h = h/4;

        let real_x = x;
        let real_y = y + (unit_h - (unit_h/10));
        let maxAminoacids = this.maxAminoacidsShown(sequence); 
        console.log(sequence.length)

        p5.push()
        //Draw separator line
        p5.strokeWeight(1)
        p5.line(real_x*1.5, real_y, unit_w, real_y)
        p5.noStroke()

        p5.fill("#636363")
        let last_pos_drawn = 0;
        //Draw inverse sequence
        p5.strokeWeight(0.5)
        p5.fill(120)
        p5.textAlign(p5.CENTER);
        p5.textSize(12)
        for(let i = 0; i < maxAminoacids; i++){
            let k = (real_x*1.5) + (i*10) + 5
            if(k > unit_w){ last_pos_drawn = seq_start + i; break; }
            p5.text(sequence[i], k, real_y-12)
        }
        //Draw regular sequence
        p5.fill(0)
        for(let i = 0; i < maxAminoacids; i++){
            let k = (real_x*1.5) + (i*10) + 5
            if(k > unit_w) break;
            p5.text(this.get_amino_inverse(sequence[i]), k, real_y-30)
            
            //Draw character position lines + numbers
            if(i % 10 == 0) {
                let pos = (real_x*1.5) + ((i+1)*10) + 5;
                p5.line(real_x+pos,real_y,real_x+pos,real_y+10)
                p5.text((seq_start+i+1).toString(),real_x+pos, real_y+22)
            }
        }

        //Draw codons
        for(let i = 0; i < maxAminoacids; i+=3){
            let k = (real_x*1.5) + (i*10)
            if(k > unit_w) break;
            let codon = this.getCodon(sequence[i]+sequence[i+1]+sequence[i+2])
            p5.fill(parseInt(codon[0]))
            let color = this.getCodonColor(codon)
            p5.fill(color)
            // p5.noStroke()
            p5.rect(k+1,real_y-60,30,15);
            p5.fill(12)
            p5.text(codon, k+15, real_y-48)
        }

        p5.pop()
        return last_pos_drawn;
    }


    recursive_unit_rendering(){

    }

    draw(){

        this.renderUnit(0,0, "tgatggacgacaccgtcagtgcgtccgtcgcgcaggctctcgatgagctgatgctttggg", 841);

    }

}