import { PlayerController } from "./Controller.js";
import { Player } from "./Player.js";
import { variables } from "./variables.js";
import * as GMath from "./Math.js"



export class GUIManager{
    currentController;
    self;

    walls;
    ui;
    speedSlider;
    frictionSlider;
    accelSlider;
    colorPicker;
    

    constructor(controller){
        self = this;
        this.currentController = controller;
        self.currentController = controller;

        this.ui = document.getElementById("UIBar")

        this.walls = document.getElementById("wallsCheckbox")

        this.speedSlider = document.getElementById("ballSpeed")

        this.frictionSlider = document.getElementById("friction")

        this.accelSlider = document.getElementById("acceleration")

        this.ballAdding = document.getElementById("ballAdding");
        
        this.colorPicker = document.getElementById("colorPicker");
        
        this.animationRocker = document.getElementById("animationPause")
    }
    attachController(controller){
        self.currentController = controller;
    }
    attachControll(){
        this.walls.addEventListener("change",this.wallsChange,false);
        
        this.accelSlider.addEventListener("change",this.accelSliderChange,false);
        
        this.frictionSlider.addEventListener("change",this.frictionSliderChange,false);
        
        this.speedSlider.addEventListener("change",this.speedSliderChange,false);

        this.ballAdding.addEventListener("click",this.ballAddingClick,false);
        
        variables.canvas.addEventListener("click",this.canvasClick,false);

        this.colorPicker.addEventListener("change",this.colorPick,false);

        this.animationRocker.addEventListener("change",this.animationPause,false);
    }
    removeControll(){
        this.walls.removeEventListener("change",this.wallsChange,false);
        
        this.accelSlider.removeEventListener("change",this.accelSliderChange,false);
        
        this.frictionSlider.removeEventListener("change",this.frictionSliderChange,false);
        
        this.speedSlider.removeEventListener("change",this.speedSliderChange,false);

        this.ballAdding.removeEventListener("click",this.ballAddingClick,false);

        variables.canvas.removeEventListener("click",this.canvasClick,false);

        this.colorPicker.removeEventListener("change",this.colorPick,false);

        this.animationRocker.removeEventListener("change",this.animationPause,false);
    }

    animationPause(e){
        switch(e.target.checked){
            case(false):{
                variables.doAnimationStep = 0;
                break;
            }
            case(true):{
                variables.doAnimationStep = 1;
                break;
            }
        }
    }
    colorPick(e){
        self.currentController.player.color = e.target.value
    }

    wallsChange(e){
        switch(e.target.checked){
            case(false):{
                // self.currentController.player.collisionType =1;
                variables.collisionType=1;
                break;
            }
            case(true):{
                // self.currentController.player.collisionType =2;
                variables.collisionType=2;
                break;
            }
        }
    }
    accelSliderChange(e){
        self.currentController.player.speed = e.target.value
        variables.speed = e.target.value;
    }
    frictionSliderChange(e){
        self.currentController.player.friction = e.target.value
        variables.friction = e.target.value;
    }
    speedSliderChange(e){
        if(e.target.value == e.target.max){
            self.currentController.player.maxVel = Infinity
            variables.maxVel = Infinity;
        }
        else{
            self.currentController.player.maxVel = e.target.value
            variables.maxVel = e.target.value;
        }
    }
    ballAddingClick(e){
        switch(variables.nextClickAddBall){
            case(0):{
                variables.nextClickAddBall = 1;
                break;
            }
            case(1):{
                variables.nextClickAddBall = 0;
                break;
            }
        }
        

    }
    updateGUI(){
        self.colorPicker.value = self.currentController.player.color;
        // self.walls.checked = self.currentController.player.collisionType-1;
        self.accelSlider.value = self.currentController.player.speed;
        self.frictionSlider.value = self.currentController.player.friction;
        self.speedSlider.value = self.currentController.player.maxVel;
    }

    canvasClick(e){
        if(variables.nextClickAddBall===0){
            // switch controlls to a ball that has been chosen
            const clickPos = {x:e.offsetX,y:e.offsetY};
            var minDistance = Infinity;
            var closest = 0//index of a player that's the closest to the click
            for(var i=0;i<variables.controllerArr.length;i++){
                const dist = GMath.distance(variables.controllerArr[i].player.pos,clickPos)
                if(dist < minDistance){
                    minDistance = dist;
                    closest = i;
                }
            }
            self.currentController = variables.controllerArr[closest];
            self.updateGUI();
        }
        else{
            // variables.nextClickAddBall =0;
            const newPlayer = new Player(
                variables.ctx, 
                {x:e.offsetX,y:e.offsetY}, 
                variables.defRadius, 
                self.colorPicker.value, 
                {x:0,y:0}, 
                variables.speed, 
                variables.maxVel, 
                variables.defMass, 
                variables.friction,
            );
            const newController = new PlayerController(newPlayer,true);
            self.currentController = newController;
            variables.controllerArr.push(newController);
        }

    }
    pauseGame(e){
        variables.doAnimationStep = !variables.doAnimationStep;
    }
    
    
}