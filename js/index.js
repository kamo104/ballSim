import { PlayerController } from "./Controller.js";

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d')

var ui = document.getElementById("UIBar")

const walls = document.getElementById("wallsCheckbox")

const speedSlider = document.getElementById("ballSpeed")

const frictionSlider = document.getElementById("friction")

const accelSlider = document.getElementById("acceleration")

function refreshCanvas(){
    ctx.fillStyle = "black"
    ctx.fillRect(0,0,canvas.width,canvas.height)
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

class Player {

    constructor(pos,radius,color, vel, speed, maxVel, mass){
        this.pos = pos
        this.preCollsionPos = pos

        this.radius = radius
        this.color = color
        this.vel = vel
        this.speed = speed
        this.maxVel = maxVel
        this.mass = mass
        this.superPosition = false;
        
    }

    drawPlayer(pos) {
        if(this.superPosition){
            this.superPosition = false;
            ctx.beginPath()
            ctx.arc(this.preCollsionPos.x,this.preCollsionPos.y,this.radius,0,Math.PI *2, false)
            ctx.fillStyle = this.color
            ctx.fill()
        }
        ctx.beginPath()
        ctx.arc(pos.x,pos.y,this.radius,0,Math.PI *2, false)
        ctx.fillStyle = this.color
        ctx.fill()
    }
}




fitCanvasToWindow()
window.addEventListener("resize", onResize, false)
//create player pbject that interacts with onresize
var friction = 0.2 //force vector in the opposite direction
var speed = 2 //can get x pixels per frame faster
var maxVel = Infinity
const defMas = 1
const currentPlayer = new Player({x:innerWidth/2,y:innerHeight/2}, 30, "blue", {x:0,y:0}, speed, maxVel, defMas)
var currentController = new PlayerController(currentPlayer);
currentController.addControll(currentPlayer);
//currentController0.removeControll();



var collisionType =1

walls.addEventListener("change",(e)=>{
    switch(e.target.checked){
        case(false):{
            collisionType =1;
            break;
        }
        case(true):{
            collisionType =2;
            break;
        }
    }
})

accelSlider.addEventListener("change",(e)=>{
    currentController.player.speed = e.target.value
})

frictionSlider.addEventListener("change",(e)=>{
    friction = e.target.value
})

speedSlider.addEventListener("change",(e)=>{
    if(e.target.value == 50){
        currentController.player.maxVel = Infinity
    }
    else{
        currentController.player.maxVel = e.target.value
    }
})

function animate(){
    
    refreshCanvas()
    currentController.followMouse()
    currentController.updatePlayerPos(collisionType,friction)
    
    
    requestAnimationFrame(animate)
}

animate()