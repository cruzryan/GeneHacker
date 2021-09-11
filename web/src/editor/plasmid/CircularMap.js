import { GeneAMA } from "../GeneAMA";
import { SequenceMap } from "./SequenceMap";

let self, p5, w, h, r, plasmid_name;

let sequence = "ACAAA";
let c_x = 0;
let c_y = 0;

let number_of_clicks = 0;

let showSelection = false;
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

//To control arrow layers
let allArrows = []

// {start: x, end: y}
let lvl0 = []
let lvl1 = []
let lvl2 = []

let highlighted_feature = "";


export class CircularMap {

    constructor(ctx, width, height) {
        self = this;
        p5 = ctx;
        w = width/2;
        h = height/2;

        sequence = GeneAMA.getSequence()

        //Circle center
        c_x = w / 2;
        c_y = h / 2;
        r = (h - ((h / 2)));

        //Plasmid setup
        plasmid_name = GeneAMA.getName()

        this.calculateArrows()
    }


    static updateSequence(newSequence) {
        sequence = newSequence;
    }

    //To toggle plasmid selection
    static activateSelection() {
        showSelection = !showSelection;
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
        p5.loop();
    }

    static resize(newWidth, newHeight) {
        w = newWidth
        h = newHeight
        //Recalculate sizes please bro
        c_x = w / 2;
        c_y = h / 2;
        r = (h - ((h / 2)));
    }

    handleSelection() {
        if (number_of_clicks == 0) {
            selectionCords.p1.x = p5.mouseX;
            selectionCords.p1.y = p5.mouseY;
        }

        if (number_of_clicks == 1) {
            selectionCords.p2.x = p5.mouseX;
            selectionCords.p2.y = p5.mouseY;

            let b1 = this.angle_to_base(this.point_to_angle(selectionCords.p1.x, selectionCords.p1.y));
            let b2 = this.angle_to_base(this.point_to_angle(selectionCords.p2.x, selectionCords.p2.y))

        }

        if (number_of_clicks <= 2) {
            number_of_clicks++;
        }
    }


    featureClicked(e){
        for (let i = 0; i < allArrows.length; i++) {
            let arrow = allArrows[i];

            let level = arrow.level;
            let minR = 40 + (level * 50);
            let rl = -r / 2;

            let maxR;

            if (level == 0) {
                maxR = 70 + (level * 70);
            } else {
                maxR = 70 + (level * 70) - (20 * level);
            }

            let lessThanMinR = p5.dist(c_x, c_y, p5.mouseX, p5.mouseY) < (r-minR)/2 
            let lessThanMaxR = p5.dist(c_x, c_y, p5.mouseX, p5.mouseY) > (r-maxR)/2
            
            if(lessThanMinR && lessThanMaxR){

                let angleLessThanEnd = this.point_to_angle(p5.mouseX, p5.mouseY) < this.base_to_angle(arrow.end);
                let angleBiggerThanStart = this.point_to_angle(p5.mouseX, p5.mouseY) > this.base_to_angle(arrow.start);
                if(angleBiggerThanStart && angleLessThanEnd){
                    return arrow.label;
                }
            }
        }
        return "";
    }

    mouseClicked(e) {
        if (showSelection) {
            this.handleSelection()
        }else{
            highlighted_feature = this.featureClicked();
            if(highlighted_feature.length !== 0){
                SequenceMap.goToFeature(highlighted_feature)
            }
        }
    }

    rad_to_ang(rad) {
        return (rad * 180) / Math.PI
    }

    base_to_angle(number) {
        return Math.floor(p5.map(number, 0, sequence.length, 0, 360, true));
    }

    angle_to_base(angle) {
        return Math.floor(p5.map(angle, 0, 360, 0, sequence.length, true));
    }


    point_to_angle(x, y) {
        //Getting the angle of the individual vectors
        let ang = this.rad_to_ang(Math.atan2(y - c_y, x - c_x)) + 90

        //Since we're adding 90, our current range is from -90 to 270. We use this "if" to convert it back to the 0-360 range
        if (ang < 0) {
            return (ang + 360)
        }

        return ang;
    }



