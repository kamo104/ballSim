import { TimeManager } from "./TimeManager.js";
import { Player } from "./Player.js"
import { PlayerController } from "./Controller.js";
import { GUIManager } from "./GUI.js";

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d')

const ui = document.getElementById("UIBar")

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

fitCanvasToWindow()
window.addEventListener("resize", onResize, false)
//create player pbject that interacts with onresize
var friction = 0.2; //force vector in the opposite direction
var speed = 2; //can get x pixels per dt faster
var maxVel = Infinity;
var collisionType =1;
var defMas = 1;

const currentPlayer = new Player(ctx, {x:innerWidth/2,y:innerHeight/2}, 30, "blue", {x:0,y:0}, speed, maxVel, defMas, friction, collisionType)
var currentController = new PlayerController(currentPlayer,true);
currentController.addControll();
//currentController0.removeControll();

const controllerArr = [];
controllerArr.push(currentController);


const guiManager = new GUIManager(currentController);
guiManager.attachControll();

const timeManager = new TimeManager();

function animate(){
    const timeManagerResult = timeManager.timeDelta();
    refreshCanvas()
    currentController.updatePlayerPos(timeManagerResult.dt)
    console.log("fps:", timeManagerResult.fps)
    requestAnimationFrame(animate)
    
}

animate()