import Matter from "matter-js";
const height = 600;
const width = 800;


var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composites = Matter.Composites,
    Constraint = Matter.Constraint,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Vector = Matter.Vector;

// create engine
var engine = Engine.create(),
    world = engine.world;

// create renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: 800,
        height: 600,
        showAngleIndicator: true,
        showCollisions: true,
        showVelocity: true
    }
});

Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

// add bodies
var group = Body.nextGroup(true);

var stack = Composites.stack(250, 255, 1, 6, 0, 0, function (x, y) {
    return Bodies.rectangle(x, y, 30, 30);
});

var catapult = Bodies.rectangle(400, 520, 320, 20, { collisionFilter: { group: group } });
var ground = Bodies.rectangle(395, 600, 815, 50, { isStatic: true }),
rockOptions = { density: 0.004 },
rock = Bodies.polygon(170, 450, 8, 20, rockOptions),
anchor = { x: 170, y: 450 },
elastic = Constraint.create({ 
    pointA: anchor, 
    bodyB: rock, 
    stiffness: 0.05
});

World.add(world, [
    stack,
    catapult,
    Bodies.rectangle(400, 600, 800, 50.5, { isStatic: true }),
    Bodies.rectangle(250, 555, 20, 50, { isStatic: true }),
    Bodies.rectangle(400, 535, 20, 80, { isStatic: true, collisionFilter: { group: group } }),
    Bodies.circle(560, 100, 50, { density: 0.005 }),

    //This is for the walls
    Bodies.rectangle(width/2, 0,               width, 1,              { label: 'wall',isStatic: true }),   //bottom
    Bodies.rectangle(width/2, height,   width, 1,              { label: 'wall',isStatic: true }),   //top
    Bodies.rectangle(width,   height/2, 1,            height,  { label: 'wall',isStatic: true }),   //right
    Bodies.rectangle(0,              height/2, 1,            height,  { label: 'wall',isStatic: true }),    //left
    ground , rock, elastic,


    Constraint.create({
        bodyA: catapult,
        pointB: Vector.clone(catapult.position),
        stiffness: 1,
        length: 0
    })
]);

// add mouse control
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

World.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

// fit the render viewport to the scene
Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 800, y: 600 }
});