    draw_arrow(start_bp_num, end_bp_num, direction, text, level, color) {
        let s_angle = this.base_to_angle(start_bp_num);
        let e_angle = this.base_to_angle(end_bp_num);

        if (e_angle - s_angle < 5) return;

        let start_angle;
        let end_angle;

        //How transparent should the fill be (in hex) (0-F)
        let stroke_color;
        let fill_color;

        switch (color) {
            case 0:
                //#fab ?
                stroke_color = "#8B64BA";
                fill_color = "#D7C7EB";
                break;

            case 1:
                stroke_color = "#DBB083";
                fill_color = "#F8DEC1";
                break;

            case 2:
                stroke_color = "#59BACC";
                fill_color = "#AAE4EF";
                break;

            case 3:
                stroke_color = "#589BE8";
                fill_color = "#83b9ff";
                break;


            case 4:
                stroke_color = "#DBDB36";
                fill_color = "#ffffb3";
                break;
        }

        //When you click it, the stroke of the arrow should change
        if(highlighted_feature != text){
            stroke_color = fill_color
        }

        //To specify which level the arrow should go to 
        let minR = 40 + (level * 50);

        let maxR;

        if (level == 0) {
            maxR = 70 + (level * 70);
        } else {
            maxR = 70 + (level * 70) - (20 * level);
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
        p5.fill(fill_color)
        p5.strokeWeight(2)

        let mink = 40;
        let maxk = 70 + (level * 70) - (9 - (level * 4));

        if (direction == "right") {
            p5.rotate(Math.floor(e_angle))
            p5.triangle(0, Math.round(rl + (mink / 3)) + Math.round((maxk / 3)) - 5, (-12) + (2 * level), rl + (maxk / 3), -12, rl + (maxk / 3) + 16 + (2 * level))
            // p5.triangle(0, Math.round(rl + (mink / 3)) + Math.round((maxk / 3)) - 5, -10 + (2 * level), rl + (maxk / 3),rl + (maxk / 3) + 16 + (2 * level),  )
            p5.stroke(stroke_color)
            p5.line(0, Math.round(rl + (mink / 3)) + Math.round((maxk / 3)) - 5, -10 + (2 * level), rl + (maxk / 3))
            p5.line(0, Math.round(rl + (mink / 3)) + Math.round((maxk / 3)) - 5, -10, rl + (maxk / 3) + 16 + (2 * level))

        } else {
            p5.rotate(s_angle)
            p5.triangle(0, Math.round(rl + (mink / 3)) + Math.round((maxk / 3)) + 2, -10, rl + (maxk / 3) + 7, 0, Math.round(rl + (mink / 3)) + Math.round((maxk / 3)) - 13, -10, rl + (maxk / 3) + 7, 0, 0)
            p5.stroke(stroke_color)
            p5.line(0, Math.round(rl + (mink / 3)) + Math.round((maxk / 3)) + 2, -10, rl + (maxk / 3) + 7)
            p5.line(0, Math.round(rl + (mink / 3)) + Math.round((maxk / 3)) - 13, -10, rl + (maxk / 3) + 7)
        }

        p5.pop()

        //Draw un Arc
        p5.push()
        p5.translate(c_x, c_y);
        p5.rotate(start_angle)
        p5.fill(fill_color)
        p5.stroke(stroke_color)
        //Draw inner arc (with color)
        p5.strokeWeight(2)
        p5.arc(0, 0, r - minR, r - minR, 0, end_angle - start_angle);
        //Draw outter arc (white)
        p5.fill(255)
        p5.arc(0, 0, r - maxR, r - maxR, 0, end_angle - start_angle);
        p5.pop()

        //Draw the arrow's base line 
        p5.push()
        p5.stroke(stroke_color)
        p5.strokeWeight(2)
        p5.translate(c_x, c_y);

        //Draw line
        if (direction == "left") {
            p5.rotate(Math.floor(e_angle))
        } else {
            p5.rotate(Math.floor(s_angle))
        }
        p5.line(0, Math.round(rl + (mink / 3)) + Math.round((maxk / 3)) + 1, 0, rl + (maxk / 3))
        p5.pop()

        //Text
        p5.push();
        p5.translate(c_x, c_y);
        p5.rotate(((e_angle - s_angle) / 2) + s_angle)
        p5.textSize(9)

        //To verify arrow text fits the circunference
        let arc_len = Math.abs(e_angle) + Math.abs(s_angle);
        let calc = (arc_len / 9 / text.length) > 3;
        //If text fits, slow it!
        if (calc) {
            p5.text(text, -(text.length / 4) * 9, Math.round(rl + (mink / 3)) + Math.round((maxk / 3)) - 3)
        }
        p5.pop();


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


        let center_vector = p5.createVector(c_x, c_y);

        let first_point_exists = selectionCords.p1.x != 0 && selectionCords.p1.y != 0;
        let second_point_exists = selectionCords.p2.x != 0 && selectionCords.p2.y != 0;

        if (!second_point_exists) {
            p5.push()
            //Draw Ghost selection line that follows mouse
            let ghostVec = p5.createVector(p5.mouseX - c_x, p5.mouseY - c_y).normalize().mult((c_y / 2));
            this.drawSelectionLine(center_vector, ghostVec, '#eaeaea')
            p5.pop()

        }


        //If first point is already selected
        if (first_point_exists && !second_point_exists) {

            p5.push()
            //Draw Ghost selection line that follows mouse
            let ghostVec = p5.createVector(p5.mouseX - c_x, p5.mouseY - c_y).normalize().mult((c_y / 2));
            this.drawSelectionLine(center_vector, ghostVec, '#eaeaea')
            //Draw real selection line for the first point
            let fp = p5.createVector(selectionCords.p1.x - c_x, selectionCords.p1.y - c_y).normalize().mult((c_y / 2));
            this.drawSelectionLine(center_vector, fp, '#000')
            p5.pop()

            this.drawFilledArc(fp.heading(), ghostVec.heading());

        }

        if (second_point_exists) {
            //Draw Ghost selection line that follows mouse
            let fp = p5.createVector(selectionCords.p1.x - c_x, selectionCords.p1.y - c_y).normalize().mult((c_y / 2));
            this.drawSelectionLine(center_vector, fp, '#000')

            //Draw real selection line for the first point
            let sp = p5.createVector(selectionCords.p2.x - c_x, selectionCords.p2.y - c_y).normalize().mult((c_y / 2));
            this.drawSelectionLine(center_vector, sp, '#000')

            this.drawFilledArc(fp.heading(), sp.heading());
        }
    }

    draw_circle() {
        p5.push()
        if (showSelection) {
            p5.stroke("#000")
        } else {
            p5.stroke(121)
        }
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

    canFitInLevel(start, end, level) {

        let lvl = [];

        switch (level) {
            case 0: lvl = lvl0.slice(); break;
            case 1: lvl = lvl1.slice(); break;
            case 2: lvl = lvl2.slice(); break;
            default: console.warn("Level you tried to get does not exist!")
        }

        if (lvl.length == 0) {
            return true;
        }

        let canBeInLevel = true;
        for (let i = 0; i < lvl.length; lvl++) {
            if (this.collides(lvl[i].start, lvl[i].end, start, end)) {
                canBeInLevel = false;
            }
        }

        return canBeInLevel;

    }

    collides(a, b, c, d) {
        if (c >= a && c <= b) {
            return true;
        }

        if (d >= a && d <= b) {
            return true;
        }
        return false;
    }

    calculateArrows() {
        let features = GeneAMA.getFeatures()

        features.forEach(f => {

            if (f.label == undefined || f.label == "") {
                return
            }

            let arrow = {
                start: f.start,
                end: f.end,
                label: f.label,
                level: 0,
                color: 0,
            }

            if (f.direction != undefined && f.direction != null) {
                arrow.direction = f.direction.toLowerCase()
            } else {
                arrow.direction = "right";
            }

            fitloop:
            for (let k = 0; k < 3; k++) {
                if (this.canFitInLevel(f.start, f.end, k)) {
                    arrow.level = k
                    arrow.color = k
                    switch (k) {
                        case 0: lvl0.push({ start: f.start, end: f.end }); break fitloop;
                        case 1: lvl1.push({ start: f.start, end: f.end }); break fitloop;
                        case 2: lvl2.push({ start: f.start, end: f.end }); break fitloop;
                        default: console.warn("Level index out of range!")
                    }
                }
            }

            allArrows.push(arrow)
        })
    }

    drawAllArrows() {
        let numColors = 5;

        for (let i = 0; i < allArrows.length; i++) {
            let arrow = allArrows[i];
            if (arrow.level == 0) {
                this.draw_arrow(arrow.start, arrow.end, arrow.direction, arrow.label, arrow.level, i % numColors);
            }
        }

        for (let i = 0; i < allArrows.length; i++) {
            let arrow = allArrows[i];
            if (arrow.level == 1) {
                this.draw_arrow(arrow.start, arrow.end, arrow.direction, arrow.label, arrow.level, i % numColors);
            }
        }

        for (let i = 0; i < allArrows.length; i++) {
            let arrow = allArrows[i];
            if (arrow.level == 2) {
                this.draw_arrow(arrow.start, arrow.end, arrow.direction, arrow.label, arrow.level, i % numColors);
            }
        }
    }

    draw() {
        this.draw_circle();
        this.draw_scale_rects();
        this.drawAllArrows();
        this.draw_selection();
        this.draw_plasmid_name();

        let first_point_exists = selectionCords.p1.x != 0 && selectionCords.p1.y != 0;
        let second_point_exists = selectionCords.p2.x != 0 && selectionCords.p2.y != 0;

        if (first_point_exists && second_point_exists){
            p5.noLoop()
        }else{
            if (showSelection == true){
                p5.loop();
            }else{
            p5.noLoop()
            }
        }
    }


}