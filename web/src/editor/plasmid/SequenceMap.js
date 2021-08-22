let p5, w, h;

export class SequenceMap {

    constructor(ctx, width, height){
        p5 = ctx;
        w = width;
        h = height;
    }


    draw(){
        p5.stroke("#000")
        p5.rect(0,0,w/2,h/2)
    }

}