// import { hook name } from './catapult';

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
					console.log(`player ${i} moved left`)
					break

				case players[i].right:
					console.log(`player ${i} moved right`)
					break

				case players[i].up:
					console.log(`player ${i} moved up`)
					break

				default:
					return
			}
		})

		input_receiver.addEventListener('keyup', function (event) {
			switch (event.key) {
				case players[i].left:
					console.log(`player ${i} stopped moving left`)
					break

				case players[i].right:
					console.log(`player ${i} stopped moving right`)
					break

				case players[i].up:
					console.log(`player ${i} stopped moving up`)
					break

				default:
					return
			}
		})
	}
}

setup_event_listeners()
