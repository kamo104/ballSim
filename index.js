var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d')

var ui = document.getElementById("UIBar")

const walls = document.getElementById("wallsCheckbox")

const speedSlider = document.getElementById("ballSpeed")

const frictionSlider = document.getElementById("friction")

const accelSlider = document.getElementById("acceleration")
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
function refreshCanvas(){
    c.fillStyle = "black"
    c.fillRect(0,0,canvas.width,canvas.height)
}
function onResize(){

    ui.style.height = window.innerHeight/10
    ui.style.width = canvas.parentElement.clientWidth
    fitCanvasToWindow()


}

function fitCanvasToWindow(){
    ui.style.height = window.innerHeight/10
    ui.style.width = canvas.parentElement.clientWidth
    canvas.width = canvas.parentElement.clientWidth
    if(ui.hidden == false){canvas.height = window.innerHeight - parseFloat(ui.style.height)}
    else{canvas.height = window.innerHeight}
}

function drawCircle(pos,radius,color) {
    c.beginPath()
    c.arc(pos.x,pos.y,radius,0,Math.PI *2, false)
    c.fillStyle = color
    c.fill()
}

class Player {

    constructor(pos,radius,color, vel, speed, maxVel, mass){
        this.pos = pos
        this.xr = pos.x/canvas.width
        this.yr = pos.y/canvas.height
        this.radius = radius
        this.color = color
        this.vel = vel
        this.speed = speed
        this.maxVel = maxVel
        this.mass = mass
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
    detectWallCollision(type){
        //detecting collision with wall and moving the player to the opposite wall in case
        if(type==1){
            if(this.pos.x-this.radius<0){
                this.pos.x = this.pos.x%canvas.width + canvas.width
            }
            else if(this.pos.x+this.radius>canvas.width){
                this.pos.x = this.pos.x%canvas.width - canvas.width
            }
            if(this.pos.y-this.radius<0){
                this.pos.y = this.pos.y%canvas.height + canvas.height
            }
            else if(this.pos.y+this.radius>canvas.height){
                this.pos.y = this.pos.y%canvas.height - canvas.height
            }
        }
        //collision
        else if(type ==2){
            if(this.pos.x-this.radius<0){
                this.pos.x = this.radius
                this.vel = {x:-this.vel.x,y:this.vel.y}
            }
            else if(this.pos.x+this.radius>canvas.width){
                this.pos.x = canvas.width-this.radius
                this.vel = {x:-this.vel.x,y:this.vel.y}
            }
            if(this.pos.y-this.radius<0){
                this.pos.y = this.radius
                this.vel = {y:-this.vel.y,x:this.vel.x}
            }
            else if(this.pos.y+this.radius>canvas.height){
                this.pos.y = canvas.height-this.radius
                this.vel = {y:-this.vel.y,x:this.vel.x}
            }
        }
    }
    
    updatePos(){
        //drawCircle(this.pos,this.radius+1,"white")
        this.pos = {x: this.pos.x +this.vel.x, y:this.pos.y -this.vel.y }
        this.xr = this.pos.x/canvas.width
        this.yr = this.pos.y/canvas.height
        this.applyFriction()
        this.drawPlayer(this.pos)
    }
}

class PlayerController{
    
    constructor(player){
        this.self = this
        this.player = player
        this.lMB = false
        this.tht = false
        this.cursorPos = {x: innerWidth/2, y: innerHeight/2}

        window.addEventListener("mousedown", this.mouseDownHandler, false)
        window.addEventListener("mouseup", this.mouseUpHandler, false)
        window.addEventListener("mousemove", this.getCursorPosition, false)
        window.addEventListener("touchstart", this.touchDownHandler, false)
        window.addEventListener("touchend", this.touchUpHandler, false)
        window.addEventListener("touchmove", this.getCursorPosition, false)
        
    }

    getCursorPosition(e) {
        const rect = canvas.getBoundingClientRect(e)
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        self.cursorPos = {x:x,y:y}
    }
    getTouchPosition(e) {
        const touchPoint = e.targetTouches.item(0)
        self.cursorPos = {x:touchPoint.clientX,y:touchPoint.clientY}
    }
    mouseDownHandler(){
        //nie mam pojęcia czemu to działa nagle pomocy
        self.lMB = true
    }
    mouseUpHandler(){
        self.lMB = false
    }
    touchDownHandler(){
        self.tht = true
    }
    touchUpHandler(){
        self.tht = false
    }
    followMouse(){
        if(self.lMB==true || self.tht==true){
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
            const a = this.player.speed/c
            const newX =a*dx
            const newY =a*dy
            
            this.player.vel = {x: this.player.vel.x - newX,y: this.player.vel.y + newY}
            //subtract new added speed if it went over max speed
            if(Math.hypot(this.player.vel.x,this.player.vel.y)>this.player.maxVel){
                this.player.vel = {x: this.player.vel.x + newX,y: this.player.vel.y - newY}
            }
        
    }
}


fitCanvasToWindow()
//create player pbject that interacts with onresize
var friction = 0.2 //force vector in the opposite direction
var speed = 2 //can get x pixels per frame faster
var maxVel = Infinity
const defMas = 1
var startingPosVertex = new Vertex(innerWidth/2, innerHeight/2)
const currentPlayer0 = new Player(startingPosVertex, 30, "blue", {x:0,y:0}, speed, maxVel, defMas)
var currentController0 = new PlayerController(currentPlayer0);

window.addEventListener("resize", onResize, false)
currentController0.player.drawPlayer(currentController0.player.pos)


function animate(){
    requestAnimationFrame(animate)
    refreshCanvas()
    currentController0.player.updatePos() //and draw player
    friction = frictionSlider.value
    currentController0.player.speed = accelSlider.value
    if(speedSlider.value == 50){
        currentController0.player.maxVel = Infinity
    }
    else{
        currentController0.player.maxVel = speedSlider.value
    }
    
    if(walls.checked==true){
        currentController0.player.detectWallCollision(2)
    }
    else{
        currentController0.player.detectWallCollision(1)
    }
    currentController0.followMouse()

}

animate()