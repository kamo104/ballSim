import { PlayerController } from "./Controller.js";
import { Player } from "./Player.js";
import { variables } from "./variables.js";

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
        this.self = this;
        this.currentController =controller;
        self.currentController = controller;

        this.ui = document.getElementById("UIBar")

        this.walls = document.getElementById("wallsCheckbox")

        this.speedSlider = document.getElementById("ballSpeed")

        this.frictionSlider = document.getElementById("friction")

        this.accelSlider = document.getElementById("acceleration")

        this.ballAdd = document.getElementById("ballAdd");
        
        this.colorPicker = document.getElementById("colorPicker");
    }
    attachController(controller){
        self.currentController = controller;
    }
    attachControll(){
        this.walls.addEventListener("change",this.wallsChange,false);
        
        this.accelSlider.addEventListener("change",this.accelSliderChange,false);
        
        this.frictionSlider.addEventListener("change",this.frictionSliderChange,false);
        
        this.speedSlider.addEventListener("change",this.speedSliderChange,false);

        this.ballAdd.addEventListener("click",this.ballAddClick,false);
        
        variables.canvas.addEventListener("click",this.createNewPlayer,false);
    }
    removeControll(){
        this.walls.removeEventListener("change",this.wallsChange,false);
        
        this.accelSlider.removeEventListener("change",this.accelSliderChange,false);
        
        this.frictionSlider.removeEventListener("change",this.frictionSliderChange,false);
        
        this.speedSlider.removeEventListener("change",this.speedSliderChange,false);

        this.ballAdd.removeEventListener("click",this.ballAddClick,false);

        variables.canvas.removeEventListener("click",this.createNewPlayer,false);
    }

    wallsChange(e){
        switch(e.target.checked){
            case(false):{
                self.currentController.player.collisionType =1;
                variables.collisionType=1;
                break;
            }
            case(true):{
                self.currentController.player.collisionType =2;
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
        if(e.target.value == 50){
            self.currentController.player.maxVel = Infinity
            variables.maxVel = Infinity;
        }
        else{
            self.currentController.player.maxVel = e.target.value
            variables.maxVel = e.target.value;
        }
    }
    ballAddClick(e){
        variables.nextClickAddBall = 1;

    }
    createNewPlayer(e){
        if(variables.nextClickAddBall===0) return;
        variables.nextClickAddBall =0;
        const newPlayer = new Player(
            variables.ctx, 
            {x:e.offsetX,y:e.offsetY}, 
            30, 
            self.colorPicker.value, 
            {x:0,y:0}, 
            variables.speed, 
            variables.maxVel, 
            variables.defMas, 
            variables.friction, 
            variables.collisionType
        );
        const newController = new PlayerController(newPlayer,true);
        self.currentController = newController;
        variables.controllerArr.push(newController);
    }
    
    
}