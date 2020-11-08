import Matter from "matter-js";
import BG from './background.png';
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
        showVelocity: true,
        wireframes: false, //wireframes off
        background: BG
    }
});
Render.run(render);


// create runner
var runner = Runner.create();
Runner.run(runner, physicsEngine); //void

//World Objects
//var collisionGroup1 = Body.nextGroup(true); //groups for collision
var ground = Bodies.rectangle(395, 600, 515, 50, { isStatic: true }); //hardcoded for 600 x 800 display
ground.frictionStatic = 0
ground.friction = 0.01

var players = {
    1: Bodies.rectangle(150, 270, 50, 50, { isStatic: false, label: 1 }),
    2: Bodies.rectangle(400, 270, 50, 50, { isStatic: false, label: 2 })
}

//Circles (Power-Ups)
//Composites.stack(x,y, cols, rows, colGap, rowGap, creationFunc)
var circles = Composites.stack(180, 200, 4, 4, 100, 80,
    function (x, y) {
        return Bodies.circle(x, y, 15, { label: 'item' });
    });

//Triangles (Power-Downs)
var triangles = Composites.stack(250, 250, 2, 2, 300, 250,
    function (x, y) {
        return Bodies.trapezoid(x, y, 20, 20, 1);
    });


//Platform
var platformRight = Bodies.rectangle(canvasWidth - 625, canvasHeight - 150, 225, 20, { isStatic: true })
var platformLeft = Bodies.rectangle(canvasWidth - 175, canvasHeight - 150, 225, 20, { isStatic: true })
var platformTop = Bodies.rectangle(canvasWidth - 400, canvasHeight - 300, 225, 20, { isStatic: true })

//Walls
//Bodies.rectangle(x, y, width, height, {optionsJSON})
var bottomWall = Bodies.rectangle(canvasWidth / 2, 0, canvasWidth, 1, { label: 'wall', isStatic: true });
var topWall = Bodies.rectangle(canvasWidth / 2, canvasHeight, canvasWidth, 1, { label: 'wall', isStatic: true });
var rightWall = Bodies.rectangle(canvasWidth, canvasHeight / 2, 1, canvasHeight, { label: 'wall', isStatic: true });
var leftWall = Bodies.rectangle(0, canvasHeight / 2, 1, canvasHeight, { label: 'wall', isStatic: true });

//Main world add
World.add(world,
    [ground,
        circles,
        triangles,
        platformRight,
        platformLeft,
        platformTop,
        bottomWall,
        topWall,
        rightWall,
        leftWall
    ]);

function add_players() {
    for (let num in players) {
        World.add(world, [players[num]]);
    }
}

add_players()

function powerUp(obj) {
    obj.render.sprite.xScale = obj.render.sprite.xScale * 2;
    obj.render.sprite.yScale = obj.render.sprite.yScale * 2;
    Body.scale(obj, 2, 2);

}

//collsion detection
function detectCollision() {
    Events.on(physicsEngine, 'collisionStart', function (event) {
        let pairs = event.pairs;
        pairs.forEach(function (pair) {
            if (pair.bodyA.label === 'player' && pair.bodyB.label === 'item') {
                powerUp(pair.bodyA)
                console.log("10");
            }
            else if (pair.bodyA.label === 'item' && pair.bodyB.label === 'player') {
                console.log("20");
                World.remove(world, pair.bodyB);
            }
            else if (pair.bodyA.label === 'player2' && pair.bodyB.label === 'player') {
                powerUp(pair.bodyA)
                World.remove(world, pair.bodyB);
                console.log("10");
            }
            else if (pair.bodyA.label === 'player' && pair.bodyB.label === 'player2') {
                console.log("20");
                World.remove(world, pair.bodyA);
            }
        })
    })
}


detectCollision()
// fit the render viewport to the scene
Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: canvasWidth, y: canvasHeight }
});

var state = {};
var movementLeft = {};
var movementRight = {};

function setup_players() {
    for (let num in players) {
        players[num].density = 2
        players[num].frictionAir = 0
        movementLeft[num] = null;
        movementRight[num] = null;
    }
}

setup_players();

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