import { TimeManager } from "./TimeManager.js";
import { Player } from "./Player.js"
import { PlayerController } from "./Controller.js";
import { GUIManager } from "./GUI.js";
import { variables } from "./variables.js";


// var canvas = document.querySelector('canvas');
var canvas = variables.canvas;

var ctx = variables.ctx;

var ui = variables.ui

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

const currentPlayer = new Player(
    ctx, 
    {
        x:canvas.width/2,
        y:canvas.height/2
    }, 
    variables.defRadius, 
    "#0000FF", 
    {
        x:0,
        y:0
    }, 
    variables.speed, 
    variables.maxVel, 
    variables.defMass, 
    variables.friction, 
    )

var currentController = new PlayerController(currentPlayer,true);
currentController.addControll();
//currentController0.removeControll();

variables.controllerArr.push(currentController);


const guiManager = new GUIManager(currentController);
guiManager.attachControll();


const timeManager = new TimeManager();

const drawPlayers = ()=>{
    variables.controllerArr.forEach((controller)=>{
        controller.player.drawPlayer(controller.player.pos);
    })
}

const frameLogic = (timeManagerResult)=>{
    for(var i=0;i<variables.controllerArr.length;i++){
        for(var j=0;j<variables.controllerArr.length;j++){
            if(i==j) continue;
            variables.controllerArr[i].followPlayer(variables.controllerArr[j].player,timeManagerResult.dt);   
        }
        variables.controllerArr[i].updatePlayerPos(timeManagerResult.dt);
    }
    
}

function animate(){
    const timeManagerResult = timeManager.timeDelta();
    refreshCanvas();

    if(variables.doAnimationStep) frameLogic(timeManagerResult);

    drawPlayers();

    //console.log("fps:", timeManagerResult.fps)
    requestAnimationFrame(animate)
    
}

animate()