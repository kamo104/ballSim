export class PlayerController{
    
    constructor(player){
        this.self = this
        this.player = player
        this.lMB = false
        this.cursorPos = {x: innerWidth/2, y: innerHeight/2}
    }
    addControll(player) {
        this.player = player;
        canvas.addEventListener("pointerdown", this.pointerDownHandle, false);
        canvas.addEventListener("pointerup", this.pointerUpHandle, false)
        canvas.addEventListener("pointermove", this.pointerMoveHandle, false)
    }
    removeControll() {
        canvas.removeEventListener("pointerdown",this.pointerDownHandle,false);
        canvas.removeEventListener("pointerup", this.pointerUpHandle, false)
        canvas.removeEventListener("pointermove", this.pointerMoveHandle, false)
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
    followMouse(){
        if(self.lMB==true){
            //chcemy żeby nasze wektory sumowały się do speed w kierunku wskaźnika
            const dx = this.player.pos.x - self.cursorPos.x
            const dy = this.player.pos.y - self.cursorPos.y
            var c = Math.sqrt(dx*dx + dy*dy)
            if(c!=0){
                const a = this.player.speed/c
                const newX =a*dx
                const newY =a*dy
                //c= c*c
                //added over distance between them squared
                //nvmd it slowed things too much
                this.player.vel = {x: this.player.vel.x - newX,y: this.player.vel.y + newY}
                if(Math.hypot(this.player.vel.x,this.player.vel.y)>this.player.maxVel){
                    this.player.vel = {x: this.player.vel.x + newX,y: this.player.vel.y - newY}
                }
            }
        }
    }
    followPlayer(player1){
        
            //chcemy żeby nasze wektory sumowały się do speed w kierunku wskaźnika
            const dx = this.player.pos.x - player1.pos.x
            const dy = this.player.pos.y - player1.pos.y
            const c = Math.sqrt(dx*dx + dy*dy)
            var a =0;
            if(c!=0){
                a = this.player.speed/c
            }
            
            const newX =a*dx
            const newY =a*dy
            
            this.player.vel = {x: this.player.vel.x - newX,y: this.player.vel.y + newY}
            //subtract new added speed if it went over max speed
            if(Math.hypot(this.player.vel.x,this.player.vel.y)>this.player.maxVel){
                this.player.vel = {x: this.player.vel.x + newX,y: this.player.vel.y - newY}
            }
        
    }
    applyFriction(friction){
        const dx = this.player.vel.x
        const dy = this.player.vel.y
        const c = dx*dx + dy*dy
        if(friction*friction>c){
            this.player.vel = {x:0,y:0}
        }
        else if(dx!=0  || dy !=0){
            const a = friction/Math.sqrt(c)
            const fx = dx*a
            const fy = dy*a
            this.player.vel = {x:this.player.vel.x - fx,y:this.player.vel.y -fy}
        }

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
    applyPhysicsStep(collisionType,friction){
        //apply delta position due to velocity
        this.player.pos = {x: this.player.pos.x +this.player.vel.x, y:this.player.pos.y -this.player.vel.y }
        
        this.applyFriction(friction)
        this.player.preCollsionPos = structuredClone(this.player.pos);
        this.detectWallCollision(collisionType)
    }
    
    updatePlayerPos(collisionType,friction){
        this.applyPhysicsStep(collisionType,friction)
        
        this.player.drawPlayer(this.player.pos)
        
    }
}