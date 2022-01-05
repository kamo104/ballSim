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
    updatePos(){
        drawCircle(this.pos,this.radius+1,"white")
        this.pos = {x: this.pos.x +this.vel.x, y:this.pos.y -this.vel.y }
        this.xr = this.pos.x/canvas.width
        this.yr = this.pos.y/canvas.height
        if(this.vel.x>0){this.vel.x -=friction;}
        else if(this.vel.x<0){this.vel.x +=friction;}
        if(this.vel.y>0){this.vel.y -=friction;}
        else if(this.vel.y<0){this.vel.y +=friction;}
        this.drawPlayer(this.pos)
        //console.log(this.pos)
    }
}

class Projectile {
    constructor(x,y,radius,color, vel){
        this.x = x
        this.y =y
        this.radius = radius
        this.color = color
        this.vel = vel
    }
    drawProjectile() {
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI *2, false)
        c.fillStyle = this.color
        c.fill()
    }
}

class PlayerController{
    
    constructor(){
        this.LMB = false
        this.cursorPos = {x: innerWidth/2, y: innerHeight/2}
        window.addEventListener("keypress", this.keyPressHandler, false)
        window.addEventListener("mousedown", this.mouseDownHandler, false)
        window.addEventListener("mouseup", this.mouseUpHandler, false)
        window.addEventListener("mousemove", this.getCursorPosition, false)
    }

    getCursorPosition(e) {
        const rect = canvas.getBoundingClientRect(e)
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        currentController.cursorPos = {x:x, y:y}
    }
    keyPressHandler(event){
        
        if(event.key=="w"){
            currentPlayer.vel.y +=currentPlayer.speed
        }
        else if(event.key=="s"){
            currentPlayer.vel.y -=currentPlayer.speed
        }
        else if(event.key=="a"){
            currentPlayer.vel.x -=currentPlayer.speed
        }
        else if(event.key=="d"){
            currentPlayer.vel.x +=currentPlayer.speed
        }
    }
    mouseDownHandler(){
        currentController.LMB = true
    }
    mouseUpHandler(){
        currentController.LMB = false
    }
    
}

function followMouse(){
    if(currentController.LMB==true){
        var newX =0
        var newY =0
        //chcemy żeby nasze wektory sumowały się do speed w kierunku wskaźnika
        const dx = currentPlayer.pos.x - currentController.cursorPos.x
        const dy = currentPlayer.pos.y - currentController.cursorPos.y
        const c = Math.sqrt(dx*dx + dy*dy)
        const a = speed/c
        newX = a*dx
        newY = a*dy
        currentPlayer.vel = {x: currentPlayer.vel.x - newX,y: currentPlayer.vel.y + newY}
    }
}


fitCanvasToWindow()
//create player pbject that interacts with onresize
const friction = 0.5
const speed = 5
const maxSpeed = 10
var startingPosVertex = new Vertex(innerWidth/2, innerHeight/2)
const currentPlayer = new Player(startingPosVertex, 30, "blue", {x:0,y:0}, speed)
const currentController = new PlayerController();
window.addEventListener("resize", onResize, false)
currentPlayer.drawPlayer(startingPosVertex)

function animate(){
    requestAnimationFrame(animate)

    currentPlayer.updatePos()
    //console.log(currentController.cursorPos)
    followMouse()
    
}

animate()