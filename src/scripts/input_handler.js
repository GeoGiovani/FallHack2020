import { moveLeft, moveRight, moveUp, stopLeft, stopRight } from './game';

var input_receiver = document.body

let players = {
    1: { left: 'a', right: 'd', up: 'w' },
    2: { left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp' }
}

function setup_event_listeners() {
    for (let i in players) {
        input_receiver.addEventListener('keydown', function (event) {
            switch (event.key) {
                case players[i].left:
                    moveLeft(i)
                    break

                case players[i].right:
                    moveRight(i)
                    break

                case players[i].up:
                    moveUp(i)
                    break

                default:
                    return
            }
        })

        input_receiver.addEventListener('keyup', function (event) {
            switch (event.key) {
                case players[i].left:
                    stopLeft(i)
                    break

                case players[i].right:
                    stopRight(i)
                    break

                default:
                    return
            }
        })
    }
}

setup_event_listeners()