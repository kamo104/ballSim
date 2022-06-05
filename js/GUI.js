export class GUIManager{
    constructor(controller){
        this.self = this;
        this.currentController =controller;
        self.currentController = controller;

        this.ui = document.getElementById("UIBar")

        this.walls = document.getElementById("wallsCheckbox")

        this.speedSlider = document.getElementById("ballSpeed")

        this.frictionSlider = document.getElementById("friction")

        this.accelSlider = document.getElementById("acceleration")
    }
    attachController(controller){
        self.currentController = controller;
    }
    attachControll(){
        this.walls.addEventListener("change",this.wallsChange,false);
        
        this.accelSlider.addEventListener("change",this.accelSliderChange,false);
        
        this.frictionSlider.addEventListener("change",this.frictionSliderChange,false);
        
        this.speedSlider.addEventListener("change",this.speedSliderChange,false)
    }
    removeControll(){
        this.walls.removeEventListener("change",this.wallsChange,false);
        
        this.accelSlider.removeEventListener("change",this.accelSliderChange,false);
        
        this.frictionSlider.removeEventListener("change",this.frictionSliderChange,false);
        
        this.speedSlider.removeEventListener("change",this.speedSliderChange,false)
    }

    wallsChange(e){
        switch(e.target.checked){
            case(false):{
                self.currentController.player.collisionType =1;
                break;
            }
            case(true):{
                self.currentController.player.collisionType =2;
                break;
            }
        }
    }
    accelSliderChange(e){
        self.currentController.player.speed = e.target.value
    }
    frictionSliderChange(e){
        self.currentController.player.friction = e.target.value
    }
    speedSliderChange(e){
        if(e.target.value == 50){
            self.currentController.player.maxVel = Infinity
        }
        else{
            self.currentController.player.maxVel = e.target.value
        }
    }
    
    
}