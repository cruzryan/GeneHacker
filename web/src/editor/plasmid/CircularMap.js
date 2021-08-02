
let self, p5, gbk, w, h, r, plasmid_name;

let sequence = "ACCAACAAAAAACACACCCACACACAC";
let c_x = 0;
let c_y = 0;

let number_of_clicks = 0;

let showSelection = true;
let selectionCords = {
    p1: {
        x: 0,
        y: 0,
    },

    p2: {
        x: 0,
        y: 0,
    }
}


export class CircularMap {

    constructor(ctx, dna, width, height) {
        self = this;
        p5 = ctx;
        gbk = dna;
        w = width;
        h = height;


        //Circle center
        c_x = w / 2;
        c_y = h / 2;
        r = (h - ((h / 2)));

        //Plasmid setup
        plasmid_name = "pMDC32"
    }


    static updateSequence(newSequence) {
        sequence = newSequence;
    }


    mouseClicked(e) {

        if (number_of_clicks == 0) {
            selectionCords.p1.x = e.x;
            selectionCords.p1.y = e.y;
            showSelection = true;
        }

        if (number_of_clicks == 1) {
            selectionCords.p2.x = e.x;
            selectionCords.p2.y = e.y;
        }

        if (number_of_clicks >= 2) {
            number_of_clicks = 0;
            selectionCords = {
                p1: {
                    x: 0,
                    y: 0,
                },

                p2: {
                    x: 0,
                    y: 0,
                }
            }
        } else {
            number_of_clicks++;
        }

    }

    base_to_angle(number) {
        return Math.floor(p5.map(number, 0, sequence.length, 0, 360, true));
    }

    angle_to_base(angle) {
        return Math.floor(p5.map(angle, 0, 360, 0, sequence.length, true));
    }


    draw_arrow(start_bp_num, end_bp_num, direction, text, level) {
        let s_angle = this.base_to_angle(start_bp_num);
        let e_angle = this.base_to_angle(end_bp_num);

        let start_angle;
        let end_angle;

        //To specify which level the arrow should go to 
        let minR =  40 + (level * 50);
         
        let maxR;

        if(level == 0){
            maxR =  70 + (level * 70);
        }else{
            maxR =  70 + (level * 70) - (20*level);
        }

        //Length of the arrow
        if (direction == "right") {
            start_angle = s_angle - 90;
            end_angle = e_angle - 95;
        } else {
            start_angle = s_angle - 90;
            end_angle = e_angle - 90;
        }
        let rl = -r / 2;

        // Draw the Triangle (Arrow's tip)
        p5.push()
        p5.translate(c_x, c_y);
        p5.stroke(255, 255, 255, 0)
        p5.fill(255, 229, 199)
        p5.strokeWeight(2)

        let mink = 40;
        let maxk = 70 + (level * 70) - (9 - (level * 4));

        if (direction == "right") {
            p5.rotate(Math.floor(e_angle))
            p5.triangle(0, Math.round(rl + (mink / 3)) + Math.round((maxk / 3)) - 5, -10 + (2*level), rl + (maxk / 3), -16, rl + (maxk / 3) +16 + (2*level))
            p5.stroke(210, 110, 99)
            p5.line(0, Math.round(rl + (mink / 3)) + Math.round((maxk / 3)) - 5 , -10 + (2*level), rl + (maxk / 3))
            p5.line(0, Math.round(rl + (mink / 3)) + Math.round((maxk / 3)) - 5 , -10, rl + (maxk / 3) +16 + (2*level))
        } else {


            p5.rotate(s_angle)
            p5.triangle(0, Math.round(rl + (mink / 3)) + Math.round((maxk / 3)) +2, -10, rl + (maxk / 3)+7, 0, Math.round(rl + (mink / 3)) + Math.round((maxk / 3)) -13, -10, rl + (maxk / 3)+7, 0,0 )
            p5.stroke(210, 110, 99)
            p5.line(0, Math.round(rl + (mink / 3)) + Math.round((maxk / 3)) +2, -10, rl + (maxk / 3)+7)
            p5.line(0, Math.round(rl + (mink / 3)) + Math.round((maxk / 3)) -13, -10, rl + (maxk / 3)+7)
        }

        p5.pop()


        //Draw un Arc
        p5.push()
        

        p5.translate(c_x,c_y);
        p5.rotate(start_angle)
        p5.fill(255, 229, 199)
        p5.stroke(210, 110, 99)
        //Draw inner arc (with color)
        p5.strokeWeight(2)
        p5.arc(0, 0, r - minR, r - minR, 0, end_angle - start_angle);
        //Draw outter arc (white)
        p5.fill(255)
        p5.arc(0, 0, r - maxR, r - maxR, 0, end_angle - start_angle);
        p5.pop()

        //Draw the arrow's base line 
        p5.push()
        p5.stroke(210, 110, 99)
        p5.strokeWeight(2)
        p5.translate(c_x, c_y);

        //Draw line
        if (direction == "left") {
            p5.rotate(Math.floor(e_angle))
        } else {
            p5.rotate(Math.floor(s_angle))
        }
        p5.line(0, Math.round(rl + (mink / 3)) + Math.round((maxk / 3))+1, 0, rl + (maxk / 3))
        p5.pop()

    }


