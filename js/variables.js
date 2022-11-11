class Variables{
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d')
    ui = document.getElementById("UIBar")
    friction = 0.2; //force vector in the opposite direction
    speed = 2; //can get x pixels per dt faster
    maxVel = Infinity;
    collisionType =1;
    defMas = 1;
    controllerArr = [];
    nextClickAddBall=0;
}
 

export var variables= new Variables();;