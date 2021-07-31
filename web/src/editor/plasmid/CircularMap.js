
let self, p5, gbk, w, h, r;

let sequence = "ACCAACAAAAAACACACCCACACACAC";
let c_x = 0;
let c_y = 0;

export class CircularMap {

    constructor(ctx, dna, width, height) {
        self = this;
        p5 = ctx;
        gbk = dna;
        w = width;
        h = height;

        //Circle radius 

        //Circle center
        c_x = w / 2;
        c_y = h / 2;
        r = (h - ((h / 2)));
    }


    static updateSequence(newSequence) {
        sequence = newSequence;
    }

    base_to_angle(number) {
        return p5.map(number, 0, sequence.length, 0, 360);
    }

    x_y_to_base(x,y){
        
    }


    draw_arrow(start, end, content) {

    }


    draw_origin(pos) {

    }

    draw_scale_rects() {
        let r_height = 6;
        let r_width = 2;
        //TO-DO: Fix so it adds every 500 bp, not every 1/5th of sequence length
        for (let i = 0; i < sequence.length; i += (sequence.length / 5)) {

            p5.push();
            p5.translate(c_x, c_y);
            p5.angleMode(p5.DEGREES);
            p5.rotate(this.base_to_angle(i));

            //If it's the origin, display a big marker
            p5.noStroke();
            if(i == 0){
                p5.fill(50)
                p5.rect(0, -(c_y / 2), 3, 10);
            }else{
                p5.fill(121)
                p5.rect(0, -(c_y / 2), r_width, r_height);
            }
            
            //If it's the origin, don't display text
            if(i == 0){
                p5.pop();
                continue;
            }
            p5.fill(77);
            p5.textSize(12);
            let bp_str = Math.round(i).toString(); 
            p5.text(bp_str, -(bp_str.length * 12)+3, -(c_y / 2)+4, 30, 100)
            p5.pop();
        }
    }

    draw_selection(start, end) {
        p5.push()
        p5.translate(c_x, c_y);
        p5.rotate(-90)
        p5.fill(255,229,199,100)
        p5.arc(0, 0, r, r, 0, 90);
        p5.pop()
    }

    draw_circle() {
        p5.push()
        p5.stroke(121)
        p5.strokeWeight(3)
        p5.circle(c_x, c_y, r);
        p5.pop()
    }


    draw() {
        this.draw_circle();
        this.draw_scale_rects();
        this.draw_selection();
    }


}