import Matter from "matter-js";
const canvasHeight = 600;
const canvasWidth = 800;

//Init
var Engine = Matter.Engine;
var Render = Matter.Render;
var Runner = Matter.Runner;
var Events = Matter.Events;
var Composites = Matter.Composites;
var Constraint = Matter.Constraint;
var MouseConstraint = Matter.MouseConstraint;
var Mouse = Matter.Mouse;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Body = Matter.Body;
var Vector = Matter.Vector;

// create engine
var physicsEngine = Engine.create();
var world = physicsEngine.world; //World object can contain many worlds, we only need our 1

// create renderer
//JSON Object: {Key:Value, Key:Value, ...}
var render = Render.create({ //Create object 'render' of type Render containing rendering attributes
    element: document.body,
    engine: physicsEngine,
    options: {
        width: 800,
        height: 600,
        showAngleIndicator: true,
        showCollisions: true,
        showVelocity: true
    }
});
Render.run(render);

//World Objects

var collisionGroup1 = Body.nextGroup(true); //groups for collision
var ground = Bodies.rectangle(395, 600, 515, 50, {isStatic: true}); //hardcoded for 600 x 800 display

//Rectangle(s)
var rectangle_x = 50 //check and manipulate these to move rect1
var rectangle_y = 70
var rect1 = Bodies.rectangle(rectangle_x, rectangle_y, 40, 50);

//Platform
var platformRight = Bodies.rectangle(canvasWidth-625, canvasHeight-150, 225, 20, {isStatic: true})
var platformLeft = Bodies.rectangle(canvasWidth-175, canvasHeight-150, 225, 20, {isStatic: true})
var platformTop = Bodies.rectangle(canvasWidth-400, canvasHeight-300, 225, 20, {isStatic: true})

//Walls
//Bodies.rectangle(x, y, width, height, {optionsJSON})
var bottomWall = Bodies.rectangle(canvasWidth/2, 0, canvasWidth, 1, {label: 'wall', isStatic: true});
var topWall = Bodies.rectangle(canvasWidth/2, canvasHeight, canvasWidth, 1, {label: 'wall',isStatic: true});
var rightWall = Bodies.rectangle(canvasWidth, canvasHeight/2, 1, canvasHeight, {label: 'wall',isStatic: true});
var leftWall = Bodies.rectangle(0, canvasHeight/2, 1, canvasHeight, {label: 'wall',isStatic: true});


//Main world add
World.add(world, [ground, rect1, platformRight, platformLeft, platformTop, bottomWall, topWall, rightWall, leftWall]);

//Mouse --must be rendered after
var mouse = Mouse.create(render.canvas); // add mouse control
var mouseConstraint = MouseConstraint.create(physicsEngine, //must be added to world
    {mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {visible: false}
        }
    });

World.add(world, mouseConstraint)
render.mouse = mouse; //keep the mouse in sync with rendering

// fit the render viewport to the scene
Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: canvasWidth, y: canvasHeight }
});