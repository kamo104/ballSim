export class Player {

    constructor(drawingCtx, pos,radius,color, vel, speed, maxVel, mass, friction){
        this.ctx = drawingCtx

        this.pos = pos
        this.preWallCollsionPos = pos

        this.radius = radius
        this.color = color
        this.vel = vel
        this.speed = speed
        this.maxVel = maxVel
        this.mass = mass
        this.superPosition = false;
        this.friction = friction;
    }

    drawPlayer(pos) {
        if(this.superPosition){
            this.superPosition = false;
            this.ctx.beginPath()
            this.ctx.arc(this.preWallCollsionPos.x,this.preWallCollsionPos.y,this.radius,0,Math.PI *2, false)
            this.ctx.fillStyle = this.color
            this.ctx.fill()
        }
        this.ctx.beginPath()
        this.ctx.arc(pos.x,pos.y,this.radius,0,Math.PI *2, false)
        this.ctx.fillStyle = this.color
        this.ctx.fill()
    }
}