const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d')

class Vertex{
    constructor(x,y){
        this.x = x
        this.y = y
    }
}
class Vector{
    constructor(x,y){
        this.x = x
        this.y = y
    }
}

function onResize(){
    fitCanvasToWindow()
    currentPlayer.movePlayerToLastRelativePos()
}

function fitCanvasToWindow(){
    canvas.width = innerWidth
    canvas.height = innerHeight
}

function drawCircle(pos,radius,color) {
    c.beginPath()
    c.arc(pos.x,pos.y,radius,0,Math.PI *2, false)
    c.fillStyle = color
    c.fill()
}

class Player {

    constructor(pos,radius,color, vel, speed){
        this.pos = pos
        this.xr = pos.x/canvas.width
        this.yr = pos.y/canvas.height
        this.radius = radius
        this.color = color
        this.vel = vel
        this.speed = speed
    }

    drawPlayer(pos) {
        c.beginPath()
        c.arc(pos.x,pos.y,this.radius,0,Math.PI *2, false)
        c.fillStyle = this.color
        c.fill()
    }
    movePlayerToLastRelativePos(){
        this.pos.x = this.xr * canvas.width
        this.pos.y = this.yr * canvas.height
        this.xr = this.pos.x/canvas.width
        this.yr = this.pos.y/canvas.height
        this.drawPlayer(this.pos)
    }
    applyFriction(){
        const dx = this.vel.x
        const dy = this.vel.y
        const c = dx*dx + dy*dy
        if(friction*friction>c){
            this.vel = {x:0,y:0}
        }
        else if(dx!=0  || dy !=0){
            const a = friction/Math.sqrt(c)
            const fx = dx*a
            const fy = dy*a
            this.vel = {x:this.vel.x - fx,y:this.vel.y -fy}
        }

    }
    detectColission(){
        
        
        
        if(this.pos.x<0){
            drawCircle(this.pos,this.radius+1,"white")
            this.pos.x = this.pos.x + canvas.width
        }
        else if(this.pos.x>canvas.width){
            drawCircle(this.pos,this.radius+1,"white")
            this.pos.x = this.pos.x - canvas.width
        }
        if(this.pos.y<0){
            drawCircle(this.pos,this.radius+1,"white")
            this.pos.y = this.pos.y + canvas.height
        }
        else if(this.pos.y>canvas.height){
            drawCircle(this.pos,this.radius+1,"white")
            this.pos.y = this.pos.y - canvas.height
        }
        
    }
    updatePos(){
        drawCircle(this.pos,this.radius+1,"white")
        this.detectColission()
        this.pos = {x: this.pos.x +this.vel.x, y:this.pos.y -this.vel.y }
        this.xr = this.pos.x/canvas.width
        this.yr = this.pos.y/canvas.height
        this.applyFriction()
        this.drawPlayer(this.pos)
        //console.log(this.pos)
    }
}

class PlayerController{
    
    constructor(player){
        this.self = this
        this.player = player
        this.lMB = false
        this.cursorPos = {x: innerWidth/2, y: innerHeight/2}

        window.addEventListener("mousedown", this.mouseDownHandler, false)
        window.addEventListener("mouseup", this.mouseUpHandler, false)
        window.addEventListener("mousemove", this.getCursorPosition, false)
    }

    getCursorPosition(e) {
        const rect = canvas.getBoundingClientRect(e)
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        self.cursorPos = {x:x,y:y}
    }
    
    mouseDownHandler(){
        //nie mam pojęcia czemu to działa nagle pomocy
        self.lMB = true
    }
    mouseUpHandler(){
        self.lMB = false
    }
    followMouse(){
        
        if(self.lMB==true){
            //chcemy żeby nasze wektory sumowały się do speed w kierunku wskaźnika
            const dx = this.player.pos.x - self.cursorPos.x
            const dy = this.player.pos.y - self.cursorPos.y
            const c = Math.sqrt(dx*dx + dy*dy)
            const a = speed/c
            const newX =a*dx
            const newY =a*dy
            this.player.vel = {x: this.player.vel.x - newX,y: this.player.vel.y + newY}
        }
    }
}


fitCanvasToWindow()
//create player pbject that interacts with onresize
const friction = 0.5 //pixels per frame
const speed = 2 //can get x pixels per frame faster
const maxVel = 10
var startingPosVertex = new Vertex(innerWidth/2, innerHeight/2)
const currentPlayer = new Player(startingPosVertex, 30, "blue", {x:0,y:0}, speed)
const currentController = new PlayerController(currentPlayer);
window.addEventListener("resize", onResize, false)
currentController.player.drawPlayer(startingPosVertex)



function animate(){
    requestAnimationFrame(animate)

    currentController.player.updatePos()
    currentController.player.detectColission()
    currentController.followMouse()

}

animate()