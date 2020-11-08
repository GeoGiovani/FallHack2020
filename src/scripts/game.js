import Matter, { Composite } from "matter-js";
import BACKGROUND from "./background.png";

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
var render = Render.create({ //Create object  'render' of type Render containing rendering attributes
    element: document.body,
    engine: physicsEngine,
    options: {
        width: 800,
        height: 600,
        showAngleIndicator: true,
        showCollisions: true,
        showVelocity: true,
        background: BACKGROUND,
        wireframes: false
    }
});
Render.run(render);
// create runner
var runner = Runner.create();
Runner.run(runner, physicsEngine); //void

//World Objects
var collisionGroup1 = Body.nextGroup(true); //groups for collision
var ground = Bodies.rectangle(395, 600, 815, 50, { isStatic: true });
var rect1 = Bodies.rectangle(150, 270, 40, 50, { isStatic: true });


//Walls
//Bodies.rectangle(x, y, width, height, {optionsJSON})
var bottomWall = Bodies.rectangle(canvasWidth / 2, 0, canvasWidth, 1, { label: 'wall', isStatic: true });
var topWall = Bodies.rectangle(canvasWidth / 2, canvasHeight, canvasWidth, 1, { label: 'wall', isStatic: true });
var rightWall = Bodies.rectangle(canvasWidth, canvasHeight / 2, 1, canvasHeight, { label: 'wall', isStatic: true });
var leftWall = Bodies.rectangle(0, canvasHeight / 2, 1, canvasHeight, { label: 'wall', isStatic: true });


//Main world add
World.add(world, [ground, rect1, bottomWall, topWall, rightWall, leftWall]);

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

World.add(world, mouseConstraint)
render.mouse = mouse; //keep the mouse in sync with rendering

// fit the render viewport to the scene
Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 800, y: 600 }
});

Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 800, y: 600 }
});

export function moveLeft(playerNum) {
    if (movementRight[playerNum] !== null) {
        clearTimeout(movementRight[playerNum])
        movementRight[playerNum] = null
    }

    if (movementLeft[playerNum] !== null) {
        return
    }

    moveLeftInternal(playerNum)
}

function moveLeftInternal(playerNum) {
    Body.setVelocity(players[playerNum], {
        x: -3,
        y: players[playerNum].velocity.y
    })

    movementLeft[playerNum] = setTimeout(moveLeftInternal, 16, playerNum);
}

export function moveRight(playerNum) {
    if (movementLeft[playerNum] !== null) {
        clearTimeout(movementLeft[playerNum])
        movementLeft[playerNum] = null
    }

    if (movementRight[playerNum] !== null) {
        movementRight[playerNum] = null
        return
    }

    moveRightInternal(playerNum)
}

function moveRightInternal(playerNum) {
    Body.setVelocity(players[playerNum], {
        x: 3,
        y: players[playerNum].velocity.y
    })

    movementRight[playerNum] = setTimeout(moveRight, 16, playerNum);
}

export function moveUp(playerNum) {
    if (state[playerNum] !== "jumping") {
        Body.setVelocity(players[playerNum], {
            x: players[playerNum].velocity.x,
            y: -8
        })

        state[playerNum] = "jumping"
        setTimeout(function () {
            state[playerNum] = "grounded"
        }, 2000)
    }
}

export function stopLeft(playerNum) {
    if (movementLeft[playerNum] !== null) {
        clearTimeout(movementLeft[playerNum])
        movementLeft[playerNum] = null
    }
}

export function stopRight(playerNum) {
    if (movementRight[playerNum] !== null) {
        clearTimeout(movementRight[playerNum])
        movementRight[playerNum] = null
    }
}




































































