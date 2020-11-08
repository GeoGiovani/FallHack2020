import Matter from "matter-js";
import BG from './background.png';
const canvasHeight = 600;
const canvasWidth = 800;
const playerSize = 50;

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
        showAngleIndicator: false,
        showCollisions: true,
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
var ground = Bodies.rectangle(395, 600, 515, 50, { isStatic: true, render: { fillStyle: "#964B00" } }); //hardcoded for 600 x 800 display
ground.frictionStatic = 0.1
ground.friction = 0.1

var players = {
    1: Bodies.rectangle(150, 270, playerSize, playerSize, { isStatic: false, label: 'playerBlue' }),
    2: Bodies.rectangle(400, 270, playerSize, playerSize, { isStatic: false, label: 'playerRed' })
}

//Circles (Power-Ups)
var powers = {
    1: Bodies.circle(200, 200, 15, { isStatic: true, render: { fillStyle: "#6A5ACD" }, label: 'power1' }),
    2: Bodies.circle(440, 500, 15, { isStatic: true, render: { fillStyle: "#6A5ACD" }, label: 'power2' }),
    3: Bodies.circle(700, 300, 15, { isStatic: true, render: { fillStyle: "#6A5ACD" }, label: 'power3' }),
}

//Platform
var platformRight = Bodies.rectangle(canvasWidth - 625, canvasHeight - 150, 225, 20, { isStatic: true });
var platformLeft = Bodies.rectangle(canvasWidth - 175, canvasHeight - 150, 225, 20, { isStatic: true });
var platformTop = Bodies.rectangle(canvasWidth - 400, canvasHeight - 300, 225, 20, { isStatic: true });

//Walls
//Bodies.rectangle(x, y, width, height, {optionsJSON})
var bottomWall = Bodies.rectangle(canvasWidth / 2, 0, canvasWidth, 1, { label: 'wall', isStatic: true });
var topWall = Bodies.rectangle(canvasWidth / 2, canvasHeight, canvasWidth, 1, { isStatic: true });
var rightWall = Bodies.rectangle(canvasWidth, canvasHeight / 2, 1, canvasHeight, { label: 'wall', isStatic: true });
var leftWall = Bodies.rectangle(0, canvasHeight / 2, 1, canvasHeight, { label: 'wall', isStatic: true });

//Main world add
World.add(world,
    [ground,
        platformRight,
        platformLeft,
        platformTop,
        bottomWall,
        topWall,
        rightWall,
        leftWall
    ]);

function add_entities() {
    for (let num in players) {
        World.add(world, [players[num]]);
    }

    for (let num in powers) {
        powers[num].density = 0.01;
        World.add(world, [powers[num]]);
    }
}

add_entities()

function powerUp(obj, power) {
    if (power.position.x == 1000) {
        return
    }

    if (powerupTimer[obj.label] != null) {
        return;
    }

    obj.render.sprite.xScale = 1.5;
    obj.render.sprite.yScale = obj.render.sprite.yScale * 2;
    Body.scale(obj, 1.5, 1.5);

    // Scale down after 5 seconds
    powerupTimer[obj.label] = setTimeout(function () {
        Body.scale(obj, 0.8, 0.8)
        obj.render.sprite.xScale = 0.8;
        obj.render.sprite.yScale = 0.8;
    }, 5000);
}

function removePlayer(player) {
    player.position.x = 1000
    player.position.y = 1000
}

function removePower(power) {
    Body.setStatic(power, false)
    power.position.x = 1000
    power.position.y = 1000
}

function checkPlayerPower(pair) {
    if (pair.bodyA.label.startsWith('player') && pair.bodyB.label.startsWith('power')) {
        powerUp(pair.bodyA, pair.bodyB)
        removePower(pair.bodyB)
    }
    else if (pair.bodyA.label.startsWith('power') && pair.bodyB.label.startsWith('player')) {
        powerUp(pair.bodyB, pair.bodyA)
        removePower(pair.bodyA)
    }
}

function checkPlayerKilled(pair) {
    if (pair.bodyA.label.startsWith('player') && pair.bodyB.label.startsWith('wall')) {
        alert(`Congrats! You destroyed ${pair.bodyA.label.substring(6, pair.bodyA.label.length)}!`);
    }
    else if (pair.bodyA.label.startsWith('wall') && pair.bodyB.label.startsWith('player')) {
        alert(`Congrats! You destroyed ${pair.bodyB.label.substring(6, pair.bodyB.label.length)}!`);
    }
}

//collsion detection
function detectCollision() {
    Events.on(physicsEngine, 'collisionStart', function (event) {
        let pairs = event.pairs;
        pairs.forEach(function (pair) {
            checkPlayerPower(pair);
            checkPlayerKilled(pair);
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
var powerupTimer = {};

function setup_players() {
    for (let num in players) {
        players[num].density = 2
        players[num].frictionAir = 0
        movementLeft[num] = null;
        movementRight[num] = null;
        state[num] = "grounded";
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
            y: -10
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
