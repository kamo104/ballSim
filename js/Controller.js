import { variables } from "./variables.js"
import { distance } from "./Math.js"

export class PlayerController{

    constructor(player,pointerFollow){
        this.self = this
        this.player = player
        this.lMB = false
        this.cursorPos = {x: innerWidth/2, y: innerHeight/2}
        this.followPointer = pointerFollow;
    }
    addControll() {
        canvas.addEventListener("pointerdown", this.pointerDownHandle, false);
        canvas.addEventListener("pointerup", this.pointerUpHandle, false)
        canvas.addEventListener("pointermove", this.pointerMoveHandle, false)
        canvas.addEventListener("pointerleave", this.pointerLeaveHandle, false)
    }
    addPlayerControll(player){
        this.player = player;
    }
    removeControll() {
        canvas.removeEventListener("pointerdown",this.pointerDownHandle,false);
        canvas.removeEventListener("pointerup", this.pointerUpHandle, false)
        canvas.removeEventListener("pointermove", this.pointerMoveHandle, false)
        canvas.removeEventListener("pointerleave", this.pointerLeaveHandle, false)
    }
    pointerLeaveHandle(e) {
        self.lMB = false
    }
    pointerMoveHandle(e) {
        self.cursorPos = {x:e.offsetX,y:e.offsetY}
    }
    pointerUpHandle(e) {
        self.cursorPos = {x:e.offsetX,y:e.offsetY}
        self.lMB = false
    }
    pointerDownHandle(e) {
        self.cursorPos = {x:e.offsetX,y:e.offsetY}
        self.lMB = true
    }
    FollowPointer(){
        self.followPointer = 1;
    }
    DoNotFollowPointer(){
        self.followPointer = 0;
    }
    accelerateToPoint(point,targetMass,dt){
        const dx = point.x - this.player.pos.x 
        const dy = point.y - this.player.pos.y
        // distance from one point to another
        const dist = Math.sqrt(dx*dx + dy*dy);
        const distSq = dist*dist
        // our acceleration
        // F = G*m1*m2/R^2 , F = m1*a => a = G*m2/R^2

        const accel = targetMass*variables.G*dt/distSq // distSq
        // console.log(accel,targetMass,variables.G,dt,distSq)
        // const accel = targetMass*dt;
        const accelSq = accel*accel;
        // the a coefficient of the straight passing through the both points 
        var a = 0;

        // new velocity values
        var newX=0;
        var newY=0;

        if(dx===0&&dy===0)return;
        else if(dx===0&&dy!==0){
            a=Infinity;
            newY = accel;
        }
        else if(dy===0&&dx!==0){
            a=0;
            newX = accel
        }
        else{
            // y = ax + b
            // a = dy/dx
            // create a velocity vector with length of character.speed coefficient a and from player.pos to point
            // (newX,newY) 2. newX*newX+newY*newY=speed^2, 1. newY/newX = a, 3. newY>0 if pos.y-point.y>0 else newY<0, 4. newX>0 if pos.x-point.x>0 else newX<0
            // 1. newY = a*newX, 
            // 2. newX*newX + (a*newX)*(a*newX) = speed^2 => |newX| = sqrt(speed^2/(1+a^2))
            
            a=dy/dx
            const absNewX = Math.sqrt(accelSq/(1+a*a)); 
            dx > 0 ? newX = absNewX : newX = -absNewX;
            newY = a*newX;

        }
        //debug
        // add the new velocities

        this.player.vel = {x: this.player.vel.x + newX,y: this.player.vel.y + newY};
    }
    followMouse(cursorPos,dt){
        if(self.lMB==true){
            this.accelerateToPoint(cursorPos,variables.cursorMass,dt);
        }
    }
    followPlayer(player1,dt){
        this.accelerateToPoint(player1.pos,player1.mass,dt);
        
    }
    applyFriction(dt, friction){
        const dx = this.player.vel.x
        const dy = this.player.vel.y
        const hypotSquared = dx*dx + dy*dy;
        const hypot = Math.sqrt(hypotSquared);
        const resultingHypot = hypot-friction*dt;
        const ratio = resultingHypot/hypot;

        if(hypot===0) return;
        if(ratio<=0){
            this.player.vel = {x:0,y:0};
            return;
        }
        else{
            
            this.player.vel = {x:this.player.vel.x*ratio,y:this.player.vel.y*ratio};

        }
        
        // else if((dx!==0  || dy !==0) && cSquared!==0){
        //     const a = friction/c;
        //     const fx = dx*a;
        //     const fy = dy*a;
        //     this.player.vel = {x:this.player.vel.x - fx,y:this.player.vel.y -fy};
        // }

    }
    detectWallCollision(type){
        //detecting collision with wall and moving the player to the opposite wall in case
        switch(type){
            case(1):{
                if(this.player.pos.x-this.player.radius<0){
                    this.player.superPosition = true;
                    this.player.pos.x = this.player.pos.x%canvas.width + canvas.width
                }
                else if(this.player.pos.x>canvas.width){
                    this.player.superPosition = true;
                    this.player.pos.x = this.player.pos.x%canvas.width
                }
                else if(this.player.pos.x+this.player.radius>canvas.width){
                    this.player.superPosition = true;
                    this.player.pos.x = this.player.pos.x%canvas.width - canvas.width
                }
                if(this.player.pos.y-this.player.radius<0){
                    this.player.superPosition = true;
                    this.player.pos.y = this.player.pos.y%canvas.height + canvas.height
                }
                else if(this.player.pos.y>canvas.height){
                    this.player.superPosition = true;
                    this.player.pos.y = this.player.pos.y%canvas.height
                }
                else if(this.player.pos.y+this.player.radius>canvas.height){
                    this.player.superPosition = true;
                    this.player.pos.y = this.player.pos.y%canvas.height - canvas.height
                }
                break;
            }
            case(2):{
                if(this.player.pos.x-this.player.radius<0){
                    this.player.pos.x = this.player.radius
                    this.player.vel = {x:-this.player.vel.x,y:this.player.vel.y}
                }
                else if(this.player.pos.x+this.player.radius>canvas.width){
                    this.player.pos.x = canvas.width-this.player.radius
                    this.player.vel = {x:-this.player.vel.x,y:this.player.vel.y}
                }
                if(this.player.pos.y-this.player.radius<0){
                    this.player.pos.y = this.player.radius
                    this.player.vel = {y:-this.player.vel.y,x:this.player.vel.x}
                }
                else if(this.player.pos.y+this.player.radius>canvas.height){
                    this.player.pos.y = canvas.height-this.player.radius
                    this.player.vel = {y:-this.player.vel.y,x:this.player.vel.x}
                }
                break;
            }
        }
    }
    capToMaxSpeed(){
        // check if we can go that fast and scale down the vel vector if not
        const velocityHypot = Math.hypot(this.player.vel.x,this.player.vel.y);
        const ratio=velocityHypot/this.player.maxVel;

        if(ratio>1){
            this.player.vel.y /= ratio;
            this.player.vel.x /= ratio;
        }
    }
    applyPhysicsStep(dt, collisionType, friction){
        if(this.followPointer){this.followMouse(self.cursorPos,dt)}
        


        this.capToMaxSpeed();

        this.applyFriction(dt, friction);


        //apply delta position due to velocity
        const newPos = {x: this.player.pos.x + dt*this.player.vel.x, y:this.player.pos.y + dt*this.player.vel.y };

        var toDelete=[];
        // Array(variables.controllerArr)
        for(var i=0;i<variables.controllerArr.length;i++){
            if(variables.controllerArr[i]==this) {
                continue;
            }

            const p2 = variables.controllerArr[i].player;
            const dist = distance(newPos,p2.pos);
            
            if(dist<=p2.radius+this.player.radius){
                // console.log(dist,p2.radius+this.player.radius)
                // MERGE
                toDelete.push(variables.controllerArr[i]);
                // (vel1*m1 + vel2*m2)/(m1+m2) = newVel; for x and y respectively
                const newRadius = Math.pow(Math.pow(this.player.radius,3)+Math.pow(p2.radius,3),1/3);
                const newMass = this.player.mass+p2.mass;
                const newVel = {
                    x:(this.player.vel.x*this.player.mass+p2.vel.x*p2.mass)/newMass,
                    y:(this.player.vel.y*this.player.mass+p2.vel.y*p2.mass)/newMass
                }
                this.player.vel = newVel;
                this.player.mass = newMass;
                this.player.radius = newRadius;
            }
        }
        // console.log(toDelete)
        var newArr = [];
        var doNotAdd = false;
        for(var i=0;i<variables.controllerArr.length;i++){
            doNotAdd=false;
            for(var j=0;j<toDelete.length;j++){
                if(toDelete[j]==variables.controllerArr[i]){
                    doNotAdd =true;
                }
            }
            if(doNotAdd)continue;
            else newArr.push(variables.controllerArr[i]);
        }
        variables.controllerArr = newArr;
        // variables.controllerArr = variables.controllerArr.filter((val,index)=>{
        //     if (index in toDelete) return false;
        //     else return true;
        // });
        



        this.player.pos = newPos


        this.player.preWallCollsionPos = structuredClone(this.player.pos);
        this.detectWallCollision(collisionType)
    }
    
    updatePlayerPos(dt){
        this.applyPhysicsStep(dt, variables.collisionType, this.player.friction)
        
        // this.player.drawPlayer(this.player.pos)
        
    }
}