class Variables{
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d')
    ui = document.getElementById("UIBar")

    controllerArr = [];

    collisionType =1;

    friction = 0.005; //force vector in the opposite direction
    speed = 0.2; //can get x pixels per dt faster
    maxVel = 25;
    defRadius = 20;
    defMass = Math.pow(10,4);
    defDensity = Math.pow(10,4)/((4/3)*Math.PI*Math.pow(this.defRadius,3));
    cursorMass=Math.pow(10,4);
    G=6.6743015; // G=6.6743015e-11



    nextClickAddBall=0;
    doAnimationStep=1;

}
 

export var variables= new Variables();