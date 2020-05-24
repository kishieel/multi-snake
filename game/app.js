const socket = io()

document.addEventListener('keydown', (e) => {
	switch( e.keyCode ) {
		case 65: // A
			socket.emit('move', [-1,0])
			break
		case 87: // W
			socket.emit('move', [0,-1])
			break
		case 68: // D
			socket.emit('move', [1,0])
			break
		case 83: // S
			socket.emit('move', [0,1])
			break
		case 32: // SPACE
			socket.emit('death')
			break
	}
})

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

socket.on('update', function( state ) {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

	const player = state.players[ socket.id ]

	ctx.beginPath()
	ctx.fillStyle = 'gold'
	for ( const [i, pos] of state.fruits.entries() ) {

		if ( player.positions[0].x === pos.x && player.positions[0].y === pos.y ) {
			socket.emit('eat', i)
			continue
		}

		ctx.fillRect( pos.x, pos.y, 20, 20 )
	}

<<<<<<< HEAD
	const me = players[ socket.id ]

	for (var id in players) {
		var player = players[id];
		context.beginPath();
		context.fillStyle = `#${player.color}`
		for ( const pos of player.position ) {
			context.fillRect(pos.x, pos.y, 20, 20);

			if ( socket.id !== id ) {
				
=======
	for ( const id in state.players ) {
		const snake = state.players[ id ]

		ctx.beginPath()
		ctx.fillStyle = `#${snake.color}`
		for ( const pos of snake.positions ) {
			ctx.fillRect( pos.x, pos.y, 20, 20 )

			if ( id !== socket.id ) {
				if ( player.positions[0].x === pos.x && player.positions[0].y === pos.y ) {
					socket.emit('death')
				}
>>>>>>> 0f30ac2accf684b67e800b245cef6cbda93a1c82
			}
		}
	}

})
