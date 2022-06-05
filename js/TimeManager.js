export class TimeManager{
    constructor(){
        this.t0 = Date.now();
        this.t1 = Date.now();
        this.fpsArr = [0,0,0];
        
    }
    timeDelta(){
        this.t1 = Date.now();
        const dt = (this.t1-this.t0)/16.66;
        let fps = Math.floor(1000/(this.t1-this.t0))
        this.t0=this.t1;
        this.fpsArr[0] = this.fpsArr[1];
        this.fpsArr[1] = this.fpsArr[2];
        this.fpsArr[2] = fps;
        fps = Math.floor((this.fpsArr[0]+this.fpsArr[1]+this.fpsArr[2])/3)
        return({dt:dt,fps:fps});
    }
}