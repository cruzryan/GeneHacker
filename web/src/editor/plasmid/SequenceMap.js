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

    renderUnit(x,y,sequence, seq_start){
        
        let unit_w = w-(w/10);
        let unit_h = h/4;

        let real_x = x;
        let real_y = y + (unit_h - (unit_h/10));

        p5.push()

        //Draw separator line
        p5.stroke("#BFBFBF")
        p5.strokeWeight(1)
        p5.line(real_x*1.5, real_y, unit_w, real_y)

        p5.fill("#636363")
        let last_pos_drawn = 0;
        //Draw inverse sequence
        p5.strokeWeight(0.5)
        p5.fill(176)
        p5.textAlign(p5.CENTER);
        p5.textSize(12)
        for(let i = 0; i < sequence.length; i++){
            let k = (real_x*1.5) + (i*10) + 5
            if(k > unit_w){ last_pos_drawn = seq_start + i; break; }
            p5.text(sequence[i], k, real_y-12)
        }
        //Draw regular sequence
        p5.fill(0)
        for(let i = 0; i < sequence.length; i++){
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
        for(let i = 0; i < sequence.length; i++){
            
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