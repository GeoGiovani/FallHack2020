import Matter from "matter-js";

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

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

// add bodies
var group = Body.nextGroup(true);

//World Objects
var rectangles = Composites.stack(250, 255, 1, 6, 0, 0, //Bunch of rectangles
    function (x, y) { return Bodies.rectangle(x, y, 30, 30); }
); //last arg is effective lambda
var catapult = Bodies.rectangle(400, 520, 320, 20, { collisionFilter: { group: group } });
var ground = Bodies.rectangle(395, 600, 815, 50, { isStatic: true });
var rockOptions = { density: 0.004 };
var rock = Bodies.polygon(170, 450, 8, 20, rockOptions);
var anchor = { x: 170, y: 450 };
var elastic = Constraint.create({
    pointA: anchor,
    bodyB: rock,
    stiffness: 0.05
});
var rect1 = Bodies.rectangle(400, 600, 800, 50.5, { isStatic: true });
var rect2 = Bodies.rectangle(250, 555, 20, 50, { isStatic: true });
var rect3 = Bodies.rectangle(400, 535, 20, 80, { isStatic: true, collisionFilter: { group: group } });
var circle1 = Bodies.circle(560, 100, 50, { density: 0.005 });

//Walls
//Bodies.rectangle(x, y, width, height, {optionsJSON})
var bottomWall = Bodies.rectangle(canvasWidth / 2, 0, canvasWidth, 1, { label: 'wall', isStatic: true });
var topWall = Bodies.rectangle(canvasWidth / 2, canvasHeight, canvasWidth, 1, { label: 'wall', isStatic: true });
var rightWall = Bodies.rectangle(canvasWidth, canvasHeight / 2, 1, canvasHeight, { label: 'wall', isStatic: true });
var leftWall = Bodies.rectangle(0, canvasHeight / 2, 1, canvasHeight, { label: 'wall', isStatic: true });
var worldConstraint = Constraint.create({
    bodyA: catapult,
    pointB: Vector.clone(catapult.position),
    stiffness: 1,
    length: 0
});


var catapult = Bodies.rectangle(400, 520, 320, 20, { collisionFilter: { group: group } });

World.add(world, [
    stack,
    catapult,
    Bodies.rectangle(400, 600, 800, 50.5, { isStatic: true }),
    Bodies.rectangle(250, 555, 20, 50, { isStatic: true }),
    Bodies.rectangle(400, 535, 20, 80, { isStatic: true, collisionFilter: { group: group } }),
    Bodies.circle(560, 100, 50, { density: 0.005 }),
    Constraint.create({
        bodyA: catapult,
        pointB: Vector.clone(catapult.position),
        stiffness: 1,
        length: 0
    })
]);

//Mouse --must be rendered after
var mouse = Mouse.create(render.canvas); // add mouse control
var mouseConstraint = MouseConstraint.create(physicsEngine, //must be added to world
    {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: { visible: false }
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


Events.on(Engine, "mousedown", function (event) {
    console.log("Added force...")

    // let object = Composite.

    // let forceMagnitude = 1000 * rect1.mass;

    // Body.applyForce(rect1, rect1.position, {
    //     x: (forceMagnitude),
    //     y: 0
    // })

    console.log("Added force...")
});