    draw_scale_rects() {
        let r_height = 6;
        let r_width = 2;
        //TO-DO: Fix so it adds every 500 bp, not every 1/5th of sequence length
        for (let i = 0; i < sequence.length; i += Math.floor(sequence.length / 4)) {

            p5.push();
            p5.translate(c_x, c_y);
            p5.angleMode(p5.DEGREES);
            p5.rotate(this.base_to_angle(i));

            //If it's the origin, display a big marker
            p5.noStroke();
            if (i == 0) {
                p5.fill(50)
                p5.rect(0, -(c_y / 2), 3, 10);
            } else {
                p5.fill(121)
                p5.rect(0, -(c_y / 2), r_width, r_height);
            }

            //If it's the origin, don't display text
            if (i == 0) {
                p5.pop();
                continue;
            }
            p5.fill(77);
            p5.textFont('Verdana');
            p5.textSize(12);
            let bp_str = Math.round(i).toString();
            p5.text(bp_str, -(bp_str.length * 12) + 3, -(c_y / 2) + 4, 30, 100)
            p5.pop();
        }
    }

    drawSelectionLine(base, vec, myColor) {
        p5.push();
        p5.stroke(myColor);
        p5.strokeWeight(3);
        p5.fill(myColor);
        p5.translate(base.x, base.y);
        p5.line(0, 0, vec.x, vec.y);
        p5.rotate(vec.heading());
        let arrowSize = 7;
        p5.translate(vec.mag() + arrowSize + 3, 0);
        p5.triangle(0, (arrowSize / 2), 0, -arrowSize / 2, arrowSize - 15, 0);
        p5.pop();
    }

    drawFilledArc(start_angle, end_angle) {
        //Draw Filled Arc
        p5.push()
        p5.translate(c_x, c_y);
        p5.rotate(start_angle)
        p5.fill(255, 229, 199, 100)
        p5.stroke(210, 110, 99)
        p5.strokeWeight(3)
        p5.arc(0, 0, r, r, 0, end_angle - start_angle);
        p5.pop()
    }

    draw_selection() {

        if (showSelection == false) return;


        let v1 = p5.createVector(c_x, c_y);

        let first_point_exists = selectionCords.p1.x != 0 && selectionCords.p1.y != 0;
        let second_point_exists = selectionCords.p2.x != 0 && selectionCords.p2.y != 0;

        //If first point is already selected
        if (first_point_exists && !second_point_exists) {

            p5.push()

            //Draw Ghost selection line that follows mouse
            let ghostVec = p5.createVector(p5.mouseX - c_x, p5.mouseY - c_y).normalize().mult((c_y / 2));
            this.drawSelectionLine(v1, ghostVec, '#eaeaea')

            //Draw real selection line for the first point
            let fp = p5.createVector(selectionCords.p1.x - c_x, selectionCords.p1.y - c_y).normalize().mult((c_y / 2));
            this.drawSelectionLine(v1, fp, '#000')

            p5.pop()

            this.drawFilledArc(fp.heading(), ghostVec.heading());

        }

        if (second_point_exists) {
            //Draw Ghost selection line that follows mouse
            let fp = p5.createVector(selectionCords.p1.x - c_x, selectionCords.p1.y - c_y).normalize().mult((c_y / 2));
            this.drawSelectionLine(v1, fp, '#000')

            //Draw real selection line for the first point
            let sp = p5.createVector(selectionCords.p2.x - c_x, selectionCords.p2.y - c_y).normalize().mult((c_y / 2));
            this.drawSelectionLine(v1, sp, '#000')

            this.drawFilledArc(fp.heading(), sp.heading());

        }

    }

    draw_circle() {
        p5.push()
        p5.stroke(121)
        p5.strokeWeight(3)
        p5.circle(c_x, c_y, r);
        p5.pop()
    }

    draw_plasmid_name() {
        p5.push()
        p5.translate(c_x, c_y);


        p5.noStroke();
        p5.fill('white')
        p5.circle(0, 0, (c_y / 3))
        p5.fill('#131313')
        p5.textFont('Verdana');
        p5.textStyle(p5.BOLD);
        p5.textSize(12)
        p5.textAlign(p5.CENTER)
        p5.text(plasmid_name, -(plasmid_name.length / 2) * 12, -7, (plasmid_name.length) * 12, 14)

        let bp_len = (sequence.length.toString() + " bp").length;
        p5.textStyle(p5.NORMAL);
        p5.fill("#838383")
        p5.text(sequence.length.toString() + " bp", -(bp_len / 2) * 12, 12, (bp_len) * 12, 14)

        p5.pop();
    }

    draw() {
        this.draw_circle();
        this.draw_scale_rects();

        this.draw_arrow(6, 24, "right", "HygR", 0);
        this.draw_arrow(12, 18, "right", "HygR",1);
        this.draw_arrow(18, 24, "right", "HygR",2);

        this.draw_selection();
        this.draw_plasmid_name();
    }